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
            if ((recordDto.RecordType == RecordType.ContentFootprint ||
                 recordDto.RecordType == RecordType.AppFootprint) && recordDto.TargetId.HasValue)
            {
                var existingRecord = await _context.UserRecords
                    .FirstOrDefaultAsync(r =>
                        r.UserId == userId &&
                        r.RecordType == recordDto.RecordType &&
                        ((recordDto.RecordType == RecordType.AppFootprint && r.AppId == recordDto.TargetId) ||
                         (recordDto.RecordType == RecordType.ContentFootprint && r.ContentId == recordDto.TargetId)));

                if (existingRecord != null)
                {
                    // 已存在记录，更新访问时间和计数
                    existingRecord.LastViewedAt = DateTime.Now;
                    existingRecord.ViewCount++; // 增加浏览计数
                    await _context.SaveChangesAsync();
                    return (true, "更新足迹记录成功", existingRecord.Id);
                }
            }

            // 获取目标内容的创建者ID，设置为TargetUserId
            int? targetUserId = null; // 默认值为0，表示未指定目标
            if (recordDto.TargetId.HasValue)
            {
                if (recordDto.RecordType == RecordType.ContentFootprint || recordDto.RecordType == RecordType.Like ||
                    recordDto.RecordType == RecordType.Favorite)
                {
                    var content = await _context.UserContents.FindAsync(recordDto.TargetId.Value);
                    if (content != null)
                    {
                        targetUserId = content.PublisherId;
                    }
                }
            }

            // 创建新记录
            var userRecord = new UserRecord
            {
                RecordType = recordDto.RecordType,
                UserId = userId,
                TargetUserId = targetUserId,
                AppId = recordDto.RecordType == RecordType.AppFootprint ? recordDto.TargetId : null,
                ContentId = (recordDto.RecordType == RecordType.ContentFootprint ||
                             recordDto.RecordType == RecordType.Like ||
                             recordDto.RecordType == RecordType.Favorite)
                    ? recordDto.TargetId
                    : null,
                LastViewedAt = DateTime.Now,
                ViewCount = 1 // 初始化浏览计数为1
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

            RecordType.TryParse<RecordType>(queryParams.RecordType, out var recordType);

            // 构建基本查询，预加载相关实体以优化性能
            IQueryable<UserRecord> query = _context.UserRecords
                .Where(r => r.UserId == userId && r.RecordType == recordType)
                .Include(r => r.User);

            // 根据记录类型过滤记录
            if (recordType == RecordType.ContentFootprint || recordType == RecordType.Like ||
                recordType == RecordType.Favorite)
            {
                // 对于内容相关记录，过滤只有ContentId的记录
                query = query.Where(r => r.ContentId != null);
            }
            else if (recordType == RecordType.AppFootprint)
            {
                // 对于应用相关记录，过滤只有AppId的记录
                query = query.Where(r => r.AppId != null);
            }

            // 获取总记录数
            int totalCount = await query.CountAsync();

            // 获取分页数据
            var records = await query
                .OrderByDescending(r => r.LastViewedAt ?? r.CreatedAt)
                .Skip((queryParams.Page - 1) * queryParams.Limit)
                .Take(queryParams.Limit)
                .ToListAsync();

            // 预加载内容和应用数据，避免N+1查询问题
            var contentIds = records.Where(r => r.ContentId.HasValue).Select(r => r.ContentId.Value).Distinct()
                .ToList();
            var appIds = records.Where(r => r.AppId.HasValue).Select(r => r.AppId.Value).Distinct().ToList();

            var contents = new Dictionary<int, UserContent>();
            var apps = new Dictionary<int, AppItem>();

            if (contentIds.Any())
            {
                var contentsList = await _context.UserContents.Where(c => contentIds.Contains(c.Id)).ToListAsync();
                contents = contentsList.ToDictionary(c => c.Id);
            }

            if (appIds.Any())
            {
                var appsList = await _context.Applications.Where(a => appIds.Contains(a.Id)).ToListAsync();
                apps = appsList.ToDictionary(a => a.Id);
            }

            // 转换为DTO
            var recordDtos = new List<UserRecordDto>();
            foreach (var r in records)
            {
                string title = string.Empty;
                string imageUrl = string.Empty;

                // 根据记录类型获取标题和图片
                if (r.ContentId.HasValue && contents.TryGetValue(r.ContentId.Value, out var content))
                {
                    title = content.Title;
                    imageUrl = GetImageUrl(content.Images[0]);
                }
                else if (r.AppId.HasValue && apps.TryGetValue(r.AppId.Value, out var app))
                {
                    title = app.Title;
                    imageUrl = app.ImageUrl;
                }

                recordDtos.Add(new UserRecordDto
                {
                    Id = r.Id,
                    RecordType = r.RecordType,
                    TypeString = r.TypeString,
                    Title = title,
                    ImageUrl = imageUrl,
                    LastViewedAt = r.LastViewedAt,
                    ViewCount = r.ViewCount,
                    CreatedAt = r.CreatedAt,
                    UserName = r.User.Username,
                    UserAvatarUrl = r.User.AvatarUrl,
                    TargetId = r.AppId ?? r.ContentId
                });
            }

            return (recordDtos, totalCount);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "获取用户记录失败");
            return (new List<UserRecordDto>(), 0);
        }
    }

    public static string GetImageUrl(string image)
    {
        if (string.IsNullOrEmpty(image))
        {
            return string.Empty;
        }

        return UserContentService.videoExtensions.Contains(Path.GetExtension(image))
            ? "preview/" + Path.ChangeExtension(image, ".png")
            : image;
    }

    /// <summary>
    /// 处理记录，解析目标ID和类型
    /// </summary>
    private void ProcessRecords(List<UserRecordDto> records)
    {
        // This method is now deprecated as we're using direct properties
        // Keeping for backwards compatibility but not using it
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

            var recordsQuery = _context.UserRecords.Where(r => r.UserId == userId);

            // 根据枚举类型筛选记录
            if (recordType == RecordType.Like)
            {
                recordsQuery = recordsQuery.Where(r => r.RecordType == RecordType.Like);
            }
            else if (recordType == RecordType.Favorite)
            {
                recordsQuery = recordsQuery.Where(r => r.RecordType == RecordType.Favorite);
            }
            else if (recordType == RecordType.ContentFootprint)
            {
                recordsQuery = recordsQuery.Where(r => r.RecordType == RecordType.ContentFootprint);
            }
            else if (recordType == RecordType.AppFootprint)
            {
                recordsQuery = recordsQuery.Where(r => r.RecordType == RecordType.AppFootprint);
            }
            // 如果想清空所有足迹，可以通过API添加特殊处理

            var records = await recordsQuery.ToListAsync();

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

    /// <summary>
    /// 获取应用的总浏览次数
    /// </summary>
    /// <param name="appId">应用ID</param>
    /// <returns>总浏览次数</returns>
    public async Task<int> GetAppViewCountAsync(int appId)
    {
        try
        {
            // 查询所有记录该应用的足迹记录，并汇总ViewCount
            var totalViews = await _context.UserRecords
                .Where(r => r.RecordType == RecordType.AppFootprint && r.AppId == appId)
                .SumAsync(r => r.ViewCount);

            return totalViews;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"获取应用{appId}的浏览次数失败");
            return 0;
        }
    }

    /// <summary>
    /// 获取最受欢迎的内容（基于浏览次数）
    /// </summary>
    /// <param name="limit">限制返回数量</param>
    /// <returns>内容ID和浏览次数的列表</returns>
    public async Task<List<(int ContentId, int ViewCount)>> GetMostViewedContentAsync(int limit = 10)
    {
        try
        {
            var mostViewedContent = await _context.UserRecords
                .Where(r => r.RecordType == RecordType.ContentFootprint && r.ContentId.HasValue)
                .GroupBy(r => r.ContentId)
                .Select(g => new
                {
                    ContentId = g.Key.Value,
                    TotalViews = g.Sum(r => r.ViewCount)
                })
                .OrderByDescending(x => x.TotalViews)
                .Take(limit)
                .ToListAsync();

            return mostViewedContent.Select(x => (x.ContentId, x.TotalViews)).ToList();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "获取最受欢迎内容失败");
            return new List<(int, int)>();
        }
    }

    /// <summary>
    /// 获取最受欢迎的应用（基于浏览次数）
    /// </summary>
    /// <param name="limit">限制返回数量</param>
    /// <returns>应用ID和浏览次数的列表</returns>
    public async Task<List<(int AppId, int ViewCount)>> GetMostViewedAppsAsync(int limit = 10)
    {
        try
        {
            var mostViewedApps = await _context.UserRecords
                .Where(r => r.RecordType == RecordType.AppFootprint && r.AppId.HasValue)
                .GroupBy(r => r.AppId)
                .Select(g => new
                {
                    AppId = g.Key.Value,
                    TotalViews = g.Sum(r => r.ViewCount)
                })
                .OrderByDescending(x => x.TotalViews)
                .Take(limit)
                .ToListAsync();

            return mostViewedApps.Select(x => (x.AppId, x.TotalViews)).ToList();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "获取最受欢迎应用失败");
            return new List<(int, int)>();
        }
    }
}