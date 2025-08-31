using Template.Data;

namespace Template.Service
{
    public interface ITemplateService
    {
        public Task<List<TemplateModel>> GetAllTemplates();
        public Task<TemplateModel> GetTemplateByID(int id);
        public Task<TemplateModel> UpdateTemplate(TemplateModel model);
        public Task<TemplateModel> CreateTemplate(TemplateModel model);
        public Task<TemplateModel> DeleteTemplate(int id);
    }
}
