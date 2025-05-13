namespace AIDoor.WebAPI.Models
{
    public class AccountListResponse
    {
        public List<AccountInfoResponse> Data { get; set; }
        public int Total { get; set; }
        public bool Success { get; set; }
    }
}