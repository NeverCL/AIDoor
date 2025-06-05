using AIDoor.WebAPI.Data;
using AIDoor.WebAPI.Domain;
using AIDoor.WebAPI.Models;
using AIDoor.WebAPI.Models.Dtos;
using Microsoft.EntityFrameworkCore;

namespace AIDoor.WebAPI.Services;

public class PublisherService
{
    private readonly AppDbContext _context;
    private readonly UserRecordService _userRecordService;

    public PublisherService(AppDbContext context, UserRecordService userRecordService)
    {
        _context = context;
        _userRecordService = userRecordService;
    }

    /// <summary>
    /// 获取开发者详情
    /// </summary>
    /// <param name="publisherId">开发者ID</param>
    /// <returns>开发者详情DTO</returns>
    public async Task<PublisherDto?> GetPublisherDetailsAsync(int publisherId)
    {
        // 查询开发者信息
        var publisher = await _context.Publishers
            .Include(p => p.User)
            .FirstOrDefaultAsync(p => p.Id == publisherId);

        if (publisher == null)
        {
            return null;
        }

        // 对于普通用户，只返回已通过审核的开发者
        // 如果是当前用户自己的开发者信息则可以看到
        if (publisher.Status != PublisherStatus.Approved)
        {
            // 这里可以添加权限校验，但在Controller中会根据角色验证
        }

        // 使用TargetUserId计算点赞数量 
        var likesCount = await _context.UserRecords
            .CountAsync(r => r.RecordType == RecordType.Like &&
                             r.TargetUserId == publisherId &&
                             r.IsActive);

        // 计算粉丝数量
        var followersCount = await _context.UserFollows
            .CountAsync(f => f.FollowingId == publisherId && f.IsActive);

        // 使用TargetUserId计算收藏数量
        var favoritesCount = await _context.UserRecords
            .CountAsync(r => r.RecordType == RecordType.Favorite &&
                             r.TargetUserId == publisherId &&
                             r.IsActive);

        // 创建开发者DTO
        var publisherDto = new PublisherDto
        {
            Id = publisher.Id,
            UserId = publisher.UserId,
            Username = publisher.Name,
            AvatarUrl = publisher.AvatarUrl,
            Summary = publisher.Summary,
            Description = publisher.Description,
            CreatedAt = publisher.CreatedAt,
            Status = publisher.Status,
            StatusText = GetStatusText(publisher.Status),
            Type = publisher.Type,
            TypeText = publisher.Type == PublisherType.Personal ? "个人" : "企业",
            ReviewNote = publisher.ReviewNote,
            ReviewedAt = publisher.ReviewedAt,
            AppLink = publisher.Status == PublisherStatus.Approved ? publisher.AppLink : null,
            Website = publisher.Status == PublisherStatus.Approved ? publisher.Website : null,
            Stats = new PublisherStatsDto
            {
                Likes = likesCount,
                Followers = followersCount,
                Favorites = favoritesCount,
                Rating = publisher.Rating
            }
        };

        return publisherDto;
    }

    /// <summary>
    /// 创建或更新开发者信息
    /// </summary>
    /// <param name="userId">关联的用户ID</param>
    /// <param name="name">开发者名称</param>
    /// <param name="avatarUrl">开发者头像</param>
    /// <param name="description">开发者描述</param>
    /// <param name="type">开发者类型</param>
    /// <returns>操作结果</returns>
    public async Task<(bool Success, string Message, Publisher Publisher)> CreateOrUpdatePublisherAsync(
        int userId, string name, string avatarUrl, string description, string summary,
        PublisherType type = PublisherType.Personal,
        string? website = null, string? appLink = null)
    {
        try
        {
            // 检查用户是否存在
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return (false, "关联用户不存在", null!);
            }

            // 查找是否已存在该用户的开发者信息
            var publisher = await _context.Publishers
                .FirstOrDefaultAsync(p => p.UserId == userId);

            if (publisher == null)
            {
                // 创建新开发者
                publisher = new Publisher
                {
                    Name = name,
                    AvatarUrl = avatarUrl,
                    Summary = summary,
                    Description = description,
                    Type = type,
                    Website = website,
                    AppLink = appLink,
                    UserId = userId,
                    Status = PublisherStatus.Pending, // 新创建的开发者为待审核状态
                    CreatedAt = DateTime.Now
                };
                _context.Publishers.Add(publisher);
                await _context.SaveChangesAsync();

                // 更新用户的 PublisherId 属性
                user.PublisherId = publisher.Id;
                await _context.SaveChangesAsync();

                return (true, "开发者信息已提交，等待审核", publisher);
            }
            else
            {
                // 如果开发者已被拒绝，那么更新后状态变回待审核
                var needReview = true; // publisher.Status == PublisherStatus.Rejected;

                // 更新现有开发者信息
                publisher.Name = name;
                publisher.AvatarUrl = avatarUrl;
                publisher.Summary = summary;
                publisher.Description = description;
                publisher.Type = type;
                publisher.Website = website;
                publisher.AppLink = appLink;
                publisher.UpdatedAt = DateTime.Now;

                // 如果之前被拒绝，更新后需要重新审核
                if (needReview)
                {
                    publisher.Status = PublisherStatus.Pending;
                    publisher.ReviewNote = null;
                    publisher.ReviewedAt = null;
                }

                await _context.SaveChangesAsync();

                // 确保用户的 PublisherId 属性正确设置
                if (user.PublisherId != publisher.Id)
                {
                    user.PublisherId = publisher.Id;
                    await _context.SaveChangesAsync();
                }

                string message = needReview
                    ? "开发者信息已更新，等待重新审核"
                    : "开发者信息已更新";

                return (true, message, publisher);
            }
        }
        catch (Exception ex)
        {
            return (false, $"保存开发者信息失败: {ex.Message}", null!);
        }
    }

    /// <summary>
    /// 审核开发者申请
    /// </summary>
    /// <param name="publisherId">开发者ID</param>
    /// <param name="approved">是否通过</param>
    /// <param name="reviewNote">审核备注</param>
    /// <returns>操作结果</returns>
    public async Task<(bool Success, string Message)> ReviewPublisherAsync(
        int publisherId, bool approved, string? reviewNote)
    {
        try
        {
            var publisher = await _context.Publishers.FindAsync(publisherId);
            if (publisher == null)
            {
                return (false, "开发者不存在");
            }

            // 设置审核状态
            publisher.Status = approved ? PublisherStatus.Approved : PublisherStatus.Rejected;
            publisher.ReviewNote = reviewNote;
            publisher.ReviewedAt = DateTime.Now;
            publisher.UpdatedAt = DateTime.Now;

            // 如果有关联用户，更新用户的 PublisherId
            if (publisher.UserId.HasValue)
            {
                var user = await _context.Users.FindAsync(publisher.UserId.Value);
                if (user != null)
                {
                    if (approved)
                    {
                        // 审核通过时，确保 PublisherId 设置正确
                        if (user.PublisherId != publisherId)
                        {
                            user.PublisherId = publisherId;
                        }
                    }
                    else
                    {
                        // 审核拒绝时，可以选择是否清除 PublisherId
                        // 这里保留关联，让用户可以修改后重新提交
                        // 如果业务需要完全解除关联，取消下面的注释
                        // user.PublisherId = null;
                    }
                }
            }

            await _context.SaveChangesAsync();

            return (true, approved ? "已通过审核" : "已拒绝申请");
        }
        catch (Exception ex)
        {
            return (false, $"审核操作失败: {ex.Message}");
        }
    }

    /// <summary>
    /// 获取待审核的开发者列表
    /// </summary>
    /// <param name="page">页码</param>
    /// <param name="pageSize">每页数量</param>
    /// <returns>待审核开发者列表</returns>
    public async Task<(List<PublisherDto> Publishers, int Total)> GetPendingPublishersAsync(int page = 1,
        int pageSize = 20)
    {
        var query = _context.Publishers
            .Include(p => p.User)
            .Where(p => p.Status == PublisherStatus.Pending)
            .OrderByDescending(p => p.CreatedAt);

        var total = await query.CountAsync();

        var publishers = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(p => new PublisherDto
            {
                Id = p.Id,
                Username = p.Name,
                AvatarUrl = p.AvatarUrl,
                Description = p.Description,
                CreatedAt = p.CreatedAt,
                Status = p.Status,
                Type = p.Type,
                Website = p.Website,
                AppLink = p.AppLink
            })
            .ToListAsync();

        // 设置状态文本和类型文本 - 在EF Core查询之外设置
        foreach (var publisher in publishers)
        {
            publisher.StatusText = GetStatusText(publisher.Status);
            publisher.TypeText = GetTypeText(publisher.Type);
        }

        return (publishers, total);
    }

    /// <summary>
    /// 获取所有开发者列表（可按状态筛选）
    /// </summary>
    /// <param name="page">页码</param>
    /// <param name="pageSize">每页数量</param>
    /// <param name="status">状态筛选</param>
    /// <returns>开发者列表</returns>
    public async Task<(List<PublisherDto> Publishers, int Total)> GetAllPublishersAsync(
        int page = 1, int pageSize = 20, PublisherStatus? status = null)
    {
        var query = _context.Publishers
            .Include(p => p.User)
            .AsQueryable();

        // 如果指定了状态，按状态筛选
        if (status.HasValue)
        {
            query = query.Where(p => p.Status == status.Value);
        }

        query = query.OrderByDescending(p => p.CreatedAt);

        var total = await query.CountAsync();

        var publishers = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(p => new PublisherDto
            {
                Id = p.Id,
                Username = p.Name,
                AvatarUrl = p.AvatarUrl,
                Description = p.Description,
                CreatedAt = p.CreatedAt,
                Status = p.Status,
                Type = p.Type,
                Website = p.Website,
                AppLink = p.AppLink
            })
            .ToListAsync();

        // 设置状态文本和类型文本 - 在EF Core查询之外设置
        foreach (var publisher in publishers)
        {
            publisher.StatusText = GetStatusText(publisher.Status);
            publisher.TypeText = GetTypeText(publisher.Type);
        }

        return (publishers, total);
    }

    /// <summary>
    /// 获取状态文本描述
    /// </summary>
    /// <param name="status">状态枚举值</param>
    /// <returns>状态文本</returns>
    private string GetStatusText(PublisherStatus status)
    {
        return status switch
        {
            PublisherStatus.Pending => "待审核",
            PublisherStatus.Approved => "已通过",
            PublisherStatus.Rejected => "已拒绝",
            _ => "未知状态"
        };
    }

    /// <summary>
    /// 获取类型文本描述
    /// </summary>
    /// <param name="type">类型枚举值</param>
    /// <returns>类型文本</returns>
    private string GetTypeText(PublisherType type)
    {
        return type switch
        {
            PublisherType.Personal => "个人",
            PublisherType.Enterprise => "企业",
            _ => "未知类型"
        };
    }

    /// <summary>
    /// 更新开发者统计数据
    /// </summary>
    /// <param name="publisherId">开发者ID</param>
    /// <returns>操作结果</returns>
    public async Task<bool> UpdatePublisherStatsAsync(int publisherId)
    {
        try
        {
            var publisher = await _context.Publishers.FindAsync(publisherId);
            if (publisher == null)
            {
                return false;
            }

            // 使用publisherId更新点赞数量
            var likesCount = await _context.UserRecords
                .CountAsync(r => r.RecordType == RecordType.Like &&
                                 r.TargetUserId == publisherId &&
                                 r.IsActive);

            // 更新粉丝数量
            var followersCount = await _context.UserFollows
                .CountAsync(f => f.FollowingId == publisherId && f.IsActive);

            // 使用publisherId更新收藏数量
            var favoritesCount = await _context.UserRecords
                .CountAsync(r => r.RecordType == RecordType.Favorite &&
                                 r.TargetUserId == publisherId &&
                                 r.IsActive);

            // 更新开发者统计数据
            publisher.LikesCount = likesCount;
            publisher.FollowersCount = followersCount;
            publisher.FavoritesCount = favoritesCount;

            await _context.SaveChangesAsync();
            return true;
        }
        catch
        {
            return false;
        }
    }

    /// <summary>
    /// 获取指定用户ID对应的开发者
    /// </summary>
    /// <param name="userId">用户ID</param>
    /// <returns>开发者信息</returns>
    public async Task<Publisher?> GetPublisherByUserIdAsync(int userId)
    {
        return await _context.Publishers
            .FirstOrDefaultAsync(p => p.UserId == userId);
    }

    /// <summary>
    /// 根据ID删除开发者
    /// </summary>
    /// <param name="publisherId">开发者ID</param>
    /// <returns>操作结果</returns>
    public async Task<(bool Success, string Message)> DeletePublisherAsync(int publisherId)
    {
        try
        {
            var publisher = await _context.Publishers.FindAsync(publisherId);
            if (publisher == null)
            {
                return (false, "开发者不存在");
            }

            // 如果存在关联的用户，清除用户的 PublisherId
            if (publisher.UserId.HasValue)
            {
                var user = await _context.Users.FindAsync(publisher.UserId.Value);
                if (user != null && user.PublisherId == publisherId)
                {
                    user.PublisherId = null;
                    await _context.SaveChangesAsync();
                }
            }

            _context.Publishers.Remove(publisher);
            await _context.SaveChangesAsync();

            return (true, "开发者已删除");
        }
        catch (Exception ex)
        {
            return (false, $"删除失败: {ex.Message}");
        }
    }
}