using AIDoor.WebAPI.Data;
using AIDoor.WebAPI.Options;
using AIDoor.WebAPI.Services;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.EntityFrameworkCore;
using OpenTelemetry;
using OpenTelemetry.Resources;
using OpenTelemetry.Exporter;
using OpenTelemetry.Metrics;
using OpenTelemetry.Trace;

namespace AIDoor.WebAPI.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddCoreServices(this IServiceCollection services, string serviceName)
    {
        services.AddControllers();
        services.AddOpenApi(); // API 文档服务
        services.AddHealthChecks(); // 健康检查
        services.AddHttpContextAccessor();

        // Environment.SetEnvironmentVariable("OTEL_EXPORTER_OTLP_HEADERS", "Authorization=Bearer ge4p0cttir@6581c63854edbf1_ge4p0cttir@53df7ad2afe8301");

        // services.AddOpenTelemetry()
        //     .ConfigureResource(builder => builder.AddService(serviceName))
        //     .WithTracing(trace =>
        //     {
        //         trace.AddAspNetCoreInstrumentation(opt => opt.Filter = ctx =>
        //             ctx.Request.Method != HttpMethod.Options.ToString() &&
        //             !ctx.Request.Path.StartsWithSegments("/healthz"));
        //         trace.AddHttpClientInstrumentation();
        //         trace.AddEntityFrameworkCoreInstrumentation();
        //     })
        //     .WithMetrics(metric =>
        //     {
        //         metric.AddAspNetCoreInstrumentation();
        //         metric.AddHttpClientInstrumentation();
        //         metric.AddRuntimeInstrumentation();
        //     })
        //     .UseOtlpExporter(OtlpExportProtocol.HttpProtobuf, new Uri("http://aspire-dashboard.otlp:18889"))
        //     // .UseOtlpExporter(OtlpExportProtocol.Grpc, new Uri("http://tracing-analysis-dc-bj.aliyuncs.com:8090"))
        //     ;
        //
        // services.AddLogging(builder =>
        // {
        //     builder.ClearProviders();
        //     builder.AddOpenTelemetry(logging => { logging.IncludeScopes = true; });
        // });
        return services;
    }

    public static IServiceCollection AddDataServices(this IServiceCollection services, IConfiguration configuration)
    {
        // 数据库服务
        var connectionString = configuration.GetConnectionString("DefaultConnection");
        services.AddDbContext<AppDbContext>(options =>
            options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

        // Redis缓存服务
        services.AddStackExchangeRedisCache(options =>
        {
            options.Configuration = configuration.GetConnectionString("Redis");
            options.InstanceName = "AIDoor_";
        });

        return services;
    }

    public static IServiceCollection AddSecurityServices(this IServiceCollection services)
    {
        // Cookie authentication service
        services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
            .AddCookie(options =>
            {
                options.Cookie.Name = "AIDoor.Auth";
                options.Cookie.HttpOnly = true;
                options.ExpireTimeSpan = TimeSpan.FromDays(7);
                options.SlidingExpiration = true;
                options.LoginPath = "/api/Account/login";
                options.LogoutPath = "/api/Account/logout";
                options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
                options.Cookie.SameSite = SameSiteMode.None;

                // 禁用自动重定向，使用自定义中间件处理未认证请求
                options.Events = new CookieAuthenticationEvents
                {
                    OnRedirectToLogin = context =>
                    {
                        // 不执行重定向，让自定义中间件处理
                        context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                        return Task.CompletedTask;
                    },
                    OnRedirectToAccessDenied = context =>
                    {
                        context.Response.StatusCode = StatusCodes.Status403Forbidden;
                        return Task.CompletedTask;
                    }
                };

#if DEBUG
                options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
                options.Cookie.SameSite = SameSiteMode.Lax;
#endif
            });

        return services;
    }

    public static IServiceCollection AddSecret(this IServiceCollection services)
    {
        // 配置 DataProtection (用于 Cookie 加密和其他安全功能)
        var keysFolder = Path.Combine(Directory.GetCurrentDirectory(), "keys");
        if (!Directory.Exists(keysFolder))
        {
            Directory.CreateDirectory(keysFolder);
        }

        // 设置 DataProtection 服务
        var dataProtectionBuilder = services.AddDataProtection()
            .SetApplicationName("AIDoor")
            .PersistKeysToFileSystem(new DirectoryInfo(keysFolder));

        // 加载环境变量中的密钥（用于多实例环境）
        string dataProtectionKeyBase64 = Environment.GetEnvironmentVariable("DataProtection__Key");
        if (!string.IsNullOrEmpty(dataProtectionKeyBase64))
        {
            try
            {
                byte[] keyBytes = Convert.FromBase64String(dataProtectionKeyBase64);
                dataProtectionBuilder.SetDefaultKeyLifetime(TimeSpan.FromDays(365 * 2)); // 2年过期
            }
            catch (Exception ex)
            {
                Console.WriteLine($"使用 DataProtection 密钥时出错: {ex.Message}");
            }
        }

        return services;
    }

    public static IServiceCollection AddConfigOptions(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<AliyunOSSOptions>(
            configuration.GetSection(AliyunOSSOptions.AliyunOSS));

        return services;
    }

    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        // 注册所有应用服务
        services.AddScoped<SmsService>();
        services.AddScoped<UserService>();
        services.AddScoped<AliFileService>();
        services.AddScoped<AppItemService>();
        services.AddScoped<UserContentService>();
        services.AddScoped<UserRecordService>();
        services.AddScoped<CommentService>();
        services.AddScoped<UserFollowService>();
        services.AddScoped<PublisherService>();
        services.AddScoped<PublisherRatingService>();
        services.AddScoped<IChatMessageService, ChatMessageService>();
        services.AddScoped<SystemMessageService>();
        services.AddScoped<BannerService>();

        return services;
    }
}