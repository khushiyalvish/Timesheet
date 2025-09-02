using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace Timesheet.Model.Timesheet
{
    public class GetCheckinModel
    {
        [Key]
        public long CheckInCheckOutId { get; set; }
        public int UserId { get; set; }
        public string? Name { get; set; }
        public string CheckInTime { get; set; }
        public string? CheckOutTime { get; set; }
        public string Status { get; set; }
        public string CreatedDate { get; set; }
    }
}
