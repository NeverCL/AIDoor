using AIDoor.WebAPI.Domain;
using AIDoor.WebAPI.Models.Dtos;
using AIDoor.WebAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AIDoor.WebAPI.Controllers
{
    /// <summary>
    /// 私信控制器
    /// </summary>
    [ApiController]
    [Route("api/messages")]
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
        /// 用户发送私信给发布者
        /// </summary>
        /// <param name="createDto">创建私信DTO</param>
        /// <returns>返回创建的私信</returns>
        [HttpPost("send-to-publisher")]
        public async Task<ActionResult<ChatMessageDto>> SendToPublisher(CreatePrivateMessageDto createDto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            if (userId <= 0)
            {
                return Unauthorized();
            }

            var message = await _chatMessageService.CreateUserMessageAsync(userId, createDto);
            return Ok(message);
        }

        /// <summary>
        /// 发布者发送私信给用户
        /// </summary>
        /// <param name="createDto">创建私信DTO</param>
        /// <returns>返回创建的私信</returns>
        [HttpPost("send-to-user")]
        [Authorize(Roles = "Publisher")]
        public async Task<ActionResult<ChatMessageDto>> SendToUser(PublisherCreateMessageDto createDto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            if (userId <= 0)
            {
                return Unauthorized();
            }

            // 获取当前用户的发布者ID
            var publisherId = int.Parse(User.FindFirstValue("PublisherId")!);
            if (publisherId <= 0)
            {
                return BadRequest("当前用户不是发布者");
            }

            var message = await _chatMessageService.CreatePublisherMessageAsync(publisherId, createDto);
            return Ok(message);
        }

        /// <summary>
        /// 用户获取与发布者的私信列表
        /// </summary>
        /// <param name="queryParams">查询参数</param>
        /// <returns>返回私信分页列表</returns>
        [HttpGet("user-messages")]
        public async Task<ActionResult<PagedResult<ChatMessageDto>>> GetUserMessages([FromQuery] PrivateMessageQueryParams queryParams)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            if (userId <= 0)
            {
                return Unauthorized();
            }

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
        /// 发布者获取与用户的私信列表
        /// </summary>
        /// <param name="queryParams">查询参数</param>
        /// <returns>返回私信分页列表</returns>
        [HttpGet("publisher-messages")]
        [Authorize(Roles = "Publisher")]
        public async Task<ActionResult<PagedResult<ChatMessageDto>>> GetPublisherMessages([FromQuery] PrivateMessageQueryParams queryParams)
        {
            var publisherId = int.Parse(User.FindFirstValue("PublisherId")!);
            if (publisherId <= 0)
            {
                return BadRequest("当前用户不是发布者");
            }

            var (messages, total) = await _chatMessageService.GetPublisherChatMessagesAsync(publisherId, queryParams);

            return Ok(new PagedResult<ChatMessageDto>
            {
                Data = messages,
                Total = total,
                Page = queryParams.Page,
                Limit = queryParams.Limit
            });
        }

        /// <summary>
        /// 用户获取对话发布者列表
        /// </summary>
        /// <returns>返回对话发布者列表</returns>
        [HttpGet("user-publishers")]
        public async Task<ActionResult<IEnumerable<ConversationPublisherDto>>> GetUserPublishers()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            if (userId <= 0)
            {
                return Unauthorized();
            }

            var partners = await _chatMessageService.GetUserConversationPublishersAsync(userId);
            return Ok(partners);
        }

        /// <summary>
        /// 发布者获取对话用户列表
        /// </summary>
        /// <returns>返回对话用户列表</returns>
        [HttpGet("publisher-users")]
        [Authorize(Roles = "Publisher")]
        public async Task<ActionResult<IEnumerable<ConversationUserDto>>> GetPublisherUsers()
        {
            var publisherId = int.Parse(User.FindFirstValue("PublisherId")!);
            if (publisherId <= 0)
            {
                return BadRequest("当前用户不是发布者");
            }

            var users = await _chatMessageService.GetPublisherConversationUsersAsync(publisherId);
            return Ok(users);
        }

        /// <summary>
        /// 用户获取未读消息数量
        /// </summary>
        /// <returns>返回未读消息数量</returns>
        [HttpGet("user-unread-count")]
        public async Task<ActionResult<int>> GetUserUnreadCount()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            if (userId <= 0)
            {
                return Unauthorized();
            }

            var count = await _chatMessageService.GetUserUnreadCountAsync(userId);
            return Ok(count);
        }

        /// <summary>
        /// 发布者获取未读消息数量
        /// </summary>
        /// <returns>返回未读消息数量</returns>
        [HttpGet("publisher-unread-count")]
        [Authorize(Roles = "Publisher")]
        public async Task<ActionResult<int>> GetPublisherUnreadCount()
        {
            var publisherId = int.Parse(User.FindFirstValue("PublisherId")!);
            if (publisherId <= 0)
            {
                return BadRequest("当前用户不是发布者");
            }

            var count = await _chatMessageService.GetPublisherUnreadCountAsync(publisherId);
            return Ok(count);
        }

        /// <summary>
        /// 用户标记消息为已读
        /// </summary>
        /// <param name="messageId">消息ID</param>
        /// <returns>成功或失败</returns>
        [HttpPut("user-mark-read/{messageId}")]
        public async Task<ActionResult> UserMarkAsRead(int messageId)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            if (userId <= 0)
            {
                return Unauthorized();
            }

            var success = await _chatMessageService.MarkUserMessageAsReadAsync(userId, messageId);
            if (!success)
            {
                return NotFound("消息不存在或不属于当前用户");
            }

            return Ok();
        }

        /// <summary>
        /// 发布者标记消息为已读
        /// </summary>
        /// <param name="messageId">消息ID</param>
        /// <returns>成功或失败</returns>
        [HttpPut("publisher-mark-read/{messageId}")]
        [Authorize(Roles = "Publisher")]
        public async Task<ActionResult> PublisherMarkAsRead(int messageId)
        {
            var publisherId = int.Parse(User.FindFirstValue("PublisherId")!);
            if (publisherId <= 0)
            {
                return BadRequest("当前用户不是发布者");
            }

            var success = await _chatMessageService.MarkPublisherMessageAsReadAsync(publisherId, messageId);
            if (!success)
            {
                return NotFound("消息不存在或不属于当前发布者");
            }

            return Ok();
        }

        /// <summary>
        /// 用户标记与发布者的所有消息为已读
        /// </summary>
        /// <param name="publisherId">发布者ID</param>
        /// <returns>已读消息数量</returns>
        [HttpPut("user-mark-all-read/{publisherId}")]
        public async Task<ActionResult<int>> UserMarkAllAsRead(int publisherId)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            if (userId <= 0)
            {
                return Unauthorized();
            }

            var count = await _chatMessageService.MarkAllUserMessagesAsReadAsync(userId, publisherId);
            return Ok(count);
        }

        /// <summary>
        /// 发布者标记与用户的所有消息为已读
        /// </summary>
        /// <param name="userId">用户ID</param>
        /// <returns>已读消息数量</returns>
        [HttpPut("publisher-mark-all-read/{userId}")]
        [Authorize(Roles = "Publisher")]
        public async Task<ActionResult<int>> PublisherMarkAllAsRead(int userId)
        {
            var publisherId = int.Parse(User.FindFirstValue("PublisherId")!);
            if (publisherId <= 0)
            {
                return BadRequest("当前用户不是发布者");
            }

            var count = await _chatMessageService.MarkAllPublisherMessagesAsReadAsync(publisherId, userId);
            return Ok(count);
        }

        /// <summary>
        /// 用户删除消息
        /// </summary>
        /// <param name="messageId">消息ID</param>
        /// <returns>成功或失败</returns>
        [HttpDelete("user-delete/{messageId}")]
        public async Task<ActionResult> UserDeleteMessage(int messageId)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            if (userId <= 0)
            {
                return Unauthorized();
            }

            var success = await _chatMessageService.DeleteMessageAsync(messageId, true, userId);
            if (!success)
            {
                return NotFound("消息不存在或不属于当前用户");
            }

            return Ok();
        }

        /// <summary>
        /// 发布者删除消息
        /// </summary>
        /// <param name="messageId">消息ID</param>
        /// <returns>成功或失败</returns>
        [HttpDelete("publisher-delete/{messageId}")]
        [Authorize(Roles = "Publisher")]
        public async Task<ActionResult> PublisherDeleteMessage(int messageId)
        {
            var publisherId = int.Parse(User.FindFirstValue("PublisherId")!);
            if (publisherId <= 0)
            {
                return BadRequest("当前用户不是发布者");
            }

            var success = await _chatMessageService.DeleteMessageAsync(messageId, false, publisherId);
            if (!success)
            {
                return NotFound("消息不存在或不属于当前发布者");
            }

            return Ok();
        }
    }
}