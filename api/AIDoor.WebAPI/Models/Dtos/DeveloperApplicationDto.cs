using System.ComponentModel.DataAnnotations;
using AIDoor.WebAPI.Domain;

namespace AIDoor.WebAPI.Models.Dtos;

/// <summary>
/// 开发者申请创建DTO
/// </summary>
public class DeveloperApplicationCreateDto
{
    /// <summary>
    /// 项目名称
    /// </summary>
    [Required(ErrorMessage = "项目名称不能为空")]
    [StringLength(100, ErrorMessage = "项目名称长度不能超过100个字符")]
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// 项目Logo/产品图
    /// </summary>
    [Required(ErrorMessage = "请上传项目Logo/产品图")]
    public string[] Logo { get; set; } = Array.Empty<string>();

    /// <summary>
    /// 项目介绍
    /// </summary>
    [Required(ErrorMessage = "项目介绍不能为空")]
    [StringLength(1000, ErrorMessage = "项目介绍长度不能超过1000个字符")]
    public string Description { get; set; } = string.Empty;

    /// <summary>
    /// 项目链接/网址
    /// </summary>
    [StringLength(200, ErrorMessage = "项目链接/网址长度不能超过200个字符")]
    public string? Website { get; set; }

    /// <summary>
    /// 公司名称
    /// </summary>
    [StringLength(100, ErrorMessage = "公司名称长度不能超过100个字符")]
    public string? Company { get; set; }

    /// <summary>
    /// 功能分类
    /// </summary>
    [Required(ErrorMessage = "功能分类不能为空")]
    [StringLength(50, ErrorMessage = "功能分类长度不能超过50个字符")]
    public string Category { get; set; } = string.Empty;

    /// <summary>
    /// 用户类型（开发者工具、普通用户使用、企业用户使用）
    /// </summary>
    [Required(ErrorMessage = "用户类型不能为空")]
    [StringLength(50, ErrorMessage = "用户类型长度不能超过50个字符")]
    public string UserType { get; set; } = string.Empty;

    /// <summary>
    /// 项目阶段（设计计划阶段、产品开发阶段）
    /// </summary>
    [Required(ErrorMessage = "项目阶段不能为空")]
    [StringLength(50, ErrorMessage = "项目阶段长度不能超过50个字符")]
    public string Stage { get; set; } = string.Empty;
}

/// <summary>
/// 开发者申请详情DTO
/// </summary>
public class DeveloperApplicationDto
{
    /// <summary>
    /// 申请ID
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// 申请用户ID
    /// </summary>
    public int UserId { get; set; }

    /// <summary>
    /// 项目名称
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// 项目Logo/产品图
    /// </summary>
    public string[] Logo { get; set; } = Array.Empty<string>();

    /// <summary>
    /// 项目介绍
    /// </summary>
    public string Description { get; set; } = string.Empty;

    /// <summary>
    /// 项目链接/网址
    /// </summary>
    public string? Website { get; set; }

    /// <summary>
    /// 公司名称
    /// </summary>
    public string? Company { get; set; }

    /// <summary>
    /// 功能分类
    /// </summary>
    public string Category { get; set; } = string.Empty;

    /// <summary>
    /// 用户类型
    /// </summary>
    public string UserType { get; set; } = string.Empty;

    /// <summary>
    /// 项目阶段
    /// </summary>
    public string Stage { get; set; } = string.Empty;

    /// <summary>
    /// 申请状态
    /// </summary>
    public DeveloperApplicationStatus Status { get; set; }

    /// <summary>
    /// 状态文本
    /// </summary>
    public string StatusText => Status switch
    {
        DeveloperApplicationStatus.Pending => "审核中",
        DeveloperApplicationStatus.Approved => "已通过",
        DeveloperApplicationStatus.Rejected => "已拒绝",
        _ => "未知"
    };

    /// <summary>
    /// 提交时间
    /// </summary>
    public DateTime CreatedAt { get; set; }

    /// <summary>
    /// 审核时间
    /// </summary>
    public DateTime? AuditedAt { get; set; }

    /// <summary>
    /// 审核备注
    /// </summary>
    public string? AuditRemark { get; set; }
}

/// <summary>
/// 开发者申请状态DTO
/// </summary>
public class DeveloperApplicationStatusDto
{
    /// <summary>
    /// 是否已提交申请
    /// </summary>
    public bool HasApplied { get; set; }

    /// <summary>
    /// 申请状态
    /// </summary>
    public DeveloperApplicationStatus? Status { get; set; }

    /// <summary>
    /// 状态文本
    /// </summary>
    public string? StatusText { get; set; }

    /// <summary>
    /// 申请ID
    /// </summary>
    public int? ApplicationId { get; set; }

    /// <summary>
    /// 提交时间
    /// </summary>
    public DateTime? SubmittedAt { get; set; }
}