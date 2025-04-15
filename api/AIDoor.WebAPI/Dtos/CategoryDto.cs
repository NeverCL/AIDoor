using System.ComponentModel.DataAnnotations;

namespace AIDoor.WebAPI.Models.Dtos;

// 用于展示分类信息的DTO
public class CategoryDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int DisplayOrder { get; set; } = 0;
    public List<ApplicationDto> Applications { get; set; } = new List<ApplicationDto>();
}

// 用于创建分类的DTO
public class CategoryCreateDto
{
    [Required]
    [MaxLength(50)]
    public string Name { get; set; } = string.Empty;
    
    public int DisplayOrder { get; set; } = 0;
}

// 用于更新分类的DTO
public class CategoryUpdateDto
{
    [Required]
    [MaxLength(50)]
    public string Name { get; set; } = string.Empty;
    
    public int DisplayOrder { get; set; } = 0;
    
    public bool IsActive { get; set; } = true;
} 