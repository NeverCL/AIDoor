using AIDoor.WebAPI.Models.Dtos;
using AIDoor.WebAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AIDoor.WebAPI.Controllers;

/// <summary>
/// 评论控制器
/// </summary>
[Authorize]
public class CommentController : BaseController
{
    private readonly CommentService _commentService;

    public CommentController(CommentService commentService)
    {
        _commentService = commentService;
    }

    /// <summary>
    /// 获取评论列表
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetComments([FromQuery] CommentQueryParams queryParams)
    {
        var (comments, totalCount) = await _commentService.GetCommentsAsync(queryParams);

        return Ok(new
        {
            comments,
            totalCount,
            currentPage = queryParams.Page,
            pageSize = queryParams.Limit,
            totalPages = (int)Math.Ceiling(totalCount / (double)queryParams.Limit)
        });
    }

    /// <summary>
    /// 发表评论
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> CreateComment([FromBody] CommentCreateDto commentDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest("请提供有效的评论信息");
        }

        var result = await _commentService.CreateCommentAsync(commentDto);
        if (!result.Success)
        {
            return BadRequest(result.Message);
        }

        return Ok(result.Comment);
    }

    /// <summary>
    /// 删除评论
    /// </summary>
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteComment(int id)
    {
        var result = await _commentService.DeleteCommentAsync(id);
        if (!result.Success)
        {
            return BadRequest(result.Message);
        }

        return Ok(new { message = result.Message });
    }
}