
using Microsoft.EntityFrameworkCore;
using System.Text;
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
            // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
            builder.Services.AddOpenApi();

            //if (builder.Environment.IsProduction())
            //{
            //    Console.WriteLine(">>?auth");

            //    StringBuilder sb = new StringBuilder();
            //    sb.Append(builder.Configuration.GetConnectionString("AuthConn"))
            //        .Append(Environment.GetEnvironmentVariable("CONNECTION_STRING_CREDS"));

            //    Console.WriteLine(sb.ToString());

            //    builder
            //        .Services
            //        .AddDbContext<ApplicationDbContext>
            //        (opt => opt.UseSqlServer(sb.ToString()));
            //}
            builder.Services.AddScoped<ITemplateService, TemplateService>();
            builder.Services.AddScoped<EfCoreTemplateRepository>();
                builder
                    .Services
                    .AddDbContext<ApplicationDbContext>
                    (opt => opt.UseSqlServer(builder.Configuration.GetConnectionString("Conn")));



            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();

            PrepDb.PrepPopulation(app);

            app.MapControllers();

            app.Run();
        }
    }
}
