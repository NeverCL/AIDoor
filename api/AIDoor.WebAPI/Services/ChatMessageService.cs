using AIDoor.WebAPI.Data;
using AIDoor.WebAPI.Domain;
using AIDoor.WebAPI.Models.Dtos;
using Microsoft.EntityFrameworkCore;

namespace AIDoor.WebAPI.Services
{
    /// <summary>
    /// 私信服务
    /// </summary>
    public class ChatMessageService : IChatMessageService
    {
        private readonly AppDbContext _dbContext;

        /// <summary>
        /// 构造函数
        /// </summary>
        /// <param name="dbContext"></param>
        public ChatMessageService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        /// <summary>
        /// 创建私信
        /// </summary>
        /// <param name="userId">当前用户ID</param>
        /// <param name="createDto">创建私信DTO</param>
        /// <returns></returns>
        public async Task<ChatMessageDto> CreateChatMessageAsync(int userId, CreatePrivateMessageDto createDto)
        {
            var receiver = await _dbContext.Users.FindAsync(createDto.ReceiverId);
            if (receiver == null)
            {
                throw new ArgumentException("接收者不存在");
            }

            var message = new ChatMessage
            {
                SenderId = userId,
                ReceiverId = createDto.ReceiverId,
                Content = createDto.Content,
                IsRead = false,
                CreatedAt = DateTime.Now
            };

            await _dbContext.ChatMessages.AddAsync(message);
            await _dbContext.SaveChangesAsync();

            var sender = await _dbContext.Users.FindAsync(userId);

            return new ChatMessageDto
            {
                Id = message.Id,
                SenderId = message.SenderId,
                SenderName = sender?.Username ?? "未知用户",
                SenderAvatar = sender?.AvatarUrl ?? string.Empty,
                ReceiverId = message.ReceiverId,
                ReceiverName = receiver.Username,
                ReceiverAvatar = receiver.AvatarUrl ?? string.Empty,
                Content = message.Content,
                IsRead = message.IsRead,
                CreatedAt = message.CreatedAt,
                ReadAt = message.ReadAt
            };
        }

        /// <summary>
        /// 获取用户的私信列表
        /// </summary>
        /// <param name="userId">当前用户ID</param>
        /// <param name="queryParams">查询参数</param>
        /// <returns></returns>
        public async Task<(IEnumerable<ChatMessageDto> Messages, int Total)> GetUserChatMessagesAsync(int userId, PrivateMessageQueryParams queryParams)
        {
            var query = _dbContext.ChatMessages
                .Include(pm => pm.Sender)
                .Include(pm => pm.Receiver)
                .Where(pm => pm.SenderId == userId || pm.ReceiverId == userId);

            if (queryParams.PartnerId.HasValue)
            {
                var partnerId = queryParams.PartnerId.Value;
                query = query.Where(pm =>
                    (pm.SenderId == userId && pm.ReceiverId == partnerId) ||
                    (pm.SenderId == partnerId && pm.ReceiverId == userId));
            }

            if (queryParams.Unread == true)
            {
                query = query.Where(pm => !pm.IsRead && pm.ReceiverId == userId);
            }

            var total = await query.CountAsync();

            var skip = (queryParams.Page - 1) * queryParams.Limit;
            var messages = await query
                .OrderByDescending(pm => pm.CreatedAt)
                .Skip(skip)
                .Take(queryParams.Limit)
                .Select(pm => new ChatMessageDto
                {
                    Id = pm.Id,
                    SenderId = pm.SenderId,
                    SenderName = pm.Sender.Username,
                    SenderAvatar = pm.Sender.AvatarUrl ?? string.Empty,
                    ReceiverId = pm.ReceiverId,
                    ReceiverName = pm.Receiver.Username,
                    ReceiverAvatar = pm.Receiver.AvatarUrl ?? string.Empty,
                    Content = pm.Content,
                    IsRead = pm.IsRead,
                    CreatedAt = pm.CreatedAt,
                    ReadAt = pm.ReadAt
                })
                .ToListAsync();

            return (messages, total);
        }

        /// <summary>
        /// 获取未读消息数量
        /// </summary>
        /// <param name="userId">用户ID</param>
        /// <returns></returns>
        public async Task<int> GetUnreadCountAsync(int userId)
        {
            return await _dbContext.ChatMessages
                .CountAsync(pm => pm.ReceiverId == userId && !pm.IsRead);
        }

        /// <summary>
        /// 标记消息为已读
        /// </summary>
        /// <param name="userId">当前用户ID</param>
        /// <param name="messageId">消息ID</param>
        /// <returns></returns>
        public async Task<bool> MarkAsReadAsync(int userId, int messageId)
        {
            var message = await _dbContext.ChatMessages
                .FirstOrDefaultAsync(pm => pm.Id == messageId && pm.ReceiverId == userId);

            if (message == null)
            {
                return false;
            }

            if (!message.IsRead)
            {
                message.IsRead = true;
                message.ReadAt = DateTime.Now;
                await _dbContext.SaveChangesAsync();
            }

            return true;
        }

        /// <summary>
        /// 标记与特定用户的所有消息为已读
        /// </summary>
        /// <param name="userId">当前用户ID</param>
        /// <param name="partnerId">对话伙伴ID</param>
        /// <returns></returns>
        public async Task<int> MarkAllAsReadAsync(int userId, int partnerId)
        {
            var unreadMessages = await _dbContext.ChatMessages
                .Where(pm => pm.ReceiverId == userId && pm.SenderId == partnerId && !pm.IsRead)
                .ToListAsync();

            if (!unreadMessages.Any())
            {
                return 0;
            }

            var now = DateTime.Now;
            foreach (var message in unreadMessages)
            {
                message.IsRead = true;
                message.ReadAt = now;
            }

            await _dbContext.SaveChangesAsync();
            return unreadMessages.Count;
        }

        /// <summary>
        /// 获取用户的对话伙伴列表
        /// </summary>
        /// <param name="userId">当前用户ID</param>
        /// <returns></returns>
        public async Task<IEnumerable<ConversationPartnerDto>> GetConversationPartnersAsync(int userId)
        {
            // 获取与用户相关的所有私信
            var messages = await _dbContext.ChatMessages
                .Include(pm => pm.Sender)
                .Include(pm => pm.Receiver)
                .Where(pm => pm.SenderId == userId || pm.ReceiverId == userId)
                .OrderByDescending(pm => pm.CreatedAt)
                .ToListAsync();

            // 按对话伙伴分组
            var partnerGroups = messages
                .GroupBy(pm => pm.SenderId == userId ? pm.ReceiverId : pm.SenderId)
                .Select(g =>
                {
                    var partnerId = g.Key;
                    var lastMessage = g.First(); // 已经按时间排序，第一个是最新的
                    var partner = lastMessage.SenderId == partnerId
                        ? lastMessage.Sender
                        : lastMessage.Receiver;

                    return new ConversationPartnerDto
                    {
                        UserId = partnerId,
                        Username = partner.Username,
                        AvatarUrl = partner.AvatarUrl ?? string.Empty,
                        LastMessage = lastMessage.Content,
                        LastMessageTime = lastMessage.CreatedAt,
                        UnreadCount = g.Count(m => m.ReceiverId == userId && !m.IsRead)
                    };
                })
                .OrderByDescending(p => p.LastMessageTime)
                .ToList();

            return partnerGroups;
        }

        /// <summary>
        /// 删除消息
        /// </summary>
        /// <param name="userId">当前用户ID</param>
        /// <param name="messageId">消息ID</param>
        /// <returns></returns>
        public async Task<bool> DeleteMessageAsync(int userId, int messageId)
        {
            var message = await _dbContext.ChatMessages
                .FirstOrDefaultAsync(pm => pm.Id == messageId && (pm.SenderId == userId || pm.ReceiverId == userId));

            if (message == null)
            {
                return false;
            }

            _dbContext.ChatMessages.Remove(message);
            await _dbContext.SaveChangesAsync();
            return true;
        }
    }
}