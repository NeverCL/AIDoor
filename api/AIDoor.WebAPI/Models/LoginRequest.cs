using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace AIDoor.WebAPI.Models
{
    public class LoginRequest
    {
        [Required]
        [JsonPropertyName("username")]
        public string Username { get; set; }

        [Required]
        [JsonPropertyName("password")]
        public string Password { get; set; }

        [JsonPropertyName("type")]
        public string Type { get; set; }

        [JsonPropertyName("autoLogin")]
        public bool AutoLogin { get; set; }
    }
}