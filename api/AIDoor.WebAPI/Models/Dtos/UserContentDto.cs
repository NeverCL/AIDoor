using System.ComponentModel.DataAnnotations;

namespace AIDoor.WebAPI.Models.Dtos;

public class UserContentCreateDto
{
    [Required(ErrorMessage = "标题不能为空")]
    [StringLength(100, ErrorMessage = "标题长度不能超过100个字符")]
    public string Title { get; set; } = null!;

    [StringLength(5000, ErrorMessage = "内容长度不能超过5000个字符")]
    public string? Content { get; set; }

    [Required(ErrorMessage = "必须上传至少一张图片")]
    public string[] Images { get; set; } = Array.Empty<string>();
}

public class UserContentDto
{
    public int Id { get; set; }
    public string Title { get; set; } = null!;
    public string? Content { get; set; }
    public string[] Images { get; set; } = Array.Empty<string>();
    public string CreatedBy { get; set; } = null!;
    public string? CreatedByAvatar { get; set; }
    public DateTime CreatedAt { get; set; }
    public int PublisherId { get; set; }
}

public class UserContentQueryParams
{
    private int _page = 1;
    private int _limit = 10;

    public int Page
    {
        get => _page;
        set => _page = value > 0 ? value : 1;
    }

    public int Limit
    {
        get => _limit;
        set => _limit = value > 0 && value <= 50 ? value : 10;
    }

    public bool IsOwner { get; set; }

    public int? PublisherId { get; set; } = null;
}