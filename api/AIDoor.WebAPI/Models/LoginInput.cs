using System.ComponentModel.DataAnnotations;

namespace AIDoor.WebAPI.Models
{
    public class LoginInput
    {
        [Required]
        public string username { get; set; } = string.Empty;

        [Required]
        public string password { get; set; } = string.Empty;

        public string? type { get; set; }

        public bool autoLogin { get; set; }
    }
}