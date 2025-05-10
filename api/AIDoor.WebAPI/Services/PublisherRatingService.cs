using AIDoor.WebAPI.Data;
using AIDoor.WebAPI.Domain;
using AIDoor.WebAPI.Models.Dtos;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace AIDoor.WebAPI.Services;

/// <summary>
/// 发布者评分服务
/// </summary>
public class PublisherRatingService
{
    private readonly AppDbContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly ILogger<PublisherRatingService> _logger;

    public PublisherRatingService(
        AppDbContext context,
        IHttpContextAccessor httpContextAccessor,
        ILogger<PublisherRatingService> logger)
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
    /// 用户为发布者评分
    /// </summary>
    public async Task<(bool Success, string Message, double RatingValue)> RatePublisherAsync(int publisherId, double rating, string? comment = null)
    {
        try
        {
            int userId = GetCurrentUserId();

            // 验证评分范围
            if (rating < 1.0 || rating > 5.0)
            {
                return (false, "评分必须在1-5之间", 0);
            }

            // 检查发布者是否存在且已审核通过
            var publisher = await _context.Publishers
                .FirstOrDefaultAsync(p => p.Id == publisherId && p.Status == PublisherStatus.Approved);

            if (publisher == null)
            {
                return (false, "发布者不存在或未通过审核", 0);
            }

            // 查找是否已有评分
            var existingRating = await _context.PublisherRatings
                .FirstOrDefaultAsync(r => r.UserId == userId && r.PublisherId == publisherId);

            if (existingRating != null)
            {
                // 更新已有评分
                existingRating.Value = rating;
                existingRating.Comment = comment;
                existingRating.UpdatedAt = DateTime.UtcNow;
            }
            else
            {
                // 创建新评分
                var newRating = new PublisherRating
                {
                    UserId = userId,
                    PublisherId = publisherId,
                    Value = rating,
                    Comment = comment,
                    CreatedAt = DateTime.UtcNow
                };

                _context.PublisherRatings.Add(newRating);
            }

            await _context.SaveChangesAsync();

            // 更新发布者的平均评分
            await UpdatePublisherAverageRatingAsync(publisherId);

            return (true, "评分成功", rating);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "为发布者评分时发生错误");
            return (false, $"评分失败: {ex.Message}", 0);
        }
    }

    /// <summary>
    /// 获取用户对发布者的评分
    /// </summary>
    public async Task<PublisherRatingDto?> GetUserRatingAsync(int publisherId)
    {
        try
        {
            int userId = GetCurrentUserId();

            var rating = await _context.PublisherRatings
                .Where(r => r.UserId == userId && r.PublisherId == publisherId)
                .Select(r => new PublisherRatingDto
                {
                    Value = r.Value,
                    Comment = r.Comment,
                    CreatedAt = r.CreatedAt,
                    UpdatedAt = r.UpdatedAt
                })
                .FirstOrDefaultAsync();

            return rating;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "获取用户评分时发生错误");
            return null;
        }
    }

    /// <summary>
    /// 获取发布者的所有评分
    /// </summary>
    public async Task<(List<PublisherRatingWithUserDto> Ratings, int Total)> GetPublisherRatingsAsync(
        int publisherId, int page = 1, int pageSize = 20)
    {
        try
        {
            var query = _context.PublisherRatings
                .Where(r => r.PublisherId == publisherId)
                .OrderByDescending(r => r.CreatedAt);

            var total = await query.CountAsync();

            var ratings = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(r => new PublisherRatingWithUserDto
                {
                    Id = r.Id,
                    Value = r.Value,
                    Comment = r.Comment,
                    CreatedAt = r.CreatedAt,
                    User = new UserBasicDto
                    {
                        Id = r.User.Id,
                        Username = r.User.Username,
                        AvatarUrl = r.User.AvatarUrl
                    }
                })
                .ToListAsync();

            return (ratings, total);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "获取发布者评分列表时发生错误");
            return (new List<PublisherRatingWithUserDto>(), 0);
        }
    }

    /// <summary>
    /// 更新发布者的平均评分
    /// </summary>
    public async Task<bool> UpdatePublisherAverageRatingAsync(int publisherId)
    {
        try
        {
            var publisher = await _context.Publishers.FindAsync(publisherId);
            if (publisher == null) return false;

            var ratings = await _context.PublisherRatings
                .Where(r => r.PublisherId == publisherId)
                .Select(r => r.Value)
                .ToListAsync();

            if (ratings.Any())
            {
                publisher.Rating = Math.Round(ratings.Average(), 1);
            }
            else
            {
                publisher.Rating = 5.0; // 默认评分
            }

            publisher.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "更新发布者平均评分时发生错误");
            return false;
        }
    }
}