using AIDoor.WebAPI.Domain;
using System.ComponentModel.DataAnnotations;

namespace AIDoor.WebAPI.Models.Dtos;

/// <summary>
/// 创建用户记录请求DTO
/// </summary>
public class UserRecordCreateDto
{
    /// <summary>
    /// 记录类型
    /// </summary>
    [Required(ErrorMessage = "记录类型不能为空")]
    public RecordType RecordType { get; set; } = RecordType.Footprint;

    /// <summary>
    /// 标题
    /// </summary>
    [Required(ErrorMessage = "标题不能为空")]
    [MaxLength(200, ErrorMessage = "标题长度不能超过200个字符")]
    public string Title { get; set; } = string.Empty;

    /// <summary>
    /// 图片URL
    /// </summary>
    public string ImageUrl { get; set; } = string.Empty;

    /// <summary>
    /// 目标ID，可以是内容ID、应用ID等
    /// </summary>
    public int? TargetId { get; set; }

    /// <summary>
    /// 目标类型，如App、Content等
    /// </summary>
    public string? TargetType { get; set; }

    /// <summary>
    /// 附加信息，可选
    /// </summary>
    public string? Notes { get; set; }
}

/// <summary>
/// 用户记录响应DTO
/// </summary>
public class UserRecordDto
{
    public int Id { get; set; }
    public RecordType RecordType { get; set; }
    public string TypeString { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public int? TargetId { get; set; }
    public string? TargetType { get; set; }
    public string? Notes { get; set; }
    public DateTime? LastViewedAt { get; set; }
    public int ViewCount { get; set; }
    public DateTime CreatedAt { get; set; }
}

/// <summary>
/// 用户记录查询参数
/// </summary>
public class UserRecordQueryParams
{
    private int _page = 1;
    private int _limit = 20;

    public int Page
    {
        get => _page;
        set => _page = value > 0 ? value : 1;
    }

    public int Limit
    {
        get => _limit;
        set => _limit = value > 0 && value <= 50 ? value : 20;
    }

    public string? RecordType { get; set; }
}