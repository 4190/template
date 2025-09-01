using Microsoft.EntityFrameworkCore;
using Template.Data.EFCore;

namespace Template.Data
{
    public static class PrepDb
    {
        public static void PrepPopulation(IApplicationBuilder app)
        {
            using var serviceScope = app.ApplicationServices.CreateScope();

            var config = serviceScope.ServiceProvider.GetRequiredService<IConfiguration>();
            var dbProvider = config["DatabaseProvider"];

            if (dbProvider == "SqlServer")
            {
                var context = serviceScope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                ApplyMigrations(context, "SqlServer");
            }
            else if (dbProvider == "Postgres")
            {
                var context = serviceScope.ServiceProvider.GetRequiredService<PostgresDbContext>();
                ApplyMigrations(context, "Postgres");
            }
            else
            {
                throw new Exception("Invalid DatabaseProvider config. Use 'SqlServer' or 'Postgres'.");
            }
        }

        private static void ApplyMigrations(DbContext context, string provider)
        {
            Console.WriteLine($"--> Attempting to apply {provider} migrations");

            try
            {
                context.Database.Migrate();
                Console.WriteLine($"--> {provider} migrations applied successfully");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"--> Could not run {provider} migrations: {ex.Message}");
            }
        }
    }
}
