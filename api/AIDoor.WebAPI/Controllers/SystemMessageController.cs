using AIDoor.WebAPI.Domain;
using AIDoor.WebAPI.Models.Dtos;
using AIDoor.WebAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AIDoor.WebAPI.Controllers;

[Authorize]
public class SystemMessageController : BaseController
{
    private readonly SystemMessageService _messageService;

    public SystemMessageController(SystemMessageService messageService)
    {
        _messageService = messageService;
    }

    /// <summary>
    /// 获取系统消息列表
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetMessages([FromQuery] SystemMessageQueryParams queryParams)
    {
        var (messages, totalCount) = await _messageService.GetMessagesAsync(queryParams);

        return Ok(new
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
    public async Task<IActionResult> GetMessage(int id)
    {
        var message = await _messageService.GetMessageByIdAsync(id);
        if (message == null)
        {
            return NotFound("未找到指定消息");
        }

        return Ok(message);
    }

    /// <summary>
    /// 获取未读消息数量
    /// </summary>
    [HttpGet("unread-count")]
    public async Task<IActionResult> GetUnreadCount()
    {
        var count = await _messageService.GetUnreadCountAsync();
        return Ok(count);
    }

    /// <summary>
    /// 创建系统消息（需要管理员权限）
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "Admin")]
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

        return Ok(result.Message, new { messageId = result.MessageId });
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
    /// 批量标记为已读
    /// </summary>
    [HttpPut("mark-all-read")]
    public async Task<IActionResult> MarkAllAsRead()
    {
        var result = await _messageService.MarkAllAsReadAsync();
        if (!result.Success)
        {
            return BadRequest(result.Message);
        }

        return Ok(result.Message, new { count = result.Count });
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