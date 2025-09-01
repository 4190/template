using Microsoft.EntityFrameworkCore;
using Template.Data;
using Template.Data.EFCore;
using Template.Service;

namespace Template
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddControllers();
            builder.Services.AddRouting(options => options.LowercaseUrls = true);
            builder.Services.AddOpenApi();

            builder.Services.AddScoped<ITemplateService, TemplateService>();

            // Select database provider and connection string
            var dbProvider = builder.Configuration["DatabaseProvider"];
            if (dbProvider == "SqlServer")
            {
                builder.Services.AddDbContext<ApplicationDbContext>(options =>
                    options.UseSqlServer(builder.Configuration.GetConnectionString("Conn")));
                builder.Services.AddScoped<ITemplateRepository, EfCoreTemplateRepository<ApplicationDbContext>>();
                Console.WriteLine("--> Using SQL Server");
            }
            else if (dbProvider == "Postgres")
            {
                builder.Services.AddDbContext<PostgresDbContext>(options =>
                    options.UseNpgsql(builder.Configuration.GetConnectionString("PostgresConn")));
                builder.Services.AddScoped<ITemplateRepository, EfCoreTemplateRepository<PostgresDbContext>>();
                Console.WriteLine("--> Using Postgres SQL");
            }

            else
            {
                throw new Exception("Invalid or missing DatabaseProvider config. Use 'SqlServer' or 'Postgres'.");
            }

            var app = builder.Build();

            // Apply migrations automatically at startup
            PrepDb.PrepPopulation(app);

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
            }

            app.UseHttpsRedirection();
            app.UseAuthorization();
            app.MapControllers();
            app.Run();
        }
    }
}
