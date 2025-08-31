using Microsoft.EntityFrameworkCore;

namespace Template.Data
{
    public class ApplicationDbContext : DbContext
    {
        DbSet<TemplateModel> Template { get; set; }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
        }
    }


    public class TemplateModel : IEntity
    {
        public int Id { get; set; }
        public string StringValue { get; set; }
        public int IntegerValue { get; set; }
    }
}
