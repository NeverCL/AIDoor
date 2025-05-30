using AIDoor.WebAPI.Data;
using AIDoor.WebAPI.Domain;
using AIDoor.WebAPI.Models.Dtos;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace AIDoor.WebAPI.Services;

public class UserContentService : BaseService
{
    public UserContentService(AppDbContext context, IHttpContextAccessor httpContextAccessor)
        : base(context, httpContextAccessor)
    {
    }

    private readonly static string[] videoExtensions =
        [".mp4", ".avi", ".mov", ".wmv", ".flv", ".mpeg", ".mpg", ".m4v", ".webm", ".mkv"];

    // 创建内容
    public async Task<(bool Success, string Message, int ContentId)> CreateContentAsync(UserContentCreateDto contentDto)
    {
        try
        {
            int userId = GetCurrentUserId();

            // 判断是否是视频
            var isVideo = contentDto.Images.Any(image => videoExtensions.Contains(Path.GetExtension(image)));

            if (isVideo)
            {
                // 视频只能上传一张
                if (contentDto.Images.Length > 1)
                {
                    return (false, "视频只能上传一张", 0);
                }
            }

            var publisher = await _context.Publishers.FirstAsync(x => x.UserId == userId);

            if (publisher == null)
            {
                return (false, "发布者不存在", 0);
            }

            var userContent = new UserContent
            {
                Title = contentDto.Title,
                Content = contentDto.Content,
                Images = contentDto.Images,
                PublisherId = publisher.Id,
                CreatedAt = DateTime.Now
            };

            _context.UserContents.Add(userContent);

            await _context.SaveChangesAsync();

            return (true, "内容发布成功", userContent.Id);
        }
        catch (Exception ex)
        {
            return (false, $"内容发布失败: {ex.Message}", 0);
        }
    }

    // 获取内容列表
    public async Task<(List<UserContentDto> Contents, int TotalCount)> GetContentsAsync(
        UserContentQueryParams queryParams)
    {
        var query = _context.UserContents
            .Include(uc => uc.Publisher)
            .OrderByDescending(uc => uc.CreatedAt);

        int totalCount = await query.CountAsync();

        int? publisherId = null;
        
        if (queryParams.IsOwner)
        {
            publisherId = GetCurrentPublisherId();
        }

        var contents = await query
            .Where(x => publisherId == null || x.PublisherId == publisherId)
            .Skip((queryParams.Page - 1) * queryParams.Limit)
            .Take(queryParams.Limit)
            .Select(uc => new UserContentDto
            {
                Id = uc.Id,
                Title = uc.Title,
                Content = uc.Content,
                Images = uc.Images,
                CreatedBy = uc.Publisher.Name,
                CreatedByAvatar = uc.Publisher.AvatarUrl,
                CreatedAt = uc.CreatedAt
            })
            .ToListAsync();

        contents.ForEach(x => x.Images = x.Images.Select(image => videoExtensions.Contains(Path.GetExtension(image))
            ? $"preview/{Path.GetDirectoryName(image) ?? ""}/{Path.GetFileNameWithoutExtension(image)}.png"
            : image + "?x-oss-process=image/resize,p_30").ToArray());

        return (contents, totalCount);
    }

    // 获取内容详情
    public async Task<UserContentDto?> GetContentByIdAsync(int id)
    {
        var content = await _context.UserContents
            .Include(uc => uc.Publisher)
            .FirstOrDefaultAsync(uc => uc.Id == id);

        if (content == null)
        {
            return null;
        }

        return new UserContentDto
        {
            Id = content.Id,
            Title = content.Title,
            Content = content.Content,
            Images = content.Images,
            CreatedBy = content.Publisher.Name,
            CreatedByAvatar = content.Publisher.AvatarUrl,
            CreatedAt = content.CreatedAt,
            PublisherId = content.PublisherId
        };
    }

    // 获取内容的统计数据（点赞数、收藏数、评论数）
    public async Task<ContentStatsDto> GetContentStatsAsync(int contentId)
    {
        // 获取内容所有者ID
        var content = await _context.UserContents.FindAsync(contentId);
        if (content == null)
        {
            return new ContentStatsDto();
        }

        int contentOwnerId = content.PublisherId;

        // 获取点赞数 - 使用TargetUserId和Notes两种方式查询以兼容新旧数据
        int likesCount = await _context.UserRecords.CountAsync(r =>
            r.RecordType == RecordType.Like &&
            ((r.TargetUserId == contentOwnerId && r.Notes == $"Content:{contentId}") ||
             (r.Notes == $"Content:{contentId}")));

        // 获取收藏数 - 使用TargetUserId和Notes两种方式查询以兼容新旧数据
        int favoritesCount = await _context.UserRecords.CountAsync(r =>
            r.RecordType == RecordType.Favorite &&
            ((r.TargetUserId == contentOwnerId && r.Notes == $"Content:{contentId}") ||
             (r.Notes == $"Content:{contentId}")));

        // 获取评论数
        int commentsCount = await _context.Comments.CountAsync(c =>
            c.TargetType == "Content" &&
            c.TargetId == contentId);

        // 获取浏览数（足迹记录数）
        int viewsCount = await _context.UserRecords.CountAsync(r =>
            r.RecordType == RecordType.ContentFootprint &&
            r.Notes == $"Content:{contentId}");

        return new ContentStatsDto
        {
            LikesCount = likesCount,
            FavoritesCount = favoritesCount,
            CommentsCount = commentsCount,
            ViewsCount = viewsCount
        };
    }

    // 删除内容
    public async Task<(bool Success, string Message)> DeleteContentAsync(int id)
    {
        try
        {
            int userId = GetCurrentUserId();

            var content = await _context.UserContents.FindAsync(id);
            if (content == null)
            {
                return (false, "内容不存在");
            }

            if (content.PublisherId != userId)
            {
                return (false, "无权删除此内容");
            }

            _context.UserContents.Remove(content);
            await _context.SaveChangesAsync();

            return (true, "内容已删除");
        }
        catch (Exception ex)
        {
            return (false, $"删除失败: {ex.Message}");
        }
    }
}