using System.ComponentModel.DataAnnotations;
using AIDoor.WebAPI.Domain;

namespace AIDoor.WebAPI.Models.Dtos;

/// <summary>
/// 评论查询参数
/// </summary>
public class CommentQueryParams
{
    private int _page = 1;
    private int _limit = 10;

    /// <summary>
    /// 页码
    /// </summary>
    public int Page
    {
        get => _page;
        set => _page = value > 0 ? value : 1;
    }

    /// <summary>
    /// 每页评论数
    /// </summary>
    public int Limit
    {
        get => _limit;
        set => _limit = value > 0 && value <= 50 ? value : 10;
    }

    /// <summary>
    /// 目标内容ID
    /// </summary>
    [Required]
    public int ContentId { get; set; }

    /// <summary>
    /// 目标类型，默认为Content
    /// </summary>
    public string TargetType { get; set; } = "Content";

    /// <summary>
    /// 父评论ID，用于获取回复
    /// </summary>
    public int? ParentId { get; set; }
}

/// <summary>
/// 创建评论请求DTO
/// </summary>
public class CommentCreateDto
{
    /// <summary>
    /// 评论内容
    /// </summary>
    [Required(ErrorMessage = "评论内容不能为空")]
    [MaxLength(1000, ErrorMessage = "评论内容不能超过1000个字符")]
    public string Content { get; set; } = string.Empty;

    /// <summary>
    /// 目标内容ID
    /// </summary>
    [Required(ErrorMessage = "目标内容ID不能为空")]
    public int ContentId { get; set; }

    /// <summary>
    /// 目标类型，默认为Content
    /// </summary>
    public string TargetType { get; set; } = "Content";

    /// <summary>
    /// 父评论ID，用于回复功能
    /// </summary>
    public int? ParentId { get; set; }
}

/// <summary>
/// 评论响应DTO
/// </summary>
public class CommentDto
{
    /// <summary>
    /// 评论ID
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// 评论内容
    /// </summary>
    public string Content { get; set; } = string.Empty;

    /// <summary>
    /// 目标内容ID
    /// </summary>
    public int TargetId { get; set; }

    /// <summary>
    /// 目标类型
    /// </summary>
    public string TargetType { get; set; } = string.Empty;

    /// <summary>
    /// 创建时间
    /// </summary>
    public DateTime CreatedAt { get; set; }

    /// <summary>
    /// 用户ID
    /// </summary>
    public int UserId { get; set; }

    /// <summary>
    /// 用户名
    /// </summary>
    public string Username { get; set; } = string.Empty;

    /// <summary>
    /// 用户头像URL
    /// </summary>
    public string UserAvatar { get; set; } = string.Empty;

    /// <summary>
    /// 父评论ID
    /// </summary>
    public int? ParentId { get; set; }

    /// <summary>
    /// 点赞数
    /// </summary>
    public int LikeCount { get; set; }
}