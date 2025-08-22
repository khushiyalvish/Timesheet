using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Timesheet.DAL.Interfaces;
using Timesheet.DAL.Repositories;
using Timesheet.Model.Timesheet;

namespace Timesheet.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TimesheetController : ControllerBase
    {
        private readonly ITimesheetRepository _repository;
        private readonly ILogger<TimesheetController> _logger;

        public TimesheetController(ITimesheetRepository repository, ILogger<TimesheetController> logger)
        {
            _repository = repository;
            _logger = logger;
        }




        [HttpGet("projects")]
        public async Task<IActionResult> GetProjects()
        {
            try
            {
                var projects = await _repository.GetProjectsAsync();
                return Ok(projects);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Failed to fetch projects.", Error = ex.Message, Details = ex.ToString() });
            }
        }




        [HttpGet("timesheet")]

        public async Task<IActionResult> GetTimesheet()
        {
            try
            {
                var timesheet = await _repository.GetTimesheetAsync();
                return Ok(timesheet);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Failed to fetch timesheet.", Error = ex.Message, Details = ex.ToString() });
            }
        }






        [HttpGet("timesheet/{userId}")]
        public async Task<IActionResult> GetTimesheetByUserId(int userId)
        {
            try
            {
                var timesheet = await _repository.GetTimesheetByUserIdAsync(userId);

                if (timesheet == null || !timesheet.Any())
                    return NotFound(new { Message = $"No timesheet found for UserId {userId}" });

                return Ok(timesheet);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Failed to fetch timesheet.", Error = ex.Message, Details = ex.ToString() });
            }
        }




        [HttpGet("my-timesheet")]
        public async Task<IActionResult> GetMyTimesheet()
        {
            try
            {
                // Try multiple claim types
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                                  ?? User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value
                                  ?? User.FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")?.Value;

                if (string.IsNullOrEmpty(userIdClaim))
                    return Unauthorized(new { Message = "UserId not found in token." });

                int userId = int.Parse(userIdClaim);

                var timesheet = await _repository.GetTimesheetByUserIdAsync(userId);
                return Ok(timesheet);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Failed to fetch timesheet.", Error = ex.Message });
            }
        }




        [HttpPost("insert")]
        public async Task<IActionResult> InsertTimesheet([FromBody] TimesheetModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _repository.InsertTimesheetAsync(model);

            if (result)
                return Ok(new { Message = "Timesheet inserted successfully." });

            return StatusCode(500, new { Message = "Failed to insert timesheet." });
        }


        [HttpGet("timesheet/detail/{Id}")]
        public async Task<IActionResult> GetTimesheetById(long Id)
        {
            try
            {
                var timesheet = await _repository.GetTimesheetByIdAsync(Id);

                if (timesheet == null)
                    return NotFound(new { Message = $"Timesheet with Id {Id} not found." });

                return Ok(timesheet);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Failed to fetch timesheet.", Error = ex.Message });
            }
        }






        [HttpPut("update/{Id}")]
        public async Task<IActionResult> UpdateTimesheet(long Id, [FromBody] GetTimesheetModel model)
        {
            if (Id != model.Id)
                return BadRequest(new { Message = "Id mismatch." });

            try
            {
                var success = await _repository.UpdateTimesheetAsync(model);
                if (!success)
                    return NotFound(new { Message = $"Timesheet with Id {Id} not found or not updated." });

                return Ok(new { Message = "Timesheet updated successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Failed to update timesheet.", Error = ex.Message });
            }
        }


    }
}
