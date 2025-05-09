using AIDoor.WebAPI.Domain;
using System.Text.Json.Serialization;
using System.ComponentModel.DataAnnotations;

namespace AIDoor.WebAPI.Models.Dtos;

/// <summary>
/// 发布者详情DTO
/// </summary>
public class PublisherDto
{
    // 基本信息
    public int Id { get; set; }

    [JsonPropertyName("username")]
    public string Username { get; set; } = string.Empty;

    [JsonPropertyName("avatarUrl")]
    public string AvatarUrl { get; set; } = string.Empty;

    [JsonPropertyName("summary")]
    public string Summary { get; set; } = string.Empty;

    [JsonPropertyName("description")]
    public string Description { get; set; } = string.Empty;

    [JsonPropertyName("createdAt")]
    public DateTime CreatedAt { get; set; }

    // 状态信息
    [JsonPropertyName("status")]
    public PublisherStatus Status { get; set; }

    [JsonPropertyName("statusText")]
    public string StatusText { get; set; } = string.Empty;

    [JsonPropertyName("reviewNote")]
    public string? ReviewNote { get; set; }

    [JsonPropertyName("reviewedAt")]
    public DateTime? ReviewedAt { get; set; }

    // 类型信息
    [JsonPropertyName("type")]
    public PublisherType Type { get; set; }

    [JsonPropertyName("typeText")]
    public string TypeText { get; set; } = string.Empty;

    // 链接信息
    [JsonPropertyName("website")]
    public string? Website { get; set; }

    [JsonPropertyName("appLink")]
    public string? AppLink { get; set; }

    // 统计信息
    [JsonPropertyName("stats")]
    public PublisherStatsDto Stats { get; set; } = new();

    // 发布的作品列表
    [JsonPropertyName("contents")]
    public List<PublisherContentDto> Contents { get; set; } = new();
}

/// <summary>
/// 发布者统计数据DTO
/// </summary>
public class PublisherStatsDto
{
    /// <summary>
    /// 获赞数量
    /// </summary>
    [JsonPropertyName("likes")]
    public int Likes { get; set; }

    /// <summary>
    /// 被关注数量
    /// </summary>
    [JsonPropertyName("followers")]
    public int Followers { get; set; }

    /// <summary>
    /// 收藏数量
    /// </summary>
    [JsonPropertyName("favorites")]
    public int Favorites { get; set; }

    /// <summary>
    /// 评分
    /// </summary>
    [JsonPropertyName("rating")]
    public double Rating { get; set; }
}

/// <summary>
/// 发布者作品内容简略信息DTO
/// </summary>
public class PublisherContentDto
{
    public int Id { get; set; }

    [JsonPropertyName("title")]
    public string Title { get; set; } = string.Empty;

    [JsonPropertyName("imageUrl")]
    public string? ImageUrl { get; set; }

    [JsonPropertyName("createdAt")]
    public DateTime CreatedAt { get; set; }
}