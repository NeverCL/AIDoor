using System.ComponentModel.DataAnnotations;

namespace AIDoor.WebAPI.Models.Dtos;

// 用于展示应用信息的DTO
public class ApplicationDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public string Link { get; set; } = string.Empty;
    public int DisplayOrder { get; set; } = 0;
    public int CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
}

// 用于详细展示应用信息的DTO
public class ApplicationDetailDto : ApplicationDto
{
    public string Content { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

// 用于创建应用的DTO
public class ApplicationCreateDto
{
    [Required]
    [MaxLength(100)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(500)]
    public string Description { get; set; } = string.Empty;

    [MaxLength(2000)]
    public string Content { get; set; } = string.Empty;

    [MaxLength(500)]
    public string ImageUrl { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string Link { get; set; } = string.Empty;

    public int DisplayOrder { get; set; } = 0;

    [Required]
    public int CategoryId { get; set; }
}

// 用于更新应用的DTO
public class ApplicationUpdateDto
{
    [Required]
    [MaxLength(100)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(500)]
    public string Description { get; set; } = string.Empty;

    [MaxLength(2000)]
    public string Content { get; set; } = string.Empty;

    [MaxLength(500)]
    public string ImageUrl { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string Link { get; set; } = string.Empty;

    public int DisplayOrder { get; set; } = 0;

    public bool IsActive { get; set; } = true;

    [Required]
    public int CategoryId { get; set; }
}