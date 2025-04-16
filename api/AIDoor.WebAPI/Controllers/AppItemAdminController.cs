using AIDoor.WebAPI.Models.Dtos;
using AIDoor.WebAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AIDoor.WebAPI.Controllers;

[Authorize(Roles = "Admin")]
[Route("api/admin/appitems")]
public class AppItemAdminController : BaseController
{
    private readonly ApplicationService _applicationService;

    public AppItemAdminController(ApplicationService applicationService)
    {
        _applicationService = applicationService;
    }
    
    [HttpGet("categories")]
    public async Task<IActionResult> GetAllCategories()
    {
        var categories = await _applicationService.GetApplicationCategories();
        return Ok("获取所有应用分类成功", categories);
    }
    
    [HttpGet("categories/{categoryId:int}")]
    public async Task<IActionResult> GetCategoryById(int categoryId)
    {
        var category = await _applicationService.GetCategoryById(categoryId);
        if (category == null)
        {
            return NotFound("未找到指定分类");
        }
        
        return Ok("获取分类成功", category);
    }
    
    [HttpGet("applications/{applicationId:int}")]
    public async Task<IActionResult> GetApplicationById(int applicationId)
    {
        var application = await _applicationService.GetApplicationById(applicationId);
        if (application == null)
        {
            return NotFound("未找到指定应用");
        }
        
        return Ok("获取应用成功", application);
    }
    
    // 创建分类 - 需要管理员权限
    [HttpPost("categories")]
    public async Task<IActionResult> CreateCategory([FromBody] CategoryCreateDto categoryDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest("请提供有效的分类信息");
        }
        
        var result = await _applicationService.CreateCategory(categoryDto);
        if (!result.Success)
        {
            return BadRequest(result.Message);
        }
        
        return CreatedAtAction(nameof(GetCategoryById), new { categoryId = result.CategoryId }, 
            new { message = result.Message, categoryId = result.CategoryId });
    }
    
    // 更新分类 - 需要管理员权限
    [HttpPut("categories/{categoryId:int}")]
    public async Task<IActionResult> UpdateCategory(int categoryId, [FromBody] CategoryUpdateDto categoryDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest("请提供有效的分类信息");
        }
        
        var result = await _applicationService.UpdateCategory(categoryId, categoryDto);
        if (!result.Success)
        {
            return BadRequest(result.Message);
        }
        
        return Ok(result.Message);
    }
    
    // 删除分类 - 需要管理员权限
    [HttpDelete("categories/{categoryId:int}")]
    public async Task<IActionResult> DeleteCategory(int categoryId)
    {
        var result = await _applicationService.DeleteCategory(categoryId);
        if (!result.Success)
        {
            return BadRequest(result.Message);
        }
        
        return Ok(result.Message);
    }
    
    // 创建应用 - 需要管理员权限
    [HttpPost("applications")]
    public async Task<IActionResult> CreateApplication([FromBody] ApplicationCreateDto applicationDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest("请提供有效的应用信息");
        }
        
        var result = await _applicationService.CreateApplication(applicationDto);
        if (!result.Success)
        {
            return BadRequest(result.Message);
        }
        
        return CreatedAtAction(nameof(GetApplicationById), new { applicationId = result.ApplicationId }, 
            new { message = result.Message, applicationId = result.ApplicationId });
    }
    
    // 更新应用 - 需要管理员权限
    [HttpPut("applications/{applicationId:int}")]
    public async Task<IActionResult> UpdateApplication(int applicationId, [FromBody] ApplicationUpdateDto applicationDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest("请提供有效的应用信息");
        }
        
        var result = await _applicationService.UpdateApplication(applicationId, applicationDto);
        if (!result.Success)
        {
            return BadRequest(result.Message);
        }
        
        return Ok(result.Message);
    }
    
    // 删除应用 - 需要管理员权限
    [HttpDelete("applications/{applicationId:int}")]
    public async Task<IActionResult> DeleteApplication(int applicationId)
    {
        var result = await _applicationService.DeleteApplication(applicationId);
        if (!result.Success)
        {
            return BadRequest(result.Message);
        }
        
        return Ok(result.Message);
    }
} 