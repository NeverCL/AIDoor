using AIDoor.WebAPI.Models.Dtos;
using AIDoor.WebAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AIDoor.WebAPI.Controllers;

/// <summary>
/// 开发者申请控制器
/// </summary>
[Authorize]
public class DeveloperApplicationController : BaseController
{
    private readonly DeveloperApplicationService _applicationService;

    public DeveloperApplicationController(DeveloperApplicationService applicationService)
    {
        _applicationService = applicationService;
    }

    /// <summary>
    /// 提交开发者申请
    /// </summary>
    /// <param name="dto">申请数据</param>
    /// <returns>提交结果</returns>
    [HttpPost]
    public async Task<IActionResult> SubmitApplication([FromBody] DeveloperApplicationCreateDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest("请提供有效的申请信息");
        }

        var result = await _applicationService.SubmitApplicationAsync(dto);
        if (!result.Success)
        {
            return BadRequest(result.Message);
        }

        return Ok(new { message = result.Message });
    }

    /// <summary>
    /// 获取当前用户的申请状态
    /// </summary>
    /// <returns>申请状态</returns>
    [HttpGet("status")]
    public async Task<IActionResult> GetApplicationStatus()
    {
        var status = await _applicationService.GetApplicationStatusAsync();
        return Ok(status);
    }

    /// <summary>
    /// 获取申请详情
    /// </summary>
    /// <param name="id">申请ID</param>
    /// <returns>申请详情</returns>
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetApplication(int id)
    {
        var application = await _applicationService.GetApplicationByIdAsync(id);
        if (application == null)
        {
            return NotFound("未找到指定申请");
        }

        return Ok(application);
    }
}