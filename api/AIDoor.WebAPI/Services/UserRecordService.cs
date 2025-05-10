using AIDoor.WebAPI.Data;
using AIDoor.WebAPI.Domain;
using AIDoor.WebAPI.Models.Dtos;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Linq.Expressions;

namespace AIDoor.WebAPI.Services;

/// <summary>
/// 用户记录服务，处理用户浏览、收藏、点赞等记录
/// </summary>
public class UserRecordService
{
    private readonly AppDbContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly ILogger<UserRecordService> _logger;

    public UserRecordService(
        AppDbContext context,
        IHttpContextAccessor httpContextAccessor,
        ILogger<UserRecordService> logger)
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
    /// 创建用户记录
    /// </summary>
    public async Task<(bool Success, string Message, int RecordId)> CreateRecordAsync(UserRecordCreateDto recordDto)
    {
        try
        {
            int userId = GetCurrentUserId();

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return (false, "用户不存在", 0);
            }

            // 如果是足迹类型，检查是否已存在相同目标的记录
            if (recordDto.RecordType == RecordType.Footprint && recordDto.TargetId.HasValue && !string.IsNullOrEmpty(recordDto.TargetType))
            {
                var existingRecord = await _context.UserRecords
                    .FirstOrDefaultAsync(r =>
                        r.UserId == userId &&
                        r.RecordType == RecordType.Footprint &&
                        r.Notes == $"{recordDto.TargetType}:{recordDto.TargetId}");

                if (existingRecord != null)
                {
                    // 已存在记录，更新访问时间和计数
                    existingRecord.LastViewedAt = DateTime.UtcNow;
                    existingRecord.ViewCount++;
                    await _context.SaveChangesAsync();
                    return (true, "更新足迹记录成功", existingRecord.Id);
                }
            }

            // 获取目标内容的创建者ID，设置为TargetUserId
            int? targetUserId = null;
            if (recordDto.TargetId.HasValue && !string.IsNullOrEmpty(recordDto.TargetType))
            {
                if (recordDto.TargetType.Equals("Content", StringComparison.OrdinalIgnoreCase))
                {
                    var content = await _context.UserContents.FindAsync(recordDto.TargetId.Value);
                    if (content != null)
                    {
                        targetUserId = content.PublisherId;
                    }
                }
                else if (recordDto.TargetType.Equals("User", StringComparison.OrdinalIgnoreCase))
                {
                    targetUserId = recordDto.TargetId;
                }
            }

            // 创建新记录
            var userRecord = new UserRecord
            {
                RecordType = recordDto.RecordType,
                Title = recordDto.Title,
                ImageUrl = recordDto.ImageUrl,
                UserId = userId,
                TargetUserId = targetUserId,
                Notes = recordDto.TargetId.HasValue && !string.IsNullOrEmpty(recordDto.TargetType)
                    ? $"{recordDto.TargetType}:{recordDto.TargetId}"
                    : recordDto.Notes,
                LastViewedAt = DateTime.UtcNow
            };

            _context.UserRecords.Add(userRecord);
            await _context.SaveChangesAsync();

            return (true, "创建记录成功", userRecord.Id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "创建用户记录失败");
            return (false, $"创建记录失败: {ex.Message}", 0);
        }
    }

    /// <summary>
    /// 获取用户记录列表
    /// </summary>
    public async Task<(List<UserRecordDto> Records, int TotalCount)> GetRecordsAsync(UserRecordQueryParams queryParams)
    {
        try
        {
            int userId = GetCurrentUserId();

            var query = _context.UserRecords
                .Where(r => r.UserId == userId);

            // 获取总记录数
            int totalCount = await query.CountAsync();

            List<UserRecordDto> records;

            // 应用筛选条件
            if (queryParams.RecordType.HasValue)
            {
                // 有指定记录类型，按照分页参数获取数据
                records = await query
                    .Where(r => r.RecordType == queryParams.RecordType.Value)
                    .OrderByDescending(r => r.LastViewedAt ?? r.CreatedAt)
                    .Skip((queryParams.Page - 1) * queryParams.Limit)
                    .Take(queryParams.Limit)
                    .Select(r => new UserRecordDto
                    {
                        Id = r.Id,
                        RecordType = r.RecordType,
                        TypeString = r.TypeString,
                        Title = r.Title,
                        ImageUrl = r.ImageUrl + "?x-oss-process=image/resize,p_30",
                        Notes = r.Notes,
                        LastViewedAt = r.LastViewedAt,
                        ViewCount = r.ViewCount,
                        CreatedAt = r.CreatedAt
                    })
                    .ToListAsync();
            }
            else
            {
                // 没有指定记录类型，获取每种类型前6条记录
                var recordsList = new List<UserRecordDto>();

                // 获取所有记录类型的枚举值
                var recordTypes = Enum.GetValues(typeof(RecordType)).Cast<RecordType>();

                // 对每种类型单独查询前6条记录
                foreach (var recordType in recordTypes)
                {
                    var typeRecords = await query
                        .Where(r => r.RecordType == recordType)
                        .OrderByDescending(r => r.LastViewedAt ?? r.CreatedAt)
                        .Take(6)
                        .Select(r => new UserRecordDto
                        {
                            Id = r.Id,
                            RecordType = r.RecordType,
                            TypeString = r.TypeString,
                            Title = r.Title,
                            ImageUrl = r.ImageUrl + "?x-oss-process=image/resize,p_30",
                            Notes = r.Notes,
                            LastViewedAt = r.LastViewedAt,
                            ViewCount = r.ViewCount,
                            CreatedAt = r.CreatedAt
                        })
                        .ToListAsync();

                    recordsList.AddRange(typeRecords);
                }

                records = recordsList;
            }

            // 解析目标ID和类型
            ProcessRecords(records);

            return (records, totalCount);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "获取用户记录失败");
            return (new List<UserRecordDto>(), 0);
        }
    }

    /// <summary>
    /// 处理记录，解析目标ID和类型
    /// </summary>
    private void ProcessRecords(List<UserRecordDto> records)
    {
        foreach (var record in records)
        {
            if (!string.IsNullOrEmpty(record.Notes) && record.Notes.Contains(':'))
            {
                var parts = record.Notes.Split(':');
                if (parts.Length == 2 && int.TryParse(parts[1], out int targetId))
                {
                    record.TargetType = parts[0];
                    record.TargetId = targetId;
                }
            }
        }
    }

    /// <summary>
    /// 删除用户记录
    /// </summary>
    public async Task<(bool Success, string Message)> DeleteRecordAsync(int id)
    {
        try
        {
            int userId = GetCurrentUserId();

            var record = await _context.UserRecords.FindAsync(id);
            if (record == null)
            {
                return (false, "记录不存在");
            }

            if (record.UserId != userId)
            {
                return (false, "无权删除此记录");
            }

            _context.UserRecords.Remove(record);
            await _context.SaveChangesAsync();

            return (true, null);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "删除用户记录失败");
            return (false, $"删除失败: {ex.Message}");
        }
    }

    /// <summary>
    /// 清空用户某类型的所有记录
    /// </summary>
    public async Task<(bool Success, string Message)> ClearRecordsAsync(RecordType recordType)
    {
        try
        {
            int userId = GetCurrentUserId();

            var records = await _context.UserRecords
                .Where(r => r.UserId == userId && r.RecordType == recordType)
                .ToListAsync();

            if (records.Count == 0)
            {
                return (true, "没有记录需要清除");
            }

            _context.UserRecords.RemoveRange(records);
            await _context.SaveChangesAsync();

            return (true, $"已清除 {records.Count} 条记录");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "清空用户记录失败");
            return (false, $"清空失败: {ex.Message}");
        }
    }
}