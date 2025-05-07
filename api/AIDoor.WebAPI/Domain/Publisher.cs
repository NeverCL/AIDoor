using System.ComponentModel.DataAnnotations.Schema;

namespace AIDoor.WebAPI.Domain;

/// <summary>
/// 发布者实体
/// </summary>
public class Publisher : BaseEntity
{
    /// <summary>
    /// 发布者名称
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// 发布者头像
    /// </summary>
    public string AvatarUrl { get; set; } = string.Empty;

    /// <summary>
    /// 发布者描述
    /// </summary>
    public string Description { get; set; } = string.Empty;

    /// <summary>
    /// 发布者官网
    /// </summary>
    public string? Website { get; set; }

    /// <summary>
    /// 应用链接
    /// </summary>
    public string? AppLink { get; set; }

    /// <summary>
    /// 发布者类型（个人/企业）
    /// </summary>
    public PublisherType Type { get; set; } = PublisherType.Personal;

    /// <summary>
    /// 发布者状态
    /// </summary>
    public PublisherStatus Status { get; set; } = PublisherStatus.Pending;

    /// <summary>
    /// 审核备注
    /// </summary>
    public string? ReviewNote { get; set; }

    /// <summary>
    /// 审核时间
    /// </summary>
    public DateTime? ReviewedAt { get; set; }

    /// <summary>
    /// 发布者评分
    /// </summary>
    public double Rating { get; set; } = 5.0;

    /// <summary>
    /// 点赞数量
    /// </summary>
    public int LikesCount { get; set; }

    /// <summary>
    /// 粉丝数量
    /// </summary>
    public int FollowersCount { get; set; }

    /// <summary>
    /// 关注数量
    /// </summary>
    public int FollowingCount { get; set; }

    /// <summary>
    /// 关联的用户ID（可选）
    /// </summary>
    public int? UserId { get; set; }

    /// <summary>
    /// 导航属性：关联的用户（可选）
    /// </summary>
    [ForeignKey("UserId")]
    public Models.User? User { get; set; }
}

/// <summary>
/// 发布者类型
/// </summary>
public enum PublisherType
{
    /// <summary>
    /// 个人
    /// </summary>
    Personal = 0,

    /// <summary>
    /// 企业
    /// </summary>
    Enterprise = 1
}

/// <summary>
/// 发布者审核状态
/// </summary>
public enum PublisherStatus
{
    /// <summary>
    /// 待审核
    /// </summary>
    Pending = 0,

    /// <summary>
    /// 已通过
    /// </summary>
    Approved = 1,

    /// <summary>
    /// 已拒绝
    /// </summary>
    Rejected = 2
}
