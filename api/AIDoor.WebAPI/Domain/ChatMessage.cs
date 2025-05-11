using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using AIDoor.WebAPI.Models;

namespace AIDoor.WebAPI.Domain
{
    /// <summary>
    /// 私信消息实体 - 仅支持用户与发布者之间的消息
    /// </summary>
    public class ChatMessage : BaseEntity
    {
        /// <summary>
        /// 用户ID
        /// </summary>
        public int UserId { get; set; }

        /// <summary>
        /// 用户外键关系
        /// </summary>
        [ForeignKey("UserId")]
        public User User { get; set; } = null!;

        /// <summary>
        /// 发布者ID
        /// </summary>
        public int PublisherId { get; set; }

        /// <summary>
        /// 发布者外键关系
        /// </summary>
        [ForeignKey("PublisherId")]
        public Publisher Publisher { get; set; } = null!;

        /// <summary>
        /// 消息内容
        /// </summary>
        [Required]
        [MaxLength(1000)]
        public string Content { get; set; } = string.Empty;

        /// <summary>
        /// 是否已读
        /// </summary>
        public bool IsRead { get; set; } = false;

        /// <summary>
        /// 阅读时间
        /// </summary>
        public DateTime? ReadAt { get; set; }

        /// <summary>
        /// 发送者类型 - 用户发送 or 发布者发送
        /// </summary>
        public MessageSenderType SenderType { get; set; }
    }

    /// <summary>
    /// 消息发送者类型
    /// </summary>
    public enum MessageSenderType
    {
        /// <summary>
        /// 用户发送
        /// </summary>
        User = 0,

        /// <summary>
        /// 发布者发送
        /// </summary>
        Publisher = 1
    }
}