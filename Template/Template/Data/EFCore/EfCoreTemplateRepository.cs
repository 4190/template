using Microsoft.EntityFrameworkCore;

namespace Template.Data.EFCore
{
    public class EfCoreTemplateRepository<TContext>
        : EfCoreRepository<TemplateModel, TContext>, ITemplateRepository
        where TContext : DbContext
    {
        public EfCoreTemplateRepository(TContext context) : base(context) { }
    }
}
