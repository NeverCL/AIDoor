using AIDoor.WebAPI.Data;
using Microsoft.EntityFrameworkCore;

namespace AIDoor.WebAPI.Extensions;

public static class ApplicationBuilderExtensions
{
    public static WebApplication ConfigurePipeline(this WebApplication app)
    {
        // 全局异常处理中间件（应位于管道最前面）
        app.UseGlobalExceptionHandler();

        // 开发环境配置
        app.MapOpenApi();
        // if (app.Environment.IsDevelopment())
        // {
        // }

        // 中间件管道配置
        app.UseCors(options => options.AllowCredentials().AllowAnyMethod().AllowAnyHeader().WithOrigins("https://app.thedoorofai.com", "https://admin.thedoorofai.com"));
        app.UseStaticFiles();
        app.Use(async (context, next) =>
        {
            var activity = System.Diagnostics.Activity.Current;
            if (activity != null)
            {
                context.Response.Headers.Append("trace-id", activity.TraceId.ToString());
            }
            await next();
        });
        app.UseRouting();

        // 安全中间件
        app.UseAuthentication();
        app.UseAuthorization();

        // 路由配置
        app.MapControllers();
        app.MapHealthChecks("/healthz");

        return app;
    }

    public static WebApplication SeedDatabase(this WebApplication app)
    {
        using (var scope = app.Services.CreateScope())
        {
            var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            // 执行迁移
            dbContext.Database.Migrate();

            // 初始化种子数据
            var initData = new InitData();
            initData.Seed(dbContext);
        }

        return app;
    }
}