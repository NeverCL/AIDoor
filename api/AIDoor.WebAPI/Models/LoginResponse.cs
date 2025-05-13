using System.Text.Json.Serialization;

namespace AIDoor.WebAPI.Models
{
    public class LoginResponse
    {
        [JsonPropertyName("status")]
        public string Status { get; set; } = "error";

        [JsonPropertyName("type")]
        public string Type { get; set; } = "account";

        [JsonPropertyName("currentAuthority")]
        public string CurrentAuthority { get; set; } = "guest";
    }
}