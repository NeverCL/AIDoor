namespace AIDoor.WebAPI.Models
{
    public class AccountQueryParams
    {
        public int? Current { get; set; }
        public int? PageSize { get; set; }
        public string? Username { get; set; }
        public bool? IsActive { get; set; }
    }
}