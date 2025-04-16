using System.ComponentModel.DataAnnotations;

namespace AIDoor.WebAPI.Models.Dtos;

public class ItemDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public UserInfoDto Author { get; set; } = new();
}

public class UserInfoDto
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string AvatarUrl { get; set; } = string.Empty;
}

public class ItemCreateDto
{
    [Required(ErrorMessage = "标题不能为空")]
    [StringLength(200, ErrorMessage = "标题长度不能超过200个字符")]
    public string Title { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "图片URL不能为空")]
    public string ImageUrl { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "作者ID不能为空")]
    public int UserId { get; set; }
}

public class ItemUpdateDto
{
    [StringLength(200, ErrorMessage = "标题长度不能超过200个字符")]
    public string? Title { get; set; }
    
    public string? ImageUrl { get; set; }
}

public class ItemQueryParams
{
    public int Page { get; set; } = 1;
    public int Limit { get; set; } = 10;
} 