using Timesheet.Model.Timesheet;

namespace Timesheet.DAL.Interfaces
{
    public interface ITimesheetRepository
    {
        Task<bool> InsertTimesheetAsync(TimesheetModel model);
        Task<IEnumerable<ProjectsModel>> GetProjectsAsync();
        Task<IEnumerable<GetTimesheetModel>> GetTimesheetAsync();
        Task<IEnumerable<GetTimesheetModel>> GetTimesheetByUserIdAsync(int userId);
        Task<GetTimesheetModel?> GetTimesheetByIdAsync(long Id);
        Task<bool> UpdateTimesheetAsync(GetTimesheetModel model);

    }
}
