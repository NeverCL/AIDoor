using System.ComponentModel.DataAnnotations.Schema;
using AIDoor.WebAPI.Models;

namespace AIDoor.WebAPI.Domain;

/// <summary>
/// 用户关注关系模型
/// </summary>
public class UserFollow : BaseEntity
{
    /// <summary>
    /// 关注者用户ID（当前用户）
    /// </summary>
    public int FollowerId { get; set; }

    /// <summary>
    /// 被关注者用户ID（被关注的用户）
    /// </summary>
    public int FollowingId { get; set; }

    /// <summary>
    /// 关注者用户（导航属性）
    /// </summary>
    [ForeignKey("FollowerId")]
    public User Follower { get; set; } = null!;

    /// <summary>
    /// 被关注者用户（导航属性）
    /// </summary>
    [ForeignKey("FollowingId")]
    public User Following { get; set; } = null!;
}