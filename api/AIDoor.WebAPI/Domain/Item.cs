using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using AIDoor.WebAPI.Models;

namespace AIDoor.WebAPI.Domain;

public class Item
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;
    
    [Required]
    public string ImageUrl { get; set; } = string.Empty;
    
    // User foreign key
    public int UserId { get; set; }
    
    // Navigation property to User
    [ForeignKey("UserId")]
    public User User { get; set; } = null!;
    
    // Timestamps
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}