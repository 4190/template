using Microsoft.AspNetCore.Mvc;
using Template.Data;
using Template.Service;

namespace Template.Controllers;

[ApiController]
[Route("api/[controller]/")]
public class TemplateController : ControllerBase
{
    private readonly ILogger<TemplateController> _logger;
    private readonly ITemplateService _templateService;

    public TemplateController(ILogger<TemplateController> logger, ITemplateService templateService)
    {
        _logger = logger;
        _templateService = templateService;
    }

    [HttpGet("GetAll")]
    public async Task<ActionResult<List<TemplateModel>>> GetAllTemplateModels()
    {
        Console.WriteLine(":D");
        _logger.LogInformation(":D");
        List<TemplateModel> models = await _templateService.GetAllTemplates();
        return Ok(models);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TemplateModel>> GetTemplateModelByID(int id)
    {
        TemplateModel model =  await _templateService.GetTemplateByID(id);

        return Ok(model);
    }

    [HttpPost("Create")]
    public async Task<ActionResult<TemplateModel>> CreateTemplateModel([FromBody] TemplateModel model)
    {
        TemplateModel createdModel = await _templateService.CreateTemplate(model);

        return Created("", createdModel);
    }

    [HttpPut("Update")]
    public async Task<ActionResult<TemplateModel>> UpdateTemplateModel([FromBody] TemplateModel model)
    {
        TemplateModel updatedModel = await _templateService.UpdateTemplate(model);

        return Accepted(model);
    }

    [HttpDelete("Delete/{id}")]
    public async Task<ActionResult<TemplateModel>> DeleteTemplateModel(int id)
    {
        TemplateModel deletedModel = await _templateService.DeleteTemplate(id);

        return Ok(deletedModel);
    }
}
