using AIDoor.WebAPI.Domain;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace AIDoor.WebAPI.Models.Dtos;

/// <summary>
/// 用户评分请求DTO
/// </summary>
public class RatePublisherRequestDto
{
    /// <summary>
    /// 评分值（1-5星）
    /// </summary>
    [Required]
    [Range(1, 5, ErrorMessage = "评分必须在1-5之间")]
    public int Rating { get; set; }

    /// <summary>
    /// 评价内容（可选）
    /// </summary>
    [MaxLength(500)]
    public string? Comment { get; set; }
}

/// <summary>
/// 用户评分返回DTO
/// </summary>
public class PublisherRatingDto
{
    /// <summary>
    /// 评分值
    /// </summary>
    [JsonPropertyName("value")]
    public int Value { get; set; }

    /// <summary>
    /// 评价内容
    /// </summary>
    [JsonPropertyName("comment")]
    public string? Comment { get; set; }

    /// <summary>
    /// 创建时间
    /// </summary>
    [JsonPropertyName("createdAt")]
    public DateTime CreatedAt { get; set; }

    /// <summary>
    /// 更新时间
    /// </summary>
    [JsonPropertyName("updatedAt")]
    public DateTime? UpdatedAt { get; set; }
}

/// <summary>
/// 带用户信息的评分DTO
/// </summary>
public class PublisherRatingWithUserDto
{
    /// <summary>
    /// 评分ID
    /// </summary>
    [JsonPropertyName("id")]
    public int Id { get; set; }

    /// <summary>
    /// 评分值
    /// </summary>
    [JsonPropertyName("value")]
    public int Value { get; set; }

    /// <summary>
    /// 评价内容
    /// </summary>
    [JsonPropertyName("comment")]
    public string? Comment { get; set; }

    /// <summary>
    /// 创建时间
    /// </summary>
    [JsonPropertyName("createdAt")]
    public DateTime CreatedAt { get; set; }

    /// <summary>
    /// 评分用户信息
    /// </summary>
    [JsonPropertyName("user")]
    public UserBasicDto User { get; set; } = null!;
}

/// <summary>
/// 用户基本信息DTO
/// </summary>
public class UserBasicDto
{
    /// <summary>
    /// 用户ID
    /// </summary>
    [JsonPropertyName("id")]
    public int Id { get; set; }

    /// <summary>
    /// 用户名
    /// </summary>
    [JsonPropertyName("username")]
    public string Username { get; set; } = string.Empty;

    /// <summary>
    /// 头像URL
    /// </summary>
    [JsonPropertyName("avatarUrl")]
    public string AvatarUrl { get; set; } = string.Empty;
}