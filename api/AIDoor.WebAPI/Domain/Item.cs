using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using AIDoor.WebAPI.Models;

namespace AIDoor.WebAPI.Domain;

public class Item : BaseEntity
{
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;
    
    public string ImageUrl { get; set; } = string.Empty;
    
    // User foreign key
    public int UserId { get; set; }
    
    // Navigation property to User
    [ForeignKey("UserId")]
    public User User { get; set; } = null!;
}