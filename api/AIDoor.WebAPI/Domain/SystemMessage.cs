using System;

namespace AIDoor.WebAPI.Domain
{
    /// <summary>
    /// 系统消息实体
    /// </summary>
    public class SystemMessage : BaseEntity
    {
        /// <summary>
        /// 消息标题
        /// </summary>
        public string Title { get; set; } = string.Empty;

        /// <summary>
        /// 消息内容
        /// </summary>
        public string Content { get; set; } = string.Empty;

        /// <summary>
        /// 消息类型（通知、警告、错误等）
        /// </summary>
        public MessageType Type { get; set; } = MessageType.Notification;

        /// <summary>
        /// 接收者用户ID，null表示发送给所有用户
        /// </summary>
        public int? RecipientId { get; set; }

        /// <summary>
        /// 是否已读
        /// </summary>
        public bool IsRead { get; set; } = false;

        /// <summary>
        /// 阅读时间
        /// </summary>
        public DateTime? ReadAt { get; set; }

        /// <summary>
        /// 过期时间，null表示永不过期
        /// </summary>
        public DateTime? ExpireAt { get; set; }

        /// <summary>
        /// 消息优先级
        /// </summary>
        public MessagePriority Priority { get; set; } = MessagePriority.Normal;

        /// <summary>
        /// 接收者用户
        /// </summary>
        public virtual User? Recipient { get; set; }
    }

    /// <summary>
    /// 消息类型枚举
    /// </summary>
    public enum MessageType
    {
        /// <summary>
        /// 通知
        /// </summary>
        Notification = 0,

        /// <summary>
        /// 警告
        /// </summary>
        Warning = 1,

        /// <summary>
        /// 错误
        /// </summary>
        Error = 2,

        /// <summary>
        /// 系统
        /// </summary>
        System = 3
    }

    /// <summary>
    /// 消息优先级枚举
    /// </summary>
    public enum MessagePriority
    {
        /// <summary>
        /// 低
        /// </summary>
        Low = 0,

        /// <summary>
        /// 正常
        /// </summary>
        Normal = 1,

        /// <summary>
        /// 高
        /// </summary>
        High = 2,

        /// <summary>
        /// 紧急
        /// </summary>
        Urgent = 3
    }
}