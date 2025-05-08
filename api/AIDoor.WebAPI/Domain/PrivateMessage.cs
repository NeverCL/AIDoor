using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using AIDoor.WebAPI.Models;

namespace AIDoor.WebAPI.Domain
{
    /// <summary>
    /// 私信消息实体
    /// </summary>
    public class PrivateMessage : BaseEntity
    {
        /// <summary>
        /// 发送者ID
        /// </summary>
        public int SenderId { get; set; }

        /// <summary>
        /// 发送者外键关系
        /// </summary>
        [ForeignKey("SenderId")]
        public User Sender { get; set; } = null!;

        /// <summary>
        /// 接收者ID
        /// </summary>
        public int ReceiverId { get; set; }

        /// <summary>
        /// 接收者外键关系
        /// </summary>
        [ForeignKey("ReceiverId")]
        public User Receiver { get; set; } = null!;

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
    }
}