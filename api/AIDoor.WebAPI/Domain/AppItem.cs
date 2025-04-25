using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AIDoor.WebAPI.Domain;

public class AppItem : BaseEntity
{
    [MaxLength(100)]
    public string Title { get; set; }

    [MaxLength(500)]
    public string Description { get; set; }

    [MaxLength(2000)]
    public string Content { get; set; } // 应用详情正文内容

    [MaxLength(500)]
    public string ImageUrl { get; set; }

    [MaxLength(1000)]
    public string Link { get; set; } // 应用跳转链接

    public int DisplayOrder { get; set; }

    [ForeignKey("Category")]
    public int CategoryId { get; set; }

    public AppCategory Category { get; set; }
}