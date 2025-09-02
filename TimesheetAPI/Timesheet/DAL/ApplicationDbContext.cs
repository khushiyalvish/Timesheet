using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Data;
using Timesheet.Model.Auth;
using Timesheet.Model.Timesheet;

namespace Timesheet.DAL
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
        {
        }


        public DbSet<UserDetails> Users { get; set; }
        public DbSet<TokenDetails> TokenDetails { get; set; }
        public DbSet<ProjectsModel> Project { get; set; }
        public DbSet<GetTimesheetModel> Timesheet { get; set; }
        public DbSet<GetCheckinModel> Checkin { get; set; }

    }
}
