namespace Timesheet.Model.Timesheet
{
    public class GetTimesheetModel
    {

        public long Id { get; set; }
        public long UserId { get; set; }
        public DateTime WorkDate { get; set; }
        public decimal Hours { get; set; }
        public string? WorkDay { get; set; }
        public string? Particular { get; set; }
        public int? ProjectId { get; set; }
        public string? Name { get; set; }
        public DateTime CreatedDate { get; set; }

    }
}
