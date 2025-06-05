using System.ComponentModel.DataAnnotations;
using AIDoor.WebAPI.Domain;

namespace AIDoor.WebAPI.Models.Dtos
{
    /// <summary>
    /// 私信消息DTO
    /// </summary>
    public class ChatMessageDto
    {
        /// <summary>
        /// 消息ID
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// 用户ID
        /// </summary>
        public int UserId { get; set; }

        /// <summary>
        /// 用户名称
        /// </summary>
        public string UserName { get; set; } = string.Empty;

        /// <summary>
        /// 用户头像
        /// </summary>
        public string UserAvatar { get; set; } = string.Empty;

        /// <summary>
        /// 开发者ID
        /// </summary>
        public int PublisherId { get; set; }

        /// <summary>
        /// 开发者名称
        /// </summary>
        public string PublisherName { get; set; } = string.Empty;

        /// <summary>
        /// 开发者头像
        /// </summary>
        public string PublisherAvatar { get; set; } = string.Empty;

        /// <summary>
        /// 消息内容
        /// </summary>
        public string Content { get; set; } = string.Empty;

        /// <summary>
        /// 是否已读
        /// </summary>
        public bool IsRead { get; set; }

        /// <summary>
        /// 发送时间
        /// </summary>
        public DateTime CreatedAt { get; set; }

        /// <summary>
        /// 阅读时间
        /// </summary>
        public DateTime? ReadAt { get; set; }

        /// <summary>
        /// 发送者类型
        /// </summary>
        public MessageSenderType SenderType { get; set; }
    }

    /// <summary>
    /// 创建私信请求DTO
    /// </summary>
    public class CreatePrivateMessageDto
    {
        /// <summary>
        /// 开发者ID
        /// </summary>
        [Required(ErrorMessage = "开发者ID不能为空")]
        public int PublisherId { get; set; }

        /// <summary>
        /// 消息内容
        /// </summary>
        [Required(ErrorMessage = "消息内容不能为空")]
        [MaxLength(1000, ErrorMessage = "消息内容不能超过1000个字符")]
        public string Content { get; set; } = string.Empty;
    }

    /// <summary>
    /// 开发者创建私信请求DTO
    /// </summary>
    public class PublisherCreateMessageDto
    {
        /// <summary>
        /// 用户ID
        /// </summary>
        [Required(ErrorMessage = "用户ID不能为空")]
        public int UserId { get; set; }

        /// <summary>
        /// 消息内容
        /// </summary>
        [Required(ErrorMessage = "消息内容不能为空")]
        [MaxLength(1000, ErrorMessage = "消息内容不能超过1000个字符")]
        public string Content { get; set; } = string.Empty;
    }

    /// <summary>
    /// 私信查询参数
    /// </summary>
    public class PrivateMessageQueryParams
    {
        /// <summary>
        /// 页码
        /// </summary>
        public int Page { get; set; } = 1;

        /// <summary>
        /// 每页条数
        /// </summary>
        public int Limit { get; set; } = 20;

        /// <summary>
        /// 开发者ID - 用户查询时使用
        /// </summary>
        public int? PublisherId { get; set; }

        /// <summary>
        /// 用户ID - 开发者查询时使用
        /// </summary>
        public int? UserId { get; set; }

        /// <summary>
        /// 是否只查询未读消息
        /// </summary>
        public bool? Unread { get; set; }
    }

    /// <summary>
    /// 对话伙伴DTO - 用户视角
    /// </summary>
    public class ConversationPublisherDto
    {
        /// <summary>
        /// 开发者ID
        /// </summary>
        public int PublisherId { get; set; }

        /// <summary>
        /// 开发者名称
        /// </summary>
        public string Name { get; set; } = string.Empty;

        /// <summary>
        /// 开发者头像
        /// </summary>
        public string AvatarUrl { get; set; } = string.Empty;

        /// <summary>
        /// 最后一条消息内容
        /// </summary>
        public string LastMessage { get; set; } = string.Empty;

        /// <summary>
        /// 最后一条消息时间
        /// </summary>
        public DateTime LastMessageTime { get; set; }

        /// <summary>
        /// 未读消息数
        /// </summary>
        public int UnreadCount { get; set; }
    }

    /// <summary>
    /// 对话伙伴DTO - 开发者视角
    /// </summary>
    public class ConversationUserDto
    {
        /// <summary>
        /// 用户ID
        /// </summary>
        public int UserId { get; set; }

        /// <summary>
        /// 用户名称
        /// </summary>
        public string Username { get; set; } = string.Empty;

        /// <summary>
        /// 用户头像
        /// </summary>
        public string AvatarUrl { get; set; } = string.Empty;

        /// <summary>
        /// 最后一条消息内容
        /// </summary>
        public string LastMessage { get; set; } = string.Empty;

        /// <summary>
        /// 最后一条消息时间
        /// </summary>
        public DateTime LastMessageTime { get; set; }

        /// <summary>
        /// 未读消息数
        /// </summary>
        public int UnreadCount { get; set; }
    }
}