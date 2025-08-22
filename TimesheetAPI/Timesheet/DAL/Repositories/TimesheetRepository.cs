using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.Data;
using Timesheet.DAL.Interfaces;
using Timesheet.Model.Timesheet;

namespace Timesheet.DAL.Repositories
{
    public class TimesheetRepository : ITimesheetRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _config;

        public TimesheetRepository(ApplicationDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
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



    }
}
