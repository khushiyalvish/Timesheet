namespace Timesheet.Model.Auth
{
    public class UserDetails
    {
        public int Id { get; set; } 
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string Salt { get; set; }
    }
}
