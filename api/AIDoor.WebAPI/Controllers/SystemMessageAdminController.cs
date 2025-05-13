using AIDoor.WebAPI.Domain;
using AIDoor.WebAPI.Models.Dtos;
using AIDoor.WebAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AIDoor.WebAPI.Controllers;

[Authorize(Roles = "admin")]
[Route("api/admin/system-messages")]
public class SystemMessageAdminController : BaseController
{
    private readonly SystemMessageService _messageService;

    public SystemMessageAdminController(SystemMessageService messageService)
    {
        _messageService = messageService;
    }

    /// <summary>
    /// 获取所有系统消息（管理员视图）
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAllMessages([FromQuery] SystemMessageQueryParams queryParams)
    {
        var (messages, totalCount) = await _messageService.GetMessagesAsync(queryParams);

        return Ok("获取系统消息列表成功", new
        {
            messages,
            totalCount,
            currentPage = queryParams.Page,
            pageSize = queryParams.Limit,
            totalPages = (int)Math.Ceiling(totalCount / (double)queryParams.Limit)
        });
    }

    /// <summary>
    /// 获取单个系统消息
    /// </summary>
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetMessageById(int id)
    {
        var message = await _messageService.GetMessageByIdAsync(id);
        if (message == null)
        {
            return NotFound("未找到指定消息");
        }

        return Ok("获取系统消息成功", message);
    }

    /// <summary>
    /// 创建系统消息
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> CreateMessage([FromBody] SystemMessageCreateDto messageDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest("请提供有效的消息信息");
        }

        var result = await _messageService.CreateMessageAsync(messageDto);
        if (!result.Success)
        {
            return BadRequest(result.Message);
        }

        return CreatedAtAction(nameof(GetMessageById), new { id = result.MessageId },
            new { message = result.Message, messageId = result.MessageId });
    }

    /// <summary>
    /// 更新消息状态
    /// </summary>
    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateMessageStatus(int id, [FromBody] SystemMessageUpdateDto updateDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest("请提供有效的状态信息");
        }

        var result = await _messageService.UpdateMessageStatusAsync(id, updateDto);
        if (!result.Success)
        {
            return BadRequest(result.Message);
        }

        return Ok(result.Message);
    }

    /// <summary>
    /// 删除系统消息
    /// </summary>
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteMessage(int id)
    {
        var result = await _messageService.DeleteMessageAsync(id);
        if (!result.Success)
        {
            return BadRequest(result.Message);
        }

        return Ok(result.Message);
    }
}