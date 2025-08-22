using Timesheet.Model.Auth;

namespace Timesheet.DAL.Interfaces
{
    public interface IAuthRepository
    {
        Task<bool> RegisterUserAsync(RegistrationModel model);
        Task<LoginResponseModel> LoginAsync (LoginModel model);
        Task<bool> LogoutAsync(string refreshToken);
        Task<TokenResponseModel> RefreshTokenAsync(TokenRequestModel model);
        Task<bool> ChangePasswordAsync(ChangePasswordModel model);
    }

}
