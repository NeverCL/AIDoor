using AIDoor.WebAPI.Data;
using AIDoor.WebAPI.Domain;
using AIDoor.WebAPI.Models.Dtos;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace AIDoor.WebAPI.Services;

/// <summary>
/// 评论服务
/// </summary>
public class CommentService
{
    private readonly AppDbContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly ILogger<CommentService> _logger;

    public CommentService(
        AppDbContext context,
        IHttpContextAccessor httpContextAccessor,
        ILogger<CommentService> logger)
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
    /// 创建评论
    /// </summary>
    public async Task<(bool Success, string Message, CommentDto? Comment)> CreateCommentAsync(CommentCreateDto commentDto)
    {
        try
        {
            int userId = GetCurrentUserId();

            // 检查用户
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return (false, "用户不存在", null);
            }

            // 验证目标是否存在（如内容）
            if (commentDto.TargetType == "Content")
            {
                var content = await _context.UserContents.FindAsync(commentDto.ContentId);
                if (content == null)
                {
                    return (false, "评论目标内容不存在", null);
                }
            }

            // 验证父评论是否存在
            if (commentDto.ParentId.HasValue)
            {
                var parentComment = await _context.Comments.FindAsync(commentDto.ParentId.Value);
                if (parentComment == null)
                {
                    return (false, "回复的评论不存在", null);
                }
            }

            // 创建评论
            var comment = new Comment
            {
                Content = commentDto.Content,
                TargetId = commentDto.ContentId,
                TargetType = commentDto.TargetType,
                UserId = userId,
                ParentId = commentDto.ParentId,
                CreatedAt = DateTime.Now
            };

            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();

            // 返回评论信息
            var commentDto1 = new CommentDto
            {
                Id = comment.Id,
                Content = comment.Content,
                TargetId = comment.TargetId,
                TargetType = comment.TargetType,
                CreatedAt = comment.CreatedAt,
                UserId = comment.UserId,
                Username = user.Username,
                UserAvatar = user.AvatarUrl,
                ParentId = comment.ParentId,
                LikeCount = comment.LikeCount
            };

            return (true, "评论成功", commentDto1);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "创建评论失败");
            return (false, $"创建评论失败: {ex.Message}", null);
        }
    }

    /// <summary>
    /// 获取评论列表
    /// </summary>
    public async Task<(List<CommentDto> Comments, int TotalCount)> GetCommentsAsync(CommentQueryParams queryParams)
    {
        try
        {
            // 构建查询
            var query = _context.Comments
                .Include(c => c.User)
                .Where(c => c.TargetId == queryParams.ContentId && c.TargetType == queryParams.TargetType);

            // 如果指定了父评论ID，则获取所有回复
            if (queryParams.ParentId.HasValue)
            {
                query = query.Where(c => c.ParentId == queryParams.ParentId);
            }
            else
            {
                // 只获取顶层评论（非回复）
                query = query.Where(c => c.ParentId == null);
            }

            // 计算总记录数
            int totalCount = await query.CountAsync();

            // 应用分页并获取数据
            var comments = await query
                .OrderByDescending(c => c.CreatedAt)
                .Skip((queryParams.Page - 1) * queryParams.Limit)
                .Take(queryParams.Limit)
                .Select(c => new CommentDto
                {
                    Id = c.Id,
                    Content = c.Content,
                    TargetId = c.TargetId,
                    TargetType = c.TargetType,
                    CreatedAt = c.CreatedAt,
                    UserId = c.UserId,
                    Username = c.User.Username,
                    UserAvatar = c.User.AvatarUrl,
                    ParentId = c.ParentId,
                    LikeCount = c.LikeCount
                })
                .ToListAsync();

            return (comments, totalCount);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "获取评论列表失败");
            return (new List<CommentDto>(), 0);
        }
    }

    /// <summary>
    /// 删除评论
    /// </summary>
    public async Task<(bool Success, string Message)> DeleteCommentAsync(int id)
    {
        try
        {
            int userId = GetCurrentUserId();

            // 获取评论
            var comment = await _context.Comments.FindAsync(id);
            if (comment == null)
            {
                return (false, "评论不存在");
            }

            // 检查权限（只有评论作者才能删除自己的评论）
            if (comment.UserId != userId)
            {
                return (false, "无权删除此评论");
            }

            _context.Comments.Remove(comment);
            await _context.SaveChangesAsync();

            return (true, "评论已删除");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "删除评论失败");
            return (false, $"删除评论失败: {ex.Message}");
        }
    }
}