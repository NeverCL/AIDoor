using System.Text.Json.Serialization;

namespace AIDoor.WebAPI.Models
{
    public class CurrentUserResponse
    {
        [JsonPropertyName("isAuthenticated")]
        public bool IsAuthenticated { get; set; }

        [JsonPropertyName("name")]
        public string? Name { get; set; }

        [JsonPropertyName("avatar")]
        public string? Avatar { get; set; }

        [JsonPropertyName("userid")]
        public string? Userid { get; set; }

        [JsonPropertyName("email")]
        public string? Email { get; set; }

        [JsonPropertyName("signature")]
        public string? Signature { get; set; }

        [JsonPropertyName("title")]
        public string? Title { get; set; }

        [JsonPropertyName("group")]
        public string? Group { get; set; }

        [JsonPropertyName("access")]
        public string? Access { get; set; }

        [JsonPropertyName("phone")]
        public string? Phone { get; set; }
    }
}