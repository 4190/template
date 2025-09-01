using Microsoft.EntityFrameworkCore;

namespace Template.Data.EFCore
{
    // PostgreSQL-specific DbContext
    public class PostgresDbContext : DbContext
    {
        public PostgresDbContext(DbContextOptions<PostgresDbContext> options)
            : base(options)
        {
        }

        // DbSets for your entities
        public DbSet<TemplateModel> Template { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // You can add PostgreSQL-specific configuration here if needed
            // e.g., modelBuilder.HasPostgresExtension("uuid-ossp");
        }
    }
}
