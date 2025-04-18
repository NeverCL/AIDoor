using AIDoor.WebAPI.Domain;

namespace AIDoor.WebAPI.Models;

public class User : BaseEntity
{
    public string Username { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string AvatarUrl { get; set; } = string.Empty;
    public DateTime? LastLoginAt { get; set; }
} 