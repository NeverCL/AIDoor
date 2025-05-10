using AIDoor.WebAPI.Models;
using System.Text.Json;

namespace AIDoor.WebAPI.Domain;

public class UserContent : BaseEntity
{
    public string Title { get; set; } = null!;
    
    public string? Content { get; set; }

    // 使用字符串数组存储图片路径
    public string[] Images { get; set; } = Array.Empty<string>();

    // 发布者ID
    public int PublisherId { get; set; }

    // 发布者导航属性
    public Publisher Publisher { get; set; } = null!;
}