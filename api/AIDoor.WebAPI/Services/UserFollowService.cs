using AIDoor.WebAPI.Data;
using AIDoor.WebAPI.Domain;
using AIDoor.WebAPI.Models;
using AIDoor.WebAPI.Models.Dtos;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace AIDoor.WebAPI.Services;

/// <summary>
/// 用户关注服务，处理用户之间的关注关系
/// </summary>
public class UserFollowService
{
    private readonly AppDbContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly ILogger<UserFollowService> _logger;

    public UserFollowService(
        AppDbContext context,
        IHttpContextAccessor httpContextAccessor,
        ILogger<UserFollowService> logger)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
        _logger = logger;
    }

    /// <summary>
    /// 获取当前登录用户ID
    /// </summary>
    private int GetCurrentUserId()
    {
        var userIdClaim = _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
        {
            throw new UnauthorizedAccessException("未登录或无法识别用户");
        }
        return userId;
    }

    /// <summary>
    /// 关注用户
    /// </summary>
    public async Task<(bool Success, string Message, UserFollowResponseDto? Data)> FollowUserAsync(UserFollowCreateDto dto)
    {
        try
        {
            int currentUserId = GetCurrentUserId();

            // 不能关注自己
            if (currentUserId == dto.FollowingId)
            {
                return (false, "不能关注自己", null);
            }

            // 检查被关注用户是否存在
            var followingPublisher = await _context.Publishers.FindAsync(dto.FollowingId);
            if (followingPublisher == null)
            {
                return (false, "要关注的发布者不存在", null);
            }

            // 获取当前用户信息
            var follower = await _context.Users.FindAsync(currentUserId);
            if (follower == null)
            {
                return (false, "当前用户信息不存在", null);
            }

            // 检查是否已经关注过该用户
            var existingFollow = await _context.UserFollows
                .FirstOrDefaultAsync(uf =>
                    uf.FollowerId == currentUserId &&
                    uf.FollowingId == dto.FollowingId &&
                    uf.IsActive);

            if (existingFollow != null)
            {
                return (false, "已经关注过该发布者", null);
            }

            // 如果之前关注过但取消了，则重新激活
            var inactiveFollow = await _context.UserFollows
                .FirstOrDefaultAsync(uf =>
                    uf.FollowerId == currentUserId &&
                    uf.FollowingId == dto.FollowingId &&
                    !uf.IsActive);

            if (inactiveFollow != null)
            {
                inactiveFollow.IsActive = true;
                inactiveFollow.UpdatedAt = DateTime.Now;

                // 更新用户的关注计数
                if (follower != null)
                {
                    follower.FollowCount++;
                }

                await _context.SaveChangesAsync();

                return (true, "关注成功", new UserFollowResponseDto
                {
                    Id = inactiveFollow.Id,
                    FollowerId = inactiveFollow.FollowerId,
                    FollowingId = inactiveFollow.FollowingId,
                    FollowerUsername = follower.Username,
                    FollowerAvatarUrl = follower.AvatarUrl,
                    FollowingUsername = followingPublisher.Name,
                    FollowingAvatarUrl = followingPublisher.AvatarUrl,
                    CreatedAt = inactiveFollow.CreatedAt
                });
            }

            // 创建新的关注关系
            var newFollow = new UserFollow
            {
                FollowerId = currentUserId,
                FollowingId = dto.FollowingId,
                CreatedAt = DateTime.Now,
                IsActive = true
            };

            _context.UserFollows.Add(newFollow);

            // 更新用户的关注计数
            if (follower != null)
            {
                follower.FollowCount++;
            }

            await _context.SaveChangesAsync();

            return (true, "关注成功", new UserFollowResponseDto
            {
                Id = newFollow.Id,
                FollowerId = newFollow.FollowerId,
                FollowingId = newFollow.FollowingId,
                FollowerUsername = follower.Username,
                FollowerAvatarUrl = follower.AvatarUrl,
                FollowingUsername = followingPublisher.Name,
                FollowingAvatarUrl = followingPublisher.AvatarUrl,
                CreatedAt = newFollow.CreatedAt
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "关注用户时发生错误");
            return (false, "关注用户时发生错误", null);
        }
    }

    /// <summary>
    /// 取消关注用户
    /// </summary>
    public async Task<(bool Success, string Message)> UnfollowUserAsync(int followingId)
    {
        try
        {
            int currentUserId = GetCurrentUserId();

            // 检查关注关系是否存在
            var followRelation = await _context.UserFollows
                .FirstOrDefaultAsync(uf =>
                    uf.FollowerId == currentUserId &&
                    uf.FollowingId == followingId &&
                    uf.IsActive);

            if (followRelation == null)
            {
                return (false, "未关注该用户");
            }

            // 软删除，将状态设为不活跃
            followRelation.IsActive = false;
            followRelation.UpdatedAt = DateTime.Now;

            // 更新用户的关注计数
            var currentUser = await _context.Users.FindAsync(currentUserId);
            if (currentUser != null && currentUser.FollowCount > 0)
            {
                currentUser.FollowCount--;
            }

            await _context.SaveChangesAsync();

            return (true, "已取消关注");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "取消关注用户时发生错误");
            return (false, "取消关注用户时发生错误");
        }
    }

    /// <summary>
    /// 获取当前用户的关注列表
    /// </summary>
    public async Task<(List<UserFollowResponseDto> Follows, int TotalCount)> GetFollowingListAsync(UserFollowQueryParams queryParams)
    {
        try
        {
            int currentUserId = GetCurrentUserId();

            // 构建查询
            var query = _context.UserFollows
                .Include(uf => uf.Following)
                .Include(uf => uf.Follower)
                .Where(uf => uf.FollowerId == currentUserId && uf.IsActive)
                .OrderByDescending(uf => uf.CreatedAt);

            // 获取总数
            int totalCount = await query.CountAsync();

            // 分页获取数据
            var followList = await query
                .Skip((queryParams.Page - 1) * queryParams.Limit)
                .Take(queryParams.Limit)
                .ToListAsync();

            // 转换为DTO
            var result = followList.Select(uf => new UserFollowResponseDto
            {
                Id = uf.Id,
                FollowerId = uf.FollowerId,
                FollowingId = uf.FollowingId,
                FollowerUsername = uf.Follower.Username,
                FollowerAvatarUrl = uf.Follower.AvatarUrl,
                FollowingUsername = uf.Following.Name,
                FollowingAvatarUrl = uf.Following.AvatarUrl,
                CreatedAt = uf.CreatedAt
            }).ToList();

            return (result, totalCount);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "获取关注列表时发生错误");
            return (new List<UserFollowResponseDto>(), 0);
        }
    }

    /// <summary>
    /// 检查当前用户是否已关注指定用户
    /// </summary>
    public async Task<bool> IsFollowingAsync(int targetUserId)
    {
        try
        {
            int currentUserId = GetCurrentUserId();

            return await _context.UserFollows
                .AnyAsync(uf =>
                    uf.FollowerId == currentUserId &&
                    uf.FollowingId == targetUserId &&
                    uf.IsActive);
        }
        catch (Exception)
        {
            return false;
        }
    }
}