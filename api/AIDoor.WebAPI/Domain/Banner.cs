using System.ComponentModel.DataAnnotations;

namespace AIDoor.WebAPI.Domain;

/// <summary>
/// Represents a banner with an associated QR code
/// </summary>
public class Banner : BaseEntity
{
    [Required]
    [MaxLength(100)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [MaxLength(255)]
    public string BannerImageUrl { get; set; } = string.Empty;

    [Required]
    [MaxLength(255)]
    public string QrCodeImageUrl { get; set; } = string.Empty;
}