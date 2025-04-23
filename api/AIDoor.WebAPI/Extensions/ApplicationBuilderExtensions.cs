using AIDoor.WebAPI.Data;
using Microsoft.EntityFrameworkCore;

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
        app.UseCors(options => options.AllowAnyMethod().AllowAnyHeader().AllowAnyOrigin());
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