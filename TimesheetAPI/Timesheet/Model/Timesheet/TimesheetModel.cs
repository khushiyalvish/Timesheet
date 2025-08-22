namespace Timesheet.Model.Timesheet
{
    public class TimesheetModel
    {
        public long UserId { get; set; }
        public DateTime WorkDate { get; set; }
        public string Particular { get; set; }
        public int ProjectId { get; set; }
        public decimal Hours { get; set; }
        public byte Status { get; set; }
        public bool IsActive { get; set; }
    }
}
