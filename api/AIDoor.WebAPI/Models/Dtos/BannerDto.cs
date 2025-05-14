using System.ComponentModel.DataAnnotations;

namespace AIDoor.WebAPI.Models.Dtos;

// Banner 查询DTO
public class BannerDto
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string BannerImageUrl { get; set; } = string.Empty;

    public string QrCodeImageUrl { get; set; } = string.Empty;

    public bool IsActive { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }
}

// Banner 创建DTO
public class BannerCreateDto
{
    [Required(ErrorMessage = "标题不能为空")]
    [MaxLength(100, ErrorMessage = "标题最大长度为100个字符")]
    public string Title { get; set; } = string.Empty;

    [Required(ErrorMessage = "Banner图片URL不能为空")]
    [MaxLength(255, ErrorMessage = "Banner图片URL最大长度为255个字符")]
    [Url(ErrorMessage = "请提供有效的URL")]
    public string BannerImageUrl { get; set; } = string.Empty;

    [Required(ErrorMessage = "二维码图片URL不能为空")]
    [MaxLength(255, ErrorMessage = "二维码图片URL最大长度为255个字符")]
    [Url(ErrorMessage = "请提供有效的URL")]
    public string QrCodeImageUrl { get; set; } = string.Empty;
}

// Banner 更新DTO
public class BannerUpdateDto
{
    [Required(ErrorMessage = "标题不能为空")]
    [MaxLength(100, ErrorMessage = "标题最大长度为100个字符")]
    public string Title { get; set; } = string.Empty;

    [Required(ErrorMessage = "Banner图片URL不能为空")]
    [MaxLength(255, ErrorMessage = "Banner图片URL最大长度为255个字符")]
    public string BannerImageUrl { get; set; } = string.Empty;

    [Required(ErrorMessage = "二维码图片URL不能为空")]
    [MaxLength(255, ErrorMessage = "二维码图片URL最大长度为255个字符")]
    public string QrCodeImageUrl { get; set; } = string.Empty;

    public bool IsActive { get; set; } = true;
}