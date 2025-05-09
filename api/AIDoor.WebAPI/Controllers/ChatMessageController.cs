using AIDoor.WebAPI.Domain;
using AIDoor.WebAPI.Models.Dtos;
using AIDoor.WebAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AIDoor.WebAPI.Controllers
{
    /// <summary>
    /// 私信控制器
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ChatMessageController : ControllerBase
    {
        private readonly IChatMessageService _chatMessageService;

        /// <summary>
        /// 构造函数
        /// </summary>
        /// <param name="chatMessageService">私信服务</param>
        public ChatMessageController(IChatMessageService chatMessageService)
        {
            _chatMessageService = chatMessageService;
        }

        /// <summary>
        /// 发送私信
        /// </summary>
        /// <param name="createDto">创建私信DTO</param>
        /// <returns>创建结果</returns>
        [HttpPost]
        public async Task<ActionResult<ChatMessageDto>> SendMessage(CreatePrivateMessageDto createDto)
        {
            var userId = HttpContext.GetUserId();
            try
            {
                var message = await _chatMessageService.CreateChatMessageAsync(userId, createDto);
                return Ok(message);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /// <summary>
        /// 获取私信列表
        /// </summary>
        /// <param name="queryParams">查询参数</param>
        /// <returns>私信列表</returns>
        [HttpGet]
        public async Task<ActionResult<PagedResult<ChatMessageDto>>> GetMessages([FromQuery] PrivateMessageQueryParams queryParams)
        {
            var userId = HttpContext.GetUserId();
            var (messages, total) = await _chatMessageService.GetUserChatMessagesAsync(userId, queryParams);

            return Ok(new PagedResult<ChatMessageDto>
            {
                Data = messages,
                Total = total,
                Page = queryParams.Page,
                Limit = queryParams.Limit
            });
        }

        /// <summary>
        /// 获取对话伙伴列表
        /// </summary>
        /// <returns>对话伙伴列表</returns>
        [HttpGet("partners")]
        public async Task<ActionResult<IEnumerable<ConversationPartnerDto>>> GetConversationPartners()
        {
            var userId = HttpContext.GetUserId();
            var partners = await _chatMessageService.GetConversationPartnersAsync(userId);
            return Ok(partners);
        }

        /// <summary>
        /// 获取未读消息数量
        /// </summary>
        /// <returns>未读消息数量</returns>
        [HttpGet("unread-count")]
        public async Task<ActionResult<int>> GetUnreadCount()
        {
            var userId = HttpContext.GetUserId();
            var count = await _chatMessageService.GetUnreadCountAsync(userId);
            return Ok(count);
        }

        /// <summary>
        /// 标记消息为已读
        /// </summary>
        /// <param name="messageId">消息ID</param>
        /// <returns>操作结果</returns>
        [HttpPut("{messageId}/read")]
        public async Task<ActionResult> MarkAsRead(int messageId)
        {
            var userId = HttpContext.GetUserId();
            var success = await _chatMessageService.MarkAsReadAsync(userId, messageId);
            if (!success)
            {
                return NotFound("消息不存在或您无权操作此消息");
            }
            return Ok();
        }

        /// <summary>
        /// 标记与特定用户的所有消息为已读
        /// </summary>
        /// <param name="partnerId">对话伙伴ID</param>
        /// <returns>已读消息数量</returns>
        [HttpPut("read-all/{partnerId}")]
        public async Task<ActionResult<int>> MarkAllAsRead(int partnerId)
        {
            var userId = HttpContext.GetUserId();
            var count = await _chatMessageService.MarkAllAsReadAsync(userId, partnerId);
            return Ok(count);
        }

        /// <summary>
        /// 删除消息
        /// </summary>
        /// <param name="messageId">消息ID</param>
        /// <returns>操作结果</returns>
        [HttpDelete("{messageId}")]
        public async Task<ActionResult> DeleteMessage(int messageId)
        {
            var userId = HttpContext.GetUserId();
            var success = await _chatMessageService.DeleteMessageAsync(userId, messageId);
            if (!success)
            {
                return NotFound("消息不存在或您无权删除此消息");
            }
            return Ok();
        }
    }
}