using System.ComponentModel.DataAnnotations;

namespace AIDoor.WebAPI.Models.Dtos;

/// <summary>
/// 关注用户请求DTO
/// </summary>
public class UserFollowCreateDto
{
    /// <summary>
    /// 要关注的用户ID
    /// </summary>
    [Required]
    public int FollowingId { get; set; }
}

/// <summary>
/// 关注用户响应DTO
/// </summary>
public class UserFollowResponseDto
{
    /// <summary>
    /// 关注记录ID
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// 关注者ID（当前用户）
    /// </summary>
    public int FollowerId { get; set; }

    /// <summary>
    /// 被关注者ID
    /// </summary>
    public int FollowingId { get; set; }

    /// <summary>
    /// 被关注者用户名
    /// </summary>
    public string FollowingUsername { get; set; } = string.Empty;

    /// <summary>
    /// 被关注者头像URL
    /// </summary>
    public string FollowingAvatarUrl { get; set; } = string.Empty;

    /// <summary>
    /// 关注时间
    /// </summary>
    public DateTime CreatedAt { get; set; }
}

/// <summary>
/// 获取关注列表的查询参数
/// </summary>
public class UserFollowQueryParams
{
    /// <summary>
    /// 分页页码，默认为1
    /// </summary>
    public int Page { get; set; } = 1;

    /// <summary>
    /// 每页数量，默认为10
    /// </summary>
    public int Limit { get; set; } = 10;
}