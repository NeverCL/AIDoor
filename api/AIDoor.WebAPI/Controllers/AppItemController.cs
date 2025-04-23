using AIDoor.WebAPI.Models.Dtos;
using AIDoor.WebAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace AIDoor.WebAPI.Controllers;

public class AppItemController : BaseController
{
    private readonly AppItemService _appItemService;

    public AppItemController(AppItemService appItemService)
    {
        _appItemService = appItemService;
    }

    [HttpGet("all")]
    public async Task<IActionResult> GetAllCategoriesWithApplications()
    {
        var categories = await _appItemService.GetApplicationCategories();
        
        return Ok(categories);
    }
} 