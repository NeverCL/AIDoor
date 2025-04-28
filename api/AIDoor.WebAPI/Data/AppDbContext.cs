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

    // 用户内容表
    public DbSet<UserContent> UserContents { get; set; }

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

        // UserContent 配置
        modelBuilder.Entity<UserContent>()
            .HasOne(uc => uc.User)
            .WithMany()
            .HasForeignKey(uc => uc.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<UserContent>()
            .HasIndex(uc => uc.Title);
    }
}