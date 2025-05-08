using System.ComponentModel.DataAnnotations;

namespace AIDoor.WebAPI.Models.Dtos
{
    /// <summary>
    /// 私信消息DTO
    /// </summary>
    public class PrivateMessageDto
    {
        /// <summary>
        /// 消息ID
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// 发送者ID
        /// </summary>
        public int SenderId { get; set; }

        /// <summary>
        /// 发送者名称
        /// </summary>
        public string SenderName { get; set; } = string.Empty;

        /// <summary>
        /// 发送者头像
        /// </summary>
        public string SenderAvatar { get; set; } = string.Empty;

        /// <summary>
        /// 接收者ID
        /// </summary>
        public int ReceiverId { get; set; }

        /// <summary>
        /// 接收者名称
        /// </summary>
        public string ReceiverName { get; set; } = string.Empty;

        /// <summary>
        /// 接收者头像
        /// </summary>
        public string ReceiverAvatar { get; set; } = string.Empty;

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
    }

    /// <summary>
    /// 创建私信请求DTO
    /// </summary>
    public class CreatePrivateMessageDto
    {
        /// <summary>
        /// 接收者ID
        /// </summary>
        [Required(ErrorMessage = "接收者ID不能为空")]
        public int ReceiverId { get; set; }

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
        /// 对话伙伴ID
        /// </summary>
        public int? PartnerId { get; set; }

        /// <summary>
        /// 是否只查询未读消息
        /// </summary>
        public bool? Unread { get; set; }
    }

    /// <summary>
    /// 对话伙伴DTO
    /// </summary>
    public class ConversationPartnerDto
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