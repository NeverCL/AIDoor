using AIDoor.WebAPI.Models.Dtos;
using AIDoor.WebAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AIDoor.WebAPI.Controllers;

[Authorize]
public class UserContentController : BaseController
{
    private readonly UserContentService _contentService;

    public UserContentController(UserContentService contentService)
    {
        _contentService = contentService;
    }

    [HttpGet]
    public async Task<IActionResult> GetContents([FromQuery] UserContentQueryParams queryParams)
    {
        var (contents, totalCount) = await _contentService.GetContentsAsync(queryParams);

        return Ok(new
        {
            contents,
            totalCount,
            currentPage = queryParams.Page,
            pageSize = queryParams.Limit,
            totalPages = (int)Math.Ceiling(totalCount / (double)queryParams.Limit)
        });
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetContentById(int id)
    {
        var content = await _contentService.GetContentByIdAsync(id);
        if (content == null)
        {
            return NotFound("未找到指定内容");
        }

        return Ok(content);
    }

    [HttpPost]
    public async Task<IActionResult> CreateContent([FromBody] UserContentCreateDto contentDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest("请提供有效的内容信息");
        }

        var result = await _contentService.CreateContentAsync(contentDto);
        if (!result.Success)
        {
            return BadRequest(result.Message);
        }

        return CreatedAtAction(nameof(GetContentById), new { id = result.ContentId },
            new { message = result.Message, contentId = result.ContentId });
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteContent(int id)
    {
        var result = await _contentService.DeleteContentAsync(id);
        if (!result.Success)
        {
            return BadRequest(result.Message);
        }

        return Ok(result.Message);
    }
}