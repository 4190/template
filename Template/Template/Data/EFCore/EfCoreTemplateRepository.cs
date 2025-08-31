namespace Template.Data.EFCore
{
    public class EfCoreTemplateRepository : EfCoreRepository<TemplateModel, ApplicationDbContext>
    {
        public EfCoreTemplateRepository(ApplicationDbContext context) : base(context)
        {

        }
    }
}

