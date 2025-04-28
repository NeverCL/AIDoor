using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using AIDoor.WebAPI.Models;

namespace AIDoor.WebAPI.Domain;

/// <summary>
/// 评论实体
/// </summary>
public class Comment : BaseEntity
{
    /// <summary>
    /// 评论内容
    /// </summary>
    [Required]
    [MaxLength(1000)]
    public string Content { get; set; } = string.Empty;

    /// <summary>
    /// 评论目标类型，如Content、App等
    /// </summary>
    [Required]
    [MaxLength(50)]
    public string TargetType { get; set; } = "Content";

    /// <summary>
    /// 评论目标ID
    /// </summary>
    [Required]
    public int TargetId { get; set; }

    /// <summary>
    /// 用户ID（评论作者）
    /// </summary>
    public int UserId { get; set; }

    /// <summary>
    /// 用户导航属性
    /// </summary>
    [ForeignKey("UserId")]
    public User User { get; set; } = null!;

    /// <summary>
    /// 父评论ID，用于回复功能
    /// </summary>
    public int? ParentId { get; set; }

    /// <summary>
    /// 父评论导航属性
    /// </summary>
    [ForeignKey("ParentId")]
    public Comment? Parent { get; set; }

    /// <summary>
    /// 点赞数
    /// </summary>
    public int LikeCount { get; set; }
}