using System.ComponentModel.DataAnnotations;

namespace AIDoor.WebAPI.Models
{
    public class AccountCreateRequest
    {
        [Required]
        public string Username { get; set; }

        [Required]
        public string Password { get; set; }

        public bool? IsAdmin { get; set; }
    }
}