using System.Text.Json.Serialization;

namespace AIDoor.WebAPI.Dtos;

/// <summary>
/// 用户记录类型DTO
/// </summary>
public class UserRecordTypeDto
{
    /// <summary>
    /// 记录类型: like(点赞), favorite(收藏), footprint(足迹)
    /// </summary>
    [JsonPropertyName("type")]
    public string Type { get; set; } = string.Empty;
    
    /// <summary>
    /// 记录项列表
    /// </summary>
    [JsonPropertyName("data")]
    public List<UserRecordItemDto> Data { get; set; } = new();
}

/// <summary>
/// 用户记录项DTO
/// </summary>
public class UserRecordItemDto
{
    /// <summary>
    /// 记录ID
    /// </summary>
    [JsonPropertyName("id")]
    public int Id { get; set; }
    
    /// <summary>
    /// 图片URL
    /// </summary>
    [JsonPropertyName("img")]
    public string Img { get; set; } = string.Empty;
    
    /// <summary>
    /// 记录标题
    /// </summary>
    [JsonPropertyName("title")]
    public string Title { get; set; } = string.Empty;
    
    /// <summary>
    /// 创建时间
    /// </summary>
    [JsonPropertyName("createdAt")]
    public DateTime CreatedAt { get; set; }
} 