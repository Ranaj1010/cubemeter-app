using cubemeter_api.Entities;
using Microsoft.EntityFrameworkCore;

namespace cubemeter_api.Data
{
    public class DataContext : DbContext
    {
        public DataContext()
        {

        }
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }
        public DbSet<Tenant> Tenants { get; set; }
        public DbSet<Place> Places { get; set; }
        public DbSet<Meter> Meters { get; set; }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
            => optionsBuilder.UseNpgsql("Host=localhost;Database=cubemeter_db;Username=postgres;Password=Baba101095", x => x.UseNetTopologySuite());
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.UseSerialColumns();
            modelBuilder.HasPostgresExtension("postgis");
        }
    }
}