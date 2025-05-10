using AIDoor.WebAPI.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

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
        app.UseCors(options => options.AllowCredentials().AllowAnyMethod().AllowAnyHeader().WithOrigins("http://192.168.20.157:8000", "https://app.thedoorofai.com", "http://localhost:8000"));
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
            var logger = scope.ServiceProvider.GetRequiredService<ILogger<AppDbContext>>();

            try
            {
                // 执行迁移
                logger.LogInformation("执行数据库迁移...");
                dbContext.Database.Migrate();

                // 初始化种子数据
                logger.LogInformation("初始化种子数据...");
                var initData = new InitData();
                initData.Seed(dbContext);

                // 修复用户与发布者之间的关联关系
                logger.LogInformation("修复用户与发布者关系...");
                Task.Run(async () => await DataMigrations.FixUserPublisherRelationshipAsync(app.Services))
                    .GetAwaiter()
                    .GetResult();

                // 修复 TargetUserId 数据
                logger.LogInformation("填充 TargetUserId 字段...");
                Task.Run(async () => await DataMigrations.PopulateTargetUserIdAsync(app.Services))
                    .GetAwaiter()
                    .GetResult();
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "数据库初始化过程中发生错误");
            }
        }

        return app;
    }
}