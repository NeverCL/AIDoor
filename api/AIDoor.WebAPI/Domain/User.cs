using AIDoor.WebAPI.Domain;

namespace AIDoor.WebAPI.Models;

public class User : BaseEntity
{
    /// <summary>
    /// 是否为开发模式
    /// </summary>
    public bool IsDevMode { get; set; }
    public string Username { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string AvatarUrl { get; set; } = string.Empty;
    public DateTime? LastLoginAt { get; set; }
    public int MessageCount { get; set; }
    public int FollowCount { get; set; }
}