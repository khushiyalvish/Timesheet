using Microsoft.EntityFrameworkCore;

namespace Timesheet.Model.Auth
{

    [Keyless]
    public class TokenDetails
    {
        public int UserId { get; set; }
        public string Email { get; set; }
        public string Token { get; set; }
        public DateTime ExpiryDate { get; set; }
        public bool IsRevoked { get; set; }
    }
}
