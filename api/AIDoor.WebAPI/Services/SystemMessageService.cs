using AIDoor.WebAPI.Data;
using AIDoor.WebAPI.Domain;
using AIDoor.WebAPI.Models.Dtos;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace AIDoor.WebAPI.Services;

/// <summary>
/// 系统消息服务
/// </summary>
public class SystemMessageService
{
    private readonly AppDbContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly ILogger<SystemMessageService> _logger;

    public SystemMessageService(
        AppDbContext context,
        IHttpContextAccessor httpContextAccessor,
        ILogger<SystemMessageService> logger)
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
    /// 获取系统消息列表
    /// </summary>
    public async Task<(List<SystemMessageDto> Messages, int TotalCount)> GetMessagesAsync(SystemMessageQueryParams queryParams)
    {
        try
        {
            int userId = GetCurrentUserId();

            // 构建基础查询
            var query = _context.SystemMessages
                .Where(m => m.RecipientId == userId || m.RecipientId == null); // 查询发给当前用户或所有用户的消息

            // 是否只显示未读消息
            if (queryParams.OnlyUnread.HasValue && queryParams.OnlyUnread.Value)
            {
                query = query.Where(m => !m.IsRead);
            }

            // 按消息类型筛选
            if (queryParams.Type.HasValue)
            {
                query = query.Where(m => m.Type == queryParams.Type.Value);
            }

            // 按最小优先级筛选
            if (queryParams.MinPriority.HasValue)
            {
                query = query.Where(m => m.Priority >= queryParams.MinPriority.Value);
            }

            // 排除已过期的消息
            query = query.Where(m => m.ExpireAt == null || m.ExpireAt > DateTime.Now);

            // 获取总记录数
            int totalCount = await query.CountAsync();

            // 获取分页结果
            var messages = await query
                .OrderByDescending(m => m.Priority) // 优先级高的在前面
                .ThenByDescending(m => m.CreatedAt) // 最新消息在前面
                .Skip((queryParams.Page - 1) * queryParams.Limit)
                .Take(queryParams.Limit)
                .Select(m => new SystemMessageDto
                {
                    Id = m.Id,
                    Title = m.Title,
                    Content = m.Content,
                    Type = m.Type,
                    IsRead = m.IsRead,
                    ReadAt = m.ReadAt,
                    ExpireAt = m.ExpireAt,
                    Priority = m.Priority,
                    CreatedAt = m.CreatedAt
                })
                .ToListAsync();

            return (messages, totalCount);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "获取系统消息失败");
            return (new List<SystemMessageDto>(), 0);
        }
    }

    /// <summary>
    /// 创建系统消息
    /// </summary>
    public async Task<(bool Success, string Message, int MessageId)> CreateMessageAsync(SystemMessageCreateDto messageDto)
    {
        try
        {
            // 创建新消息
            var systemMessage = new SystemMessage
            {
                Title = messageDto.Title,
                Content = messageDto.Content,
                Type = messageDto.Type,
                RecipientId = messageDto.RecipientId,
                ExpireAt = messageDto.ExpireAt,
                Priority = messageDto.Priority,
                IsRead = false,
                ReadAt = null
            };

            _context.SystemMessages.Add(systemMessage);
            await _context.SaveChangesAsync();

            return (true, "创建系统消息成功", systemMessage.Id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "创建系统消息失败");
            return (false, $"创建系统消息失败: {ex.Message}", 0);
        }
    }

    /// <summary>
    /// 获取单个系统消息
    /// </summary>
    public async Task<SystemMessageDto?> GetMessageByIdAsync(int id)
    {
        try
        {
            int userId = GetCurrentUserId();

            var message = await _context.SystemMessages
                .Where(m => m.Id == id && (m.RecipientId == userId || m.RecipientId == null))
                .Select(m => new SystemMessageDto
                {
                    Id = m.Id,
                    Title = m.Title,
                    Content = m.Content,
                    Type = m.Type,
                    IsRead = m.IsRead,
                    ReadAt = m.ReadAt,
                    ExpireAt = m.ExpireAt,
                    Priority = m.Priority,
                    CreatedAt = m.CreatedAt
                })
                .FirstOrDefaultAsync();

            return message;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"获取系统消息(ID:{id})失败");
            return null;
        }
    }

    /// <summary>
    /// 更新消息状态
    /// </summary>
    public async Task<(bool Success, string Message)> UpdateMessageStatusAsync(int id, SystemMessageUpdateDto updateDto)
    {
        try
        {
            int userId = GetCurrentUserId();

            var message = await _context.SystemMessages
                .Where(m => m.Id == id && (m.RecipientId == userId || m.RecipientId == null))
                .FirstOrDefaultAsync();

            if (message == null)
            {
                return (false, "消息不存在或无权访问");
            }

            // 更新读取状态
            message.IsRead = updateDto.IsRead;
            if (updateDto.IsRead && !message.ReadAt.HasValue)
            {
                message.ReadAt = DateTime.Now;
            }

            await _context.SaveChangesAsync();

            return (true, "更新消息状态成功");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"更新系统消息状态(ID:{id})失败");
            return (false, $"更新消息状态失败: {ex.Message}");
        }
    }

    /// <summary>
    /// 批量标记消息为已读
    /// </summary>
    public async Task<(bool Success, string Message, int Count)> MarkAllAsReadAsync()
    {
        try
        {
            int userId = GetCurrentUserId();
            var now = DateTime.Now;

            // 找到所有未读的消息
            var unreadMessages = await _context.SystemMessages
                .Where(m => !m.IsRead && (m.RecipientId == userId || m.RecipientId == null))
                .ToListAsync();

            if (unreadMessages.Count == 0)
            {
                return (true, "没有未读消息", 0);
            }

            // 标记为已读
            foreach (var message in unreadMessages)
            {
                message.IsRead = true;
                message.ReadAt = now;
            }

            await _context.SaveChangesAsync();

            return (true, "所有消息已标记为已读", unreadMessages.Count);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "批量标记消息为已读失败");
            return (false, $"标记消息为已读失败: {ex.Message}", 0);
        }
    }

    /// <summary>
    /// 删除系统消息
    /// </summary>
    public async Task<(bool Success, string Message)> DeleteMessageAsync(int id)
    {
        try
        {
            int userId = GetCurrentUserId();

            var message = await _context.SystemMessages
                .Where(m => m.Id == id && (m.RecipientId == userId || m.RecipientId == null))
                .FirstOrDefaultAsync();

            if (message == null)
            {
                return (false, "消息不存在或无权访问");
            }

            _context.SystemMessages.Remove(message);
            await _context.SaveChangesAsync();

            return (true, "删除消息成功");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"删除系统消息(ID:{id})失败");
            return (false, $"删除消息失败: {ex.Message}");
        }
    }

    /// <summary>
    /// 获取未读消息数量
    /// </summary>
    public async Task<int> GetUnreadCountAsync()
    {
        try
        {
            int userId = GetCurrentUserId();

            int count = await _context.SystemMessages
                .Where(m => !m.IsRead && (m.RecipientId == userId || m.RecipientId == null))
                .Where(m => m.ExpireAt == null || m.ExpireAt > DateTime.Now)
                .CountAsync();

            return count;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "获取未读消息数量失败");
            return 0;
        }
    }
}