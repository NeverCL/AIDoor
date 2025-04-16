using AIDoor.WebAPI.Domain;
using AIDoor.WebAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace AIDoor.WebAPI.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }
    
    public DbSet<User> Users { get; set; }
    public DbSet<AppCategory> ApplicationCategories { get; set; }
    public DbSet<AppItem> Applications { get; set; }
    public DbSet<Item> Items { get; set; }
    
    // 用户记录表
    public DbSet<UserRecord> UserRecords { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        modelBuilder.Entity<User>()
            .HasIndex(u => u.PhoneNumber)
            .IsUnique();
            
        // 应用分类和应用之间的关系配置
        modelBuilder.Entity<AppCategory>()
            .HasMany(c => c.Applications)
            .WithOne(a => a.Category)
            .HasForeignKey(a => a.CategoryId)
            .OnDelete(DeleteBehavior.Cascade); // 删除分类时级联删除应用
            
        // Item和User之间的关系配置
        modelBuilder.Entity<Item>()
            .HasOne(i => i.User)
            .WithMany()
            .HasForeignKey(i => i.UserId)
            .OnDelete(DeleteBehavior.Restrict); // 删除用户时不级联删除项目，而是限制删除
            
        // 用户记录和用户之间的关系配置
        modelBuilder.Entity<UserRecord>()
            .HasOne(ur => ur.User)
            .WithMany()
            .HasForeignKey(ur => ur.UserId)
            .OnDelete(DeleteBehavior.Restrict);
            
        // 索引配置
        modelBuilder.Entity<AppCategory>()
            .HasIndex(c => c.Name);
            
        modelBuilder.Entity<AppItem>()
            .HasIndex(a => a.Title);
            
        modelBuilder.Entity<Item>()
            .HasIndex(i => i.Title);
            
        modelBuilder.Entity<UserRecord>()
            .HasIndex(ur => ur.Title);
            
        modelBuilder.Entity<UserRecord>()
            .HasIndex(ur => ur.RecordType);
            
        // 初始数据
        SeedData(modelBuilder);
    }
    
    private void SeedData(ModelBuilder modelBuilder)
    {
        // 添加初始分类
        modelBuilder.Entity<AppCategory>().HasData(
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
        );
        
        // 添加初始应用
        modelBuilder.Entity<AppItem>().HasData(
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
        );
        
        // 添加初始用户
        modelBuilder.Entity<User>().HasData(
            new User
            {
                Id = 1,
                Username = "测试用户",
                PhoneNumber = "13800138000",
                PasswordHash = "jGl25bVBBBW96Qi9Te4V37Fnqchz/Eu4qB9vKrRIqRg=", // 123456的SHA-256哈希
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            }
        );
        
        // 添加用户记录数据 - 点赞
        modelBuilder.Entity<UserRecord>().HasData(
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
        );
    }
}