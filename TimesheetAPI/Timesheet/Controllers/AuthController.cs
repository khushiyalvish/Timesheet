using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Timesheet.DAL.Interfaces;
using Timesheet.Model.Auth;

namespace Timesheet.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository _authRepository;


        public AuthController (IAuthRepository authRepository)
        {
            _authRepository = authRepository;
        }


        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegistrationModel model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            bool result = await _authRepository.RegisterUserAsync(model);
            if (!result)
                return StatusCode(500, "Something went wrong while registering the user.");

            return Ok(new { Message = "User registered successfully" });
        }




        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            var response = await _authRepository.LoginAsync(model);
            if (response == null)
                return Unauthorized(new { message = "Invalid credentials" });

            return Ok(response);
        }




        [HttpPost("logout")]
        public async Task<IActionResult> Logout([FromBody] LogoutModel model)
        {
            var result = await _authRepository.LogoutAsync(model.RefreshToken);

            if (!result)
                return BadRequest(new { message = "Invalid or already revoked token" });

            return Ok(new { message = "Logout successful" });
        }




        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken([FromBody] TokenRequestModel model)
        {
            var result = await _authRepository.RefreshTokenAsync(model);
            if (result == null)
                return Unauthorized(new { message = "Invalid refresh request" });

            return Ok(result);
        }



        [Authorize]
        [HttpPost("changepassword")]
        public async Task<IActionResult> ChangePassword(ChangePasswordModel model)
        {
            if (string.IsNullOrWhiteSpace(model.OldPassword) || string.IsNullOrWhiteSpace(model.NewPassword))
                return BadRequest(new { message = "Old and new password are required." });

            // Get UserId from token (ensure claim name matches)
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UserId") ?? User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized(new { message = "UserId claim missing in token." });

            model.UserId = int.Parse(userIdClaim.Value);

            try
            {
                bool isChanged = await _authRepository.ChangePasswordAsync(model);

                if (!isChanged)
                    return BadRequest(new { message = "Old password is incorrect or update failed." });

                return Ok(new { message = "Password changed successfully" });
            }
            catch (Exception ex)
            {
                // Temp: return server error message for debugging (remove or log in production)
                return StatusCode(500, new { message = $"An error occurred: {ex.Message}" });
            }
        }


    }
}
