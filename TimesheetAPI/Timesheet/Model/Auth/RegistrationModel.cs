namespace Timesheet.Model.Auth
{
    public class RegistrationModel
    {

        public string Name { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }
        public bool IsActive { get; set; }
    }
}
