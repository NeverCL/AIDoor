namespace AIDoor.WebAPI.Extensions;

public static class ApplicationBuilderExtensions
{
    public static WebApplication ConfigurePipeline(this WebApplication app)
    {
        // 开发环境配置
        if (app.Environment.IsDevelopment())
        {
            app.MapOpenApi();
        }

        // 中间件管道配置
        app.UseStaticFiles();
        app.UseRouting();

        // 安全中间件
        app.UseAuthentication();
        app.UseAuthorization();

        // 路由配置
        app.MapControllers();
        app.MapHealthChecks("/healthz");

        return app;
    }
} 