using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Data;
using System.Security.Claims;
using System.Security.Cryptography.Pkcs;
using Timesheet.DAL.Interfaces;
using Timesheet.Helpers;
using Timesheet.Model.Auth;

namespace Timesheet.DAL.Repositories
{
    public class AuthRepository : IAuthRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _config;

        public AuthRepository(ApplicationDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }




        public async Task<bool> RegisterUserAsync(RegistrationModel model)
        {
            string salt = PasswordHelper.GenerateSalt();
            string hashedPassword = PasswordHelper.HashPassword(model.Password, salt);

            int result = await _context.Database.ExecuteSqlRawAsync(
                "EXEC Crud_RegisterUser @Name, @Email, @PasswordHash, @Salt, @IsActive",
                new SqlParameter("@Name", model.Name),
                new SqlParameter("@Email", model.Email),
                new SqlParameter("@PasswordHash", hashedPassword),
                new SqlParameter("@Salt", salt),
                new SqlParameter("@IsActive",true)
            );

            return result > 0;
        }




        public async Task<LoginResponseModel> LoginAsync(LoginModel model)
        {
            var emailParam = new SqlParameter("@Email", model.Email);

            // Fetch user info (including hashed password and salt)
            var userResult = await _context.Users
                .FromSqlRaw("EXEC Get_LoginEmail @Email", emailParam)
                .ToListAsync();

            if (userResult == null || !userResult.Any())
                return null;

            var user = userResult.First();

            // Assume User entity has Id (int), Email, PasswordHash, Salt
            string inputHash = PasswordHelper.HashPassword(model.Password, user.Salt);

            if (user.PasswordHash != inputHash)
                return null;

            string accessToken = TokenHelper.GenerateAccessToken(user.Id.ToString(), user.Email, _config);
            string refreshToken = TokenHelper.GenerateRefreshToken();

            // Store refresh token
            var userIdParam = new SqlParameter("@UserId", user.Id);
            var tokenParam = new SqlParameter("@Token", refreshToken);
            var expiryParam = new SqlParameter("@ExpiryDate", DateTime.Now.AddDays(7));
            var revokedParam = new SqlParameter("@IsRevoked", false);

            await _context.Database.ExecuteSqlRawAsync(
                "EXEC Insert_RefreshToken @UserId, @Token, @ExpiryDate, @IsRevoked",
                userIdParam, tokenParam, expiryParam, revokedParam
            );

            return new LoginResponseModel
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken,
                Email = user.Email
               
            };
        }




        public async Task<bool> LogoutAsync(string refreshToken)
        {
            using var connection = _context.Database.GetDbConnection();
            await connection.OpenAsync();

            using var command = connection.CreateCommand();
            command.CommandText = "Logout_RefreshToken";
            command.CommandType = CommandType.StoredProcedure;

            // Input parameter
            var tokenParam = command.CreateParameter();
            tokenParam.ParameterName = "@Token";
            tokenParam.Value = refreshToken;
            tokenParam.DbType = DbType.String;
            command.Parameters.Add(tokenParam);

            // RETURN value parameter
            var returnParam = command.CreateParameter();
            returnParam.Direction = ParameterDirection.ReturnValue;
            returnParam.DbType = DbType.Int32;
            command.Parameters.Add(returnParam);

            await command.ExecuteNonQueryAsync();

            int result = (int)(returnParam.Value ?? 0);
            return result == 1;
        }





        public async Task<TokenResponseModel> RefreshTokenAsync(TokenRequestModel model)
        {
            var principal = TokenHelper.GetPrincipalFromExpiredToken(model.AccessToken, _config);
            if (principal == null)
                return null;

            var email = principal.FindFirst(ClaimTypes.Email)?.Value;

            // Validate refresh token from DB
            var param = new SqlParameter("@RefreshToken", model.RefreshToken);
            var result = await _context.TokenDetails
                .FromSqlRaw("EXEC Validate_RefreshToken @RefreshToken", param)
                .ToListAsync();

            if (!result.Any())
                return null;

            var tokenRecord = result.First();

            if (tokenRecord.IsRevoked || tokenRecord.ExpiryDate < DateTime.UtcNow || tokenRecord.Email != email)
                return null;

            // Generate new tokens
            var newAccessToken = TokenHelper.GenerateAccessToken(tokenRecord.UserId.ToString(), tokenRecord.Email, _config);
            var newRefreshToken = TokenHelper.GenerateRefreshToken();

            // Store new refresh token
            await _context.Database.ExecuteSqlRawAsync(
                "EXEC Insert_RefreshToken @UserId, @Token, @ExpiryDate, @IsRevoked",
                new SqlParameter("@UserId", tokenRecord.UserId),
                new SqlParameter("@Token", newRefreshToken),
                new SqlParameter("@ExpiryDate", DateTime.Now.AddDays(7)),
                new SqlParameter("@IsRevoked", false)
            );

            return new TokenResponseModel
            {
                AccessToken = newAccessToken,
                RefreshToken = newRefreshToken
            };
        }



        public async Task<bool> ChangePasswordAsync(ChangePasswordModel model)
        {
            var userIdParam = new SqlParameter("@UserId", model.UserId);
            var userResult = await _context.Users
                .FromSqlRaw("EXEC Get_UserById @UserId", userIdParam)
                .ToListAsync();

            if (userResult == null || !userResult.Any())
                return false;

            var user = userResult.First();

            string oldPasswordHash = PasswordHelper.HashPassword(model.OldPassword, user.Salt);
            if (oldPasswordHash != user.PasswordHash)
                return false;

            string newSalt = PasswordHelper.GenerateSalt();
            string newPasswordHash = PasswordHelper.HashPassword(model.NewPassword, newSalt);

            var paramUserId = new SqlParameter("@UserId", model.UserId);
            var paramPasswordHash = new SqlParameter("@PasswordHash", newPasswordHash);
            var paramSalt = new SqlParameter("@Salt", newSalt);

            var result = await _context.Database.ExecuteSqlRawAsync(
                "EXEC spChangePassword @UserId, @PasswordHash, @Salt",
                paramUserId, paramPasswordHash, paramSalt
            );

            return result > 0;
        }


    }
}
