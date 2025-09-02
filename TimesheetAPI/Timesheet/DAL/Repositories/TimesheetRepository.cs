using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.Data;
using Timesheet.DAL.Interfaces;
using Timesheet.Helpers;
using Timesheet.Model.Timesheet;

namespace Timesheet.DAL.Repositories
{
    public class TimesheetRepository : ITimesheetRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _config;
        private readonly string _connectionString;

        public TimesheetRepository(ApplicationDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
            _connectionString = _config.GetConnectionString("DefaultConnection");
        }



        public async Task<IEnumerable<ProjectsModel>> GetProjectsAsync()
        {
            
            var projects = await _context.Project
                .FromSqlRaw("EXEC Get_Projects")   
                .AsNoTracking()
                .ToListAsync();

            return projects;
        }



        public async Task<IEnumerable<GetTimesheetModel>> GetTimesheetAsync()
        {
            var timesheets = await _context.Timesheet
                .FromSqlRaw("EXEC Get_Timesheets")
                .AsNoTracking()
                .ToListAsync();

            return timesheets;
        }



        public async Task<IEnumerable<GetTimesheetModel>> GetTimesheetByUserIdAsync(int userId)
        {
            var timesheets = await _context.Timesheet
                .FromSqlInterpolated($"EXEC Get_TimesheetsByUserId {userId}")
                .AsNoTracking()
                .ToListAsync();

            return timesheets;
        }




        public async Task<bool> InsertTimesheetAsync(TimesheetModel model)
        {
            var sql = "EXEC dbo.Insert_M_Timesheet @UserId, @WorkDate, @Particular, @ProjectId, @Hours, @Status, @IsActive, @NewId OUTPUT";

            var pUserId = new SqlParameter("@UserId", SqlDbType.BigInt) { Value = model.UserId };
            var pWork = new SqlParameter("@WorkDate", SqlDbType.Date) { Value = model.WorkDate.Date };
            var pPart = new SqlParameter("@Particular", SqlDbType.NVarChar, -1) { Value = (object?)model.Particular ?? DBNull.Value };
            var pProj = new SqlParameter("@ProjectId", SqlDbType.Int) { Value = (object?)model.ProjectId ?? DBNull.Value };
            var pHours = new SqlParameter("@Hours", SqlDbType.Decimal) { Precision = 6, Scale = 2, Value = model.Hours };
            var pStatus = new SqlParameter("@Status", SqlDbType.TinyInt) { Value = (object?)model.Status ?? DBNull.Value };
            var pActive = new SqlParameter("@IsActive", SqlDbType.Bit) { Value = model.IsActive };
            var pNewId = new SqlParameter("@NewId", SqlDbType.BigInt) { Direction = ParameterDirection.Output };

            await _context.Database.ExecuteSqlRawAsync(sql, pUserId, pWork, pPart, pProj, pHours, pStatus, pActive, pNewId);

            return pNewId.Value != DBNull.Value && Convert.ToInt64(pNewId.Value) > 0;
        }


        public async Task<GetTimesheetModel?> GetTimesheetByIdAsync(long Id)
        {
            var result = await _context.Timesheet
                .FromSqlInterpolated($"EXEC Get_TimesheetById {Id}")
                .AsNoTracking()
                .ToListAsync();

            return result.FirstOrDefault();
        }



        public async Task<bool> UpdateTimesheetAsync(GetTimesheetModel model)
        {
            var sql = "EXEC dbo.Update_Timesheet @Id, @UserId, @WorkDate, @Particular, @ProjectId, @Hours, @Status, @IsActive";

            var pId = new SqlParameter("@Id", SqlDbType.BigInt) { Value = model.Id };
            var pUser = new SqlParameter("@UserId", SqlDbType.BigInt) { Value = model.UserId };
            var pWork = new SqlParameter("@WorkDate", SqlDbType.Date) { Value = model.WorkDate.Date };
            var pPart = new SqlParameter("@Particular", SqlDbType.NVarChar, -1) { Value = (object?)model.Particular ?? DBNull.Value };
            var pProj = new SqlParameter("@ProjectId", SqlDbType.Int) { Value = (object?)model.ProjectId ?? DBNull.Value };
            var pHours = new SqlParameter("@Hours", SqlDbType.Decimal) { Precision = 6, Scale = 2, Value = model.Hours };
            var pStatus = new SqlParameter("@Status", SqlDbType.TinyInt) { Value = 1 }; // or model.Status if you add it
            var pActive = new SqlParameter("@IsActive", SqlDbType.Bit) { Value = 1 }; // or model.IsActive if you add it

            var rows = await _context.Database.ExecuteSqlRawAsync(sql, pId, pUser, pWork, pPart, pProj, pHours, pStatus, pActive);

            return rows > 0;
        }




        //-------------for checkin checkout code ster from here---------------

        public async Task<CheckInResponseModel> InsertCheckInAsync(CheckInRequestModel request)
        {
            // Step 1: Get office location from DB
            double officeLat = 0;
            double officeLon = 0;
            int radius = 0;

            using (SqlConnection conn = new SqlConnection(_connectionString))
            using (SqlCommand cmd = new SqlCommand("SELECT TOP 1 Latitude, Longitude, RadiusMeters FROM OfficeLocations WHERE LocationName=@Location", conn))
            {
                cmd.Parameters.AddWithValue("@Location", request.Location);
                await conn.OpenAsync();
                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    if (await reader.ReadAsync())
                    {
                        officeLat = (double)reader.GetDecimal(0);
                        officeLon = (double)reader.GetDecimal(1);
                        radius = reader.GetInt32(2);
                    }
                }
            }

            if (officeLat == 0 && officeLon == 0)
            {
                return new CheckInResponseModel { NewCheckInId = 0, Message = "Invalid office location" };
            }

            // Step 2: Validate distance
            double distance = GeoHelper.GetDistanceInMeters(request.Latitude, request.Longitude, officeLat, officeLon);
            if (distance > radius)
            {
                return new CheckInResponseModel { NewCheckInId = 0, Message = "You are not within office radius. Check-in denied." };
            }

            // Step 3: Proceed with SP call
            using (SqlConnection conn = new SqlConnection(_connectionString))
            using (SqlCommand cmd = new SqlCommand("Insert_CheckIn", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@UserId", request.UserId);
                cmd.Parameters.AddWithValue("@DeviceId", request.DeviceId ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Location", request.Location ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Latitude", request.Latitude);
                cmd.Parameters.AddWithValue("@Longitude", request.Longitude);
                cmd.Parameters.AddWithValue("@CreatedBy", request.CreatedBy);

                await conn.OpenAsync();
                var result = await cmd.ExecuteScalarAsync();
               
                if (Convert.ToInt32(result) == -1)
                {
                    return new CheckInResponseModel
                    {
                        NewCheckInId = 0,
                        Message = "You already have an active check-in. Please check out first."
                    };
                }
                return new CheckInResponseModel
                {
                    NewCheckInId = Convert.ToInt32(result),
                    Message = "Check-in successful"
                };
            }
        }







        public async Task<IEnumerable<GetCheckinModel>> GetCheckInByUserIdAsync(int userId)
        {
            var result = new List<GetCheckinModel>();
         
            using (var connection = _context.Database.GetDbConnection())
            {
                if (connection.State == System.Data.ConnectionState.Closed)
                    await connection.OpenAsync();

                using (var command = connection.CreateCommand())
                {
                    command.CommandText = "Get_CheckInByUserId";
                    command.CommandType = System.Data.CommandType.StoredProcedure;

                    var param = command.CreateParameter();
                    param.ParameterName = "@UserId";
                    param.Value = userId;
                    command.Parameters.Add(param);

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            result.Add(new GetCheckinModel
                            {
                                CheckInCheckOutId = reader.GetInt64(reader.GetOrdinal("CheckInCheckOutId")),
                                UserId = (int)reader.GetInt64(reader.GetOrdinal("UserId")),
                                Name = reader.GetString(reader.GetOrdinal("Name")),
                                CheckInTime = reader.IsDBNull(reader.GetOrdinal("CheckInTime"))
                                                ? null
                                                : reader.GetString(reader.GetOrdinal("CheckInTime")),
                                CheckOutTime = reader.IsDBNull(reader.GetOrdinal("CheckOutTime"))
                                                ? null
                                                : reader.GetString(reader.GetOrdinal("CheckOutTime")),
                                Status = reader.GetString(reader.GetOrdinal("Status")),
                                CreatedDate = reader.GetDateTime(reader.GetOrdinal("CreatedDate"))
                                                .ToString("yyyy-MM-dd")
                            });
                        }
                    }
                }
            }

            return result;
           
        }








        public async Task<bool> CheckOutAsync(CheckoutModel model)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                using (SqlCommand cmd = new SqlCommand("Update_CheckOut", conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@CheckInCheckOutId", model.CheckInCheckOutId);
                    cmd.Parameters.AddWithValue("@UserId", model.UserId);
                    cmd.Parameters.AddWithValue("@ModifiedBy", model.ModifiedBy);

                    await conn.OpenAsync();

                    var result = await cmd.ExecuteScalarAsync();
                    int rowsAffected = result != null ? (int)result : 0;

                    return rowsAffected > 0;
                }
            }
        }

    }

}
