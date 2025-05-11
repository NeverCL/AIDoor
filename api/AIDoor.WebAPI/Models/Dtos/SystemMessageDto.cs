using System;
using System.ComponentModel.DataAnnotations;
using AIDoor.WebAPI.Domain;

namespace AIDoor.WebAPI.Models.Dtos
{
    /// <summary>
    /// 系统消息DTO
    /// </summary>
    public class SystemMessageDto
    {
        /// <summary>
        /// ID
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// 消息标题
        /// </summary>
        public string Title { get; set; } = string.Empty;

        /// <summary>
        /// 消息内容
        /// </summary>
        public string Content { get; set; } = string.Empty;

        /// <summary>
        /// 消息类型
        /// </summary>
        public MessageType Type { get; set; }

        /// <summary>
        /// 消息类型（字符串形式）
        /// </summary>
        public string TypeString => Type.ToString();

        /// <summary>
        /// 是否已读
        /// </summary>
        public bool IsRead { get; set; }

        /// <summary>
        /// 阅读时间
        /// </summary>
        public DateTime? ReadAt { get; set; }

        /// <summary>
        /// 过期时间
        /// </summary>
        public DateTime? ExpireAt { get; set; }

        /// <summary>
        /// 消息优先级
        /// </summary>
        public MessagePriority Priority { get; set; }

        /// <summary>
        /// 优先级（字符串形式）
        /// </summary>
        public string PriorityString => Priority.ToString();

        /// <summary>
        /// 创建时间
        /// </summary>
        public DateTime CreatedAt { get; set; }
    }

    /// <summary>
    /// 系统消息创建DTO
    /// </summary>
    public class SystemMessageCreateDto
    {
        /// <summary>
        /// 消息标题
        /// </summary>
        [Required(ErrorMessage = "标题不能为空")]
        [StringLength(100, ErrorMessage = "标题长度不能超过100个字符")]
        public string Title { get; set; } = string.Empty;

        /// <summary>
        /// 消息内容
        /// </summary>
        [Required(ErrorMessage = "内容不能为空")]
        public string Content { get; set; } = string.Empty;

        /// <summary>
        /// 消息类型
        /// </summary>
        public MessageType Type { get; set; } = MessageType.Notification;

        /// <summary>
        /// 接收者用户ID，null表示发送给所有用户
        /// </summary>
        public int? RecipientId { get; set; }

        /// <summary>
        /// 过期时间，null表示永不过期
        /// </summary>
        public DateTime? ExpireAt { get; set; }

        /// <summary>
        /// 消息优先级
        /// </summary>
        public MessagePriority Priority { get; set; } = MessagePriority.Normal;
    }

    /// <summary>
    /// 系统消息查询参数
    /// </summary>
    public class SystemMessageQueryParams
    {
        /// <summary>
        /// 页码，默认为1
        /// </summary>
        public int Page { get; set; } = 1;

        /// <summary>
        /// 每页数量，默认为10
        /// </summary>
        public int Limit { get; set; } = 10;

        /// <summary>
        /// 是否只显示未读消息
        /// </summary>
        public bool? OnlyUnread { get; set; }

        /// <summary>
        /// 消息类型
        /// </summary>
        public MessageType? Type { get; set; }

        /// <summary>
        /// 最小优先级
        /// </summary>
        public MessagePriority? MinPriority { get; set; }
    }

    /// <summary>
    /// 更新消息状态DTO
    /// </summary>
    public class SystemMessageUpdateDto
    {
        /// <summary>
        /// 是否已读
        /// </summary>
        public bool IsRead { get; set; }
    }
}