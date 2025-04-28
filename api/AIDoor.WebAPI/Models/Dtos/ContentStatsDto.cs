namespace AIDoor.WebAPI.Models.Dtos;

/// <summary>
/// 内容统计数据DTO
/// </summary>
public class ContentStatsDto
{
    /// <summary>
    /// 点赞数
    /// </summary>
    public int LikesCount { get; set; }

    /// <summary>
    /// 收藏数
    /// </summary>
    public int FavoritesCount { get; set; }

    /// <summary>
    /// 评论数
    /// </summary>
    public int CommentsCount { get; set; }

    /// <summary>
    /// 浏览数
    /// </summary>
    public int ViewsCount { get; set; }
}