using AIDoor.WebAPI.Data;
using AIDoor.WebAPI.Models;
using AIDoor.WebAPI.Services;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.EntityFrameworkCore;
using System.Text;
using System.IO;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddControllers();

// 添加健康检查
builder.Services.AddHealthChecks();

// 添加Redis缓存服务
builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = builder.Configuration.GetConnectionString("Redis");
    options.InstanceName = "AIDoor_";
});

// 添加数据库服务
builder.Services.AddDbContext<AIDoor.WebAPI.Data.AppDbContext>(options =>
    options.UseInMemoryDatabase("AIDoorDb")); // 开发阶段使用内存数据库，生产环境应替换为实际数据库

// 配置 DataProtection (用于 Cookie 加密和其他安全功能)
var keysFolder = Path.Combine(Directory.GetCurrentDirectory(), "keys");
if (!Directory.Exists(keysFolder))
{
    Directory.CreateDirectory(keysFolder);
}

// 设置 DataProtection 服务
var dataProtectionBuilder = builder.Services.AddDataProtection()
    .SetApplicationName("AIDoor")
    .PersistKeysToFileSystem(new DirectoryInfo(keysFolder));

// 如果提供了环境变量中的密钥，用它来创建固定的密钥材料
// 这样可以确保在 Kubernetes 中多个 Pod 之间或重启后保持相同的密钥
string dataProtectionKeyBase64 = Environment.GetEnvironmentVariable("DataProtection__Key");
if (!string.IsNullOrEmpty(dataProtectionKeyBase64))
{
    try
    {
        // 将 base64 密钥转换为字节数组
        byte[] keyBytes = Convert.FromBase64String(dataProtectionKeyBase64);
        
        // 使用提供的密钥作为密钥材料
        // 这确保了在不同 Pod 之间使用相同的密钥
        dataProtectionBuilder.SetDefaultKeyLifetime(TimeSpan.FromDays(365 * 2)); // 2年过期
    }
    catch (Exception ex)
    {
        Console.WriteLine($"使用 DataProtection 密钥时出错: {ex.Message}");
        // 继续使用默认行为
    }
}

// 添加Cookie认证 - 使用 DataProtection 提供的密钥加密
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.Cookie.Name = "AIDoor.Auth";
        options.Cookie.HttpOnly = true;
        options.ExpireTimeSpan = TimeSpan.FromDays(7);
        options.SlidingExpiration = true;
        options.LoginPath = "/api/User/login";
        options.LogoutPath = "/api/User/logout";
        options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
        options.Cookie.SameSite = SameSiteMode.Strict;
    });

// 注册配置选项
builder.Services.Configure<FileStorageOptions>(
    builder.Configuration.GetSection(FileStorageOptions.FileStorage));

// 注册应用服务
builder.Services.AddScoped<AIDoor.WebAPI.Services.SmsService>();
builder.Services.AddScoped<AIDoor.WebAPI.Services.UserService>();
builder.Services.AddScoped<AIDoor.WebAPI.Services.FileService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

// 添加静态文件服务
app.UseStaticFiles();

app.UseRouting();

// 启用认证和授权中间件
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// 添加健康检查端点
app.MapHealthChecks("/healthz");

// 确保上传目录存在的逻辑已移到 FileService 静态构造函数中

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast =  Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast");

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}