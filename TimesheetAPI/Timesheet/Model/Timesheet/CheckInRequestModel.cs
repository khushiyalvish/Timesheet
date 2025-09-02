namespace Timesheet.Model.Timesheet
{
    public class CheckInRequestModel
    {
        public int UserId { get; set; }
        public string DeviceId { get; set; }
        public string Location { get; set; }  
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public int CreatedBy { get; set; }
    }
}
