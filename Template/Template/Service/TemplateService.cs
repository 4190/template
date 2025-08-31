using Template.Data;
using Template.Data.EFCore;

namespace Template.Service
{
    public class TemplateService : ITemplateService
    {
        private readonly EfCoreTemplateRepository _templateRepository;
        public TemplateService(EfCoreTemplateRepository templateRepository)
        {
            _templateRepository = templateRepository;
        }
        public Task<TemplateModel> CreateTemplate(TemplateModel model)
        {
            return _templateRepository.Add(model);
        }

        public Task<TemplateModel> DeleteTemplate(int id)
        {
            return _templateRepository.Delete(id);
        }

        public Task<List<TemplateModel>> GetAllTemplates()
        {
            return _templateRepository.GetAll();
        }

        public Task<TemplateModel> GetTemplateByID(int id)
        {
            return _templateRepository.Get(id);
        }

        public Task<TemplateModel> UpdateTemplate(TemplateModel model)
        {
            return _templateRepository.Update(model);
        }
    }
}
