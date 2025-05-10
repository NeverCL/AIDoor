using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AIDoor.WebAPI.Domain;

public class AppCategory : BaseEntity
{
    [MaxLength(50)]
    public string Name { get; set; } = string.Empty;
    
    public int DisplayOrder { get; set; } = 0;
    
    public bool IsActive { get; set; } = true;
    
    // Navigation property
    public virtual ICollection<AppItem> Applications { get; set; } = new List<AppItem>();
} 