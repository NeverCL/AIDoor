using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using AIDoor.WebAPI.Models;

namespace AIDoor.WebAPI.Domain;

/// <summary>
/// 内容类型枚举
/// </summary>
public enum RecordType
{
    /// <summary>
    /// 点赞
    /// </summary>
    Like,
    
    /// <summary>
    /// 收藏
    /// </summary>
    Favorite,
    
    /// <summary>
    /// 浏览足迹
    /// </summary>
    Footprint
}

/// <summary>
/// 用户记录，包含点赞、收藏和浏览足迹
/// </summary>
public class UserRecord : BaseEntity
{
    /// <summary>
    /// 记录类型
    /// </summary>
    public RecordType RecordType { get; set; }
    
    /// <summary>
    /// 记录类型的字符串表示，用于前端匹配
    /// </summary>
    [NotMapped]
    public string TypeString => RecordType.ToString().ToLower();
    
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;
    
    public string ImageUrl { get; set; } = string.Empty;
    
    // User foreign key
    public int UserId { get; set; }
    
    // Navigation property to User
    [ForeignKey("UserId")]
    public User User { get; set; } = null!;
    
    // 可选备注
    public string? Notes { get; set; }
    
    // 最后查看时间，主要用于足迹类型
    public DateTime? LastViewedAt { get; set; }
    
    // 查看计数，主要用于足迹类型
    public int ViewCount { get; set; } = 1;
} 