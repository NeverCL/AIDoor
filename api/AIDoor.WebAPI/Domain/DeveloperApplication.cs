using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using AIDoor.WebAPI.Models;

namespace AIDoor.WebAPI.Domain;

/// <summary>
/// 开发者申请状态枚举
/// </summary>
public enum DeveloperApplicationStatus
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

/// <summary>
/// 开发者申请实体
/// </summary>
public class DeveloperApplication : BaseEntity
{
    /// <summary>
    /// 申请用户ID
    /// </summary>
    public int UserId { get; set; }

    /// <summary>
    /// 项目名称
    /// </summary>
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// 项目Logo/产品图（存储图片路径，以逗号分隔）
    /// </summary>
    [Required]
    public string[] Logo { get; set; } = Array.Empty<string>();

    /// <summary>
    /// 项目介绍
    /// </summary>
    [Required]
    [MaxLength(1000)]
    public string Description { get; set; } = string.Empty;

    /// <summary>
    /// 项目链接/网址
    /// </summary>
    [MaxLength(200)]
    public string? Website { get; set; }

    /// <summary>
    /// 公司名称
    /// </summary>
    [MaxLength(100)]
    public string? Company { get; set; }

    /// <summary>
    /// 功能分类
    /// </summary>
    [Required]
    [MaxLength(50)]
    public string Category { get; set; } = string.Empty;

    /// <summary>
    /// 用户类型（开发者工具、普通用户使用、企业用户使用）
    /// </summary>
    [Required]
    [MaxLength(50)]
    public string UserType { get; set; } = string.Empty;

    /// <summary>
    /// 项目阶段（设计计划阶段、产品开发阶段）
    /// </summary>
    [Required]
    [MaxLength(50)]
    public string Stage { get; set; } = string.Empty;

    /// <summary>
    /// 申请状态
    /// </summary>
    public DeveloperApplicationStatus Status { get; set; } = DeveloperApplicationStatus.Pending;

    /// <summary>
    /// 审核时间
    /// </summary>
    public DateTime? AuditedAt { get; set; }

    /// <summary>
    /// 审核备注
    /// </summary>
    public string? AuditRemark { get; set; }

    /// <summary>
    /// 导航属性 - 用户
    /// </summary>
    [ForeignKey("UserId")]
    public User User { get; set; } = null!;
}