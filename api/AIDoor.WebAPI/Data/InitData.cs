using AIDoor.WebAPI.Domain;
using AIDoor.WebAPI.Models;
using Microsoft.EntityFrameworkCore;
using System;

namespace AIDoor.WebAPI.Data;

public class InitData
{
    public void Seed(AppDbContext context)
    {
        if (!context.ApplicationCategories.Any())
        {
            SeedCategories(context);
        }
        
        if (!context.Applications.Any())
        {
            SeedApplications(context);
        }
        
        if (!context.Users.Any())
        {
            SeedUsers(context);
        }
        
        if (!context.UserRecords.Any())
        {
            SeedUserRecords(context);
        }
        
        context.SaveChanges();
    }
    
    private void SeedCategories(AppDbContext context)
    {
        var categories = new List<AppCategory>
        {
            new AppCategory 
            { 
                Id = 1, 
                Name = "大模型", 
                DisplayOrder = 1, 
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new AppCategory 
            { 
                Id = 2, 
                Name = "小模型", 
                DisplayOrder = 2, 
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new AppCategory 
            { 
                Id = 3, 
                Name = "插件", 
                DisplayOrder = 3, 
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new AppCategory 
            { 
                Id = 4, 
                Name = "工具", 
                DisplayOrder = 4, 
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            }
        };
        
        context.ApplicationCategories.AddRange(categories);
    }
    
    private void SeedApplications(AppDbContext context)
    {
        var applications = new List<AppItem>
        {
            new AppItem 
            { 
                Id = 1, 
                Title = "大模型应用1", 
                Description = "这是大模型应用1的简介", 
                ImageUrl = "https://img1.baidu.com/it/u=990091063,3716780155&fm=253&fmt=auto&app=120&f=JPEG?w=655&h=1418",
                DisplayOrder = 1,
                IsActive = true,
                CategoryId = 1,
                CreatedAt = DateTime.UtcNow
            },
            new AppItem 
            { 
                Id = 2, 
                Title = "小模型应用1", 
                Description = "这是小模型应用1的简介", 
                ImageUrl = "https://img1.baidu.com/it/u=990091063,3716780155&fm=253&fmt=auto&app=120&f=JPEG?w=655&h=1418",
                DisplayOrder = 1,
                IsActive = true,
                CategoryId = 2,
                CreatedAt = DateTime.UtcNow
            },
            new AppItem 
            { 
                Id = 3, 
                Title = "插件1", 
                Description = "这是插件1的简介", 
                ImageUrl = "https://img1.baidu.com/it/u=990091063,3716780155&fm=253&fmt=auto&app=120&f=JPEG?w=655&h=1418",
                DisplayOrder = 1,
                IsActive = true,
                CategoryId = 3,
                CreatedAt = DateTime.UtcNow
            },
            new AppItem 
            { 
                Id = 4, 
                Title = "工具1", 
                Description = "这是工具1的简介", 
                ImageUrl = "https://img1.baidu.com/it/u=990091063,3716780155&fm=253&fmt=auto&app=120&f=JPEG?w=655&h=1418",
                DisplayOrder = 1,
                IsActive = true,
                CategoryId = 4,
                CreatedAt = DateTime.UtcNow
            }
        };
        
        context.Applications.AddRange(applications);
    }
    
    private void SeedUsers(AppDbContext context)
    {
        var users = new List<User>
        {
            new User
            {
                Id = 1,
                Username = "测试用户",
                PhoneNumber = "13800138000",
                PasswordHash = "jGl25bVBBBW96Qi9Te4V37Fnqchz/Eu4qB9vKrRIqRg=", // 123456的SHA-256哈希
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            }
        };
        
        context.Users.AddRange(users);
    }
    
    private void SeedUserRecords(AppDbContext context)
    {
        var records = new List<UserRecord>
        {
            new UserRecord
            {
                Id = 1,
                RecordType = RecordType.Like,
                Title = "2025看过最好的新剧院1232",
                ImageUrl = "https://img1.baidu.com/it/u=990091063,3716780155&fm=253&fmt=auto&app=120&f=JPEG?w=655&h=1418",
                UserId = 1,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new UserRecord
            {
                Id = 2,
                RecordType = RecordType.Like,
                Title = "2025看过最好的新剧院1232",
                ImageUrl = "https://img1.baidu.com/it/u=990091063,3716780155&fm=253&fmt=auto&app=120&f=JPEG?w=655&h=1418",
                UserId = 1,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            // 添加用户记录数据 - 收藏
            new UserRecord
            {
                Id = 3,
                RecordType = RecordType.Favorite,
                Title = "收藏的内容示例",
                ImageUrl = "https://img1.baidu.com/it/u=990091063,3716780155&fm=253&fmt=auto&app=120&f=JPEG?w=655&h=1418",
                UserId = 1,
                Notes = "这是一个很好的内容",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new UserRecord
            {
                Id = 4,
                RecordType = RecordType.Favorite,
                Title = "收藏的内容示例",
                ImageUrl = "https://img1.baidu.com/it/u=990091063,3716780155&fm=253&fmt=auto&app=120&f=JPEG?w=655&h=1418",
                UserId = 1,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            // 添加用户记录数据 - 足迹
            new UserRecord
            {
                Id = 5,
                RecordType = RecordType.Footprint,
                Title = "浏览过的内容示例",
                ImageUrl = "https://img1.baidu.com/it/u=990091063,3716780155&fm=253&fmt=auto&app=120&f=JPEG?w=655&h=1418",
                UserId = 1,
                LastViewedAt = DateTime.UtcNow,
                ViewCount = 1,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new UserRecord
            {
                Id = 6,
                RecordType = RecordType.Footprint,
                Title = "浏览过的内容示例",
                ImageUrl = "https://img1.baidu.com/it/u=990091063,3716780155&fm=253&fmt=auto&app=120&f=JPEG?w=655&h=1418",
                UserId = 1,
                LastViewedAt = DateTime.UtcNow,
                ViewCount = 2,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new UserRecord
            {
                Id = 7,
                RecordType = RecordType.Footprint,
                Title = "浏览过的内容示例",
                ImageUrl = "https://img1.baidu.com/it/u=990091063,3716780155&fm=253&fmt=auto&app=120&f=JPEG?w=655&h=1418",
                UserId = 1,
                LastViewedAt = DateTime.UtcNow,
                ViewCount = 3,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new UserRecord
            {
                Id = 8,
                RecordType = RecordType.Footprint,
                Title = "浏览过的内容示例",
                ImageUrl = "https://img1.baidu.com/it/u=990091063,3716780155&fm=253&fmt=auto&app=120&f=JPEG?w=655&h=1418",
                UserId = 1,
                LastViewedAt = DateTime.UtcNow,
                ViewCount = 1,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new UserRecord
            {
                Id = 9,
                RecordType = RecordType.Footprint,
                Title = "浏览过的内容示例",
                ImageUrl = "https://img1.baidu.com/it/u=990091063,3716780155&fm=253&fmt=auto&app=120&f=JPEG?w=655&h=1418",
                UserId = 1,
                LastViewedAt = DateTime.UtcNow,
                ViewCount = 1,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            },
            new UserRecord
            {
                Id = 10,
                RecordType = RecordType.Footprint,
                Title = "浏览过的内容示例",
                ImageUrl = "https://img1.baidu.com/it/u=990091063,3716780155&fm=253&fmt=auto&app=120&f=JPEG?w=655&h=1418",
                UserId = 1,
                LastViewedAt = DateTime.UtcNow,
                ViewCount = 1,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            }
        };
        
        context.UserRecords.AddRange(records);
    }
}