using System;

namespace AIDoor.WebAPI.Domain
{
    /// <summary>
    /// Base entity class with common properties for all domain models
    /// </summary>
    public abstract class BaseEntity
    {
        public int Id { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime? UpdatedAt { get; set; }
        
        public bool IsActive { get; set; } = true;
    }
} 