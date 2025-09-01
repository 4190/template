using Template.Data;
using Template.Data.EFCore;

namespace Template.Service
{
    public class TemplateService : ITemplateService
    {
        private readonly ITemplateRepository _templateRepository;

        public TemplateService(ITemplateRepository templateRepository)
        {
            _templateRepository = templateRepository;
        }

        public Task<TemplateModel> CreateTemplate(TemplateModel model) =>
            _templateRepository.Add(model);

        public Task<TemplateModel> DeleteTemplate(int id) =>
            _templateRepository.Delete(id);

        public Task<List<TemplateModel>> GetAllTemplates() =>
            _templateRepository.GetAll();

        public Task<TemplateModel> GetTemplateByID(int id) =>
            _templateRepository.Get(id);

        public Task<TemplateModel> UpdateTemplate(TemplateModel model) =>
            _templateRepository.Update(model);
    }
}
