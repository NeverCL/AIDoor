using AIDoor.WebAPI.Domain;
using AIDoor.WebAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace AIDoor.WebAPI.Data;

/// <summary>
/// 处理数据迁移和修复的类
/// </summary>
public static class DataMigrations
{
    /// <summary>
    /// 修复用户与发布者之间的关联关系
    /// </summary>
    public static async Task FixUserPublisherRelationshipAsync(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<AppDbContext>>();

        try
        {
            logger.LogInformation("开始修复用户与发布者之间的关联关系...");

            // 查找所有具有 UserId 的发布者
            var publishers = await dbContext.Publishers
                .Where(p => p.UserId.HasValue)
                .ToListAsync();

            int updatedCount = 0;

            foreach (var publisher in publishers)
            {
                // 找到关联的用户
                var user = await dbContext.Users.FindAsync(publisher.UserId.Value);
                if (user != null && user.PublisherId != publisher.Id)
                {
                    // 更新用户的 PublisherId
                    user.PublisherId = publisher.Id;
                    updatedCount++;
                }
            }

            // 查找所有设置了 PublisherId 但实际不存在对应发布者的用户
            var usersWithInvalidPublisherId = await dbContext.Users
                .Where(u => u.PublisherId.HasValue && !dbContext.Publishers.Any(p => p.Id == u.PublisherId))
                .ToListAsync();

            foreach (var user in usersWithInvalidPublisherId)
            {
                // 清除无效的 PublisherId
                user.PublisherId = null;
                updatedCount++;
            }

            if (updatedCount > 0)
            {
                await dbContext.SaveChangesAsync();
                logger.LogInformation($"成功修复 {updatedCount} 条用户与发布者关联关系");
            }
            else
            {
                logger.LogInformation("所有用户与发布者关联关系均正常，无需修复");
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "修复用户与发布者关联关系时发生错误");
        }
    }

    /// <summary>
    /// 填充现有用户记录的TargetUserId
    /// </summary>
    public static async Task PopulateTargetUserIdAsync(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<AppDbContext>>();

        try
        {
            logger.LogInformation("开始填充TargetUserId数据...");

            // 找出所有包含内容引用的记录
            var contentRecords = await dbContext.UserRecords
                .Where(r => r.Notes != null && r.Notes.StartsWith("Content:") && r.TargetUserId == null)
                .ToListAsync();

            int updatedCount = 0;

            foreach (var record in contentRecords)
            {
                // 从Notes中提取内容ID
                if (int.TryParse(record.Notes.Split(':')[1], out int contentId))
                {
                    // 查找对应内容的创建者ID
                    var content = await dbContext.UserContents.FindAsync(contentId);
                    if (content != null)
                    {
                        record.TargetUserId = content.PublisherId;
                        updatedCount++;
                    }
                }
            }

            // 找出所有包含用户引用的记录
            var userRecords = await dbContext.UserRecords
                .Where(r => r.Notes != null && r.Notes.StartsWith("User:") && r.TargetUserId == null)
                .ToListAsync();

            foreach (var record in userRecords)
            {
                // 从Notes中提取用户ID
                if (int.TryParse(record.Notes.Split(':')[1], out int userId))
                {
                    record.TargetUserId = userId;
                    updatedCount++;
                }
            }

            // 保存更改
            await dbContext.SaveChangesAsync();
            logger.LogInformation($"成功更新 {updatedCount} 条记录的TargetUserId");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "填充TargetUserId时发生错误");
        }
    }
}