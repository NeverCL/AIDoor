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

    // 评论表
    public DbSet<Comment> Comments { get; set; }

    // 用户关注关系表
    public DbSet<UserFollow> UserFollows { get; set; }

    // 发布者表
    public DbSet<Publisher> Publishers { get; set; }

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

        // 用户关注关系配置
        modelBuilder.Entity<UserFollow>()
            .HasIndex(uf => new { uf.FollowerId, uf.FollowingId })
            .IsUnique(); // 确保同一用户不能重复关注同一个人

        modelBuilder.Entity<UserFollow>()
            .HasOne(uf => uf.Follower)
            .WithMany()
            .HasForeignKey(uf => uf.FollowerId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<UserFollow>()
            .HasOne(uf => uf.Following)
            .WithMany()
            .HasForeignKey(uf => uf.FollowingId)
            .OnDelete(DeleteBehavior.Restrict);

        // 评论配置
        modelBuilder.Entity<Comment>()
            .HasOne(c => c.User)
            .WithMany()
            .HasForeignKey(c => c.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Comment>()
            .HasOne(c => c.Parent)
            .WithMany()
            .HasForeignKey(c => c.ParentId)
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

        // Comment 索引配置
        modelBuilder.Entity<Comment>()
            .HasIndex(c => c.TargetId);

        modelBuilder.Entity<Comment>()
            .HasIndex(c => c.TargetType);

        modelBuilder.Entity<Comment>()
            .HasIndex(c => c.UserId);

        modelBuilder.Entity<Comment>()
            .HasIndex(c => c.CreatedAt);

        // DeveloperApplication 配置
        modelBuilder.Entity<DeveloperApplication>()
            .HasOne(da => da.User)
            .WithMany()
            .HasForeignKey(da => da.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<DeveloperApplication>()
            .HasIndex(da => da.Status);

        modelBuilder.Entity<DeveloperApplication>()
            .HasIndex(da => da.UserId);

        // Publisher 配置
        modelBuilder.Entity<Publisher>()
            .HasOne(p => p.User)
            .WithMany()
            .HasForeignKey(p => p.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Publisher>()
            .HasIndex(p => p.Name);

        modelBuilder.Entity<Publisher>()
            .HasIndex(p => p.Status);
    }
}