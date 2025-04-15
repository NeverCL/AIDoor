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
            
        // 索引配置
        modelBuilder.Entity<AppCategory>()
            .HasIndex(c => c.Name);
            
        modelBuilder.Entity<AppItem>()
            .HasIndex(a => a.Title);
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
    }
}