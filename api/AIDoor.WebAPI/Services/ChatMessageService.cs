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
        /// 用户创建私信 - 发送给发布者
        /// </summary>
        /// <param name="userId">当前用户ID</param>
        /// <param name="createDto">创建私信DTO</param>
        /// <returns></returns>
        public async Task<ChatMessageDto> CreateUserMessageAsync(int userId, CreatePrivateMessageDto createDto)
        {
            var publisher = await _dbContext.Publishers.FindAsync(createDto.PublisherId);
            if (publisher == null)
            {
                throw new ArgumentException("发布者不存在");
            }

            var user = await _dbContext.Users.FindAsync(userId);
            if (user == null)
            {
                throw new ArgumentException("用户不存在");
            }

            var message = new ChatMessage
            {
                UserId = userId,
                PublisherId = createDto.PublisherId,
                Content = createDto.Content,
                IsRead = false,
                CreatedAt = DateTime.Now,
                SenderType = MessageSenderType.User
            };

            await _dbContext.ChatMessages.AddAsync(message);
            await _dbContext.SaveChangesAsync();

            return new ChatMessageDto
            {
                Id = message.Id,
                UserId = message.UserId,
                UserName = user.Username,
                UserAvatar = user.AvatarUrl ?? string.Empty,
                PublisherId = message.PublisherId,
                PublisherName = publisher.Name,
                PublisherAvatar = publisher.AvatarUrl ?? string.Empty,
                Content = message.Content,
                IsRead = message.IsRead,
                CreatedAt = message.CreatedAt,
                ReadAt = message.ReadAt,
                SenderType = message.SenderType
            };
        }

        /// <summary>
        /// 发布者创建私信 - 发送给用户
        /// </summary>
        /// <param name="userId">当前发布者ID</param>
        /// <param name="createDto">创建私信DTO</param>
        /// <returns></returns>
        public async Task<ChatMessageDto> CreatePublisherMessageAsync(int userId, PublisherCreateMessageDto createDto)
        {
            var user = await _dbContext.Users.FindAsync(createDto.UserId);
            if (user == null)
            {
                throw new ArgumentException("用户不存在");
            }

            var publisher = await _dbContext.Publishers.FirstAsync(x=>x.UserId == userId);
            if (publisher == null)
            {
                throw new ArgumentException("发布者不存在");
            }

            var message = new ChatMessage
            {
                UserId = createDto.UserId,
                PublisherId = publisher.Id,
                Content = createDto.Content,
                IsRead = false,
                CreatedAt = DateTime.Now,
                SenderType = MessageSenderType.Publisher
            };

            await _dbContext.ChatMessages.AddAsync(message);
            await _dbContext.SaveChangesAsync();

            return new ChatMessageDto
            {
                Id = message.Id,
                UserId = message.UserId,
                UserName = user.Username,
                UserAvatar = user.AvatarUrl ?? string.Empty,
                PublisherId = message.PublisherId,
                PublisherName = publisher.Name,
                PublisherAvatar = publisher.AvatarUrl ?? string.Empty,
                Content = message.Content,
                IsRead = message.IsRead,
                CreatedAt = message.CreatedAt,
                ReadAt = message.ReadAt,
                SenderType = message.SenderType
            };
        }

        /// <summary>
        /// 获取用户与指定发布者的私信列表
        /// </summary>
        /// <param name="userId">当前用户ID</param>
        /// <param name="queryParams">查询参数</param>
        /// <returns></returns>
        public async Task<(IEnumerable<ChatMessageDto> Messages, int Total)> GetUserChatMessagesAsync(int userId, PrivateMessageQueryParams queryParams)
        {
            var query = _dbContext.ChatMessages
                .Include(pm => pm.User)
                .Include(pm => pm.Publisher)
                .Where(pm => pm.UserId == userId);

            if (queryParams.PublisherId.HasValue)
            {
                var publisherId = queryParams.PublisherId.Value;
                query = query.Where(pm => pm.PublisherId == publisherId);
            }

            if (queryParams.Unread == true)
            {
                query = query.Where(pm => !pm.IsRead && pm.SenderType == MessageSenderType.Publisher);
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
                    UserId = pm.UserId,
                    UserName = pm.User.Username,
                    UserAvatar = pm.User.AvatarUrl ?? string.Empty,
                    PublisherId = pm.PublisherId,
                    PublisherName = pm.Publisher.Name,
                    PublisherAvatar = pm.Publisher.AvatarUrl ?? string.Empty,
                    Content = pm.Content,
                    IsRead = pm.IsRead,
                    CreatedAt = pm.CreatedAt,
                    ReadAt = pm.ReadAt,
                    SenderType = pm.SenderType
                })
                .ToListAsync();

            return (messages, total);
        }

        /// <summary>
        /// 获取发布者与指定用户的私信列表
        /// </summary>
        /// <param name="publisherId">当前发布者ID</param>
        /// <param name="queryParams">查询参数</param>
        /// <returns></returns>
        public async Task<(IEnumerable<ChatMessageDto> Messages, int Total)> GetPublisherChatMessagesAsync(int publisherId, PrivateMessageQueryParams queryParams)
        {
            var query = _dbContext.ChatMessages
                .Include(pm => pm.User)
                .Include(pm => pm.Publisher)
                .Where(pm => pm.PublisherId == publisherId);

            if (queryParams.UserId.HasValue)
            {
                var userId = queryParams.UserId.Value;
                query = query.Where(pm => pm.UserId == userId);
            }

            if (queryParams.Unread == true)
            {
                query = query.Where(pm => !pm.IsRead && pm.SenderType == MessageSenderType.User);
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
                    UserId = pm.UserId,
                    UserName = pm.User.Username,
                    UserAvatar = pm.User.AvatarUrl ?? string.Empty,
                    PublisherId = pm.PublisherId,
                    PublisherName = pm.Publisher.Name,
                    PublisherAvatar = pm.Publisher.AvatarUrl ?? string.Empty,
                    Content = pm.Content,
                    IsRead = pm.IsRead,
                    CreatedAt = pm.CreatedAt,
                    ReadAt = pm.ReadAt,
                    SenderType = pm.SenderType
                })
                .ToListAsync();

            return (messages, total);
        }

        /// <summary>
        /// 获取用户的未读消息数量
        /// </summary>
        /// <param name="userId">用户ID</param>
        /// <returns></returns>
        public async Task<int> GetUserUnreadCountAsync(int userId)
        {
            return await _dbContext.ChatMessages
                .CountAsync(pm => pm.UserId == userId && !pm.IsRead && pm.SenderType == MessageSenderType.Publisher);
        }

        /// <summary>
        /// 获取发布者的未读消息数量
        /// </summary>
        /// <param name="publisherId">发布者ID</param>
        /// <returns></returns>
        public async Task<int> GetPublisherUnreadCountAsync(int publisherId)
        {
            return await _dbContext.ChatMessages
                .CountAsync(pm => pm.PublisherId == publisherId && !pm.IsRead && pm.SenderType == MessageSenderType.User);
        }

        /// <summary>
        /// 用户标记消息为已读
        /// </summary>
        /// <param name="userId">当前用户ID</param>
        /// <param name="messageId">消息ID</param>
        /// <returns></returns>
        public async Task<bool> MarkUserMessageAsReadAsync(int userId, int messageId)
        {
            var message = await _dbContext.ChatMessages
                .FirstOrDefaultAsync(pm =>
                    pm.Id == messageId &&
                    pm.UserId == userId &&
                    pm.SenderType == MessageSenderType.Publisher &&
                    !pm.IsRead);

            if (message == null)
            {
                return false;
            }

            message.IsRead = true;
            message.ReadAt = DateTime.Now;
            await _dbContext.SaveChangesAsync();

            return true;
        }

        /// <summary>
        /// 发布者标记消息为已读
        /// </summary>
        /// <param name="publisherId">当前发布者ID</param>
        /// <param name="messageId">消息ID</param>
        /// <returns></returns>
        public async Task<bool> MarkPublisherMessageAsReadAsync(int publisherId, int messageId)
        {
            var message = await _dbContext.ChatMessages
                .FirstOrDefaultAsync(pm =>
                    pm.Id == messageId &&
                    pm.PublisherId == publisherId &&
                    pm.SenderType == MessageSenderType.User &&
                    !pm.IsRead);

            if (message == null)
            {
                return false;
            }

            message.IsRead = true;
            message.ReadAt = DateTime.Now;
            await _dbContext.SaveChangesAsync();

            return true;
        }

        /// <summary>
        /// 用户标记与特定发布者的所有消息为已读
        /// </summary>
        /// <param name="userId">当前用户ID</param>
        /// <param name="publisherId">发布者ID</param>
        /// <returns></returns>
        public async Task<int> MarkAllUserMessagesAsReadAsync(int userId, int publisherId)
        {
            var unreadMessages = await _dbContext.ChatMessages
                .Where(pm =>
                    pm.UserId == userId &&
                    pm.PublisherId == publisherId &&
                    pm.SenderType == MessageSenderType.Publisher &&
                    !pm.IsRead)
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
        /// 发布者标记与特定用户的所有消息为已读
        /// </summary>
        /// <param name="userPublisherId">当前发布者ID</param>
        /// <param name="userId">用户ID</param>
        /// <returns></returns>
        public async Task<int> MarkAllPublisherMessagesAsReadAsync(int userPublisherId, int userId)
        {
            var userPub = await _dbContext.Users.FindAsync(userPublisherId);
            
            var unreadMessages = await _dbContext.ChatMessages
                .Where(pm =>
                    pm.PublisherId == userPub.PublisherId &&
                    pm.UserId == userId &&
                    pm.SenderType == MessageSenderType.User &&
                    !pm.IsRead)
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
        /// 获取用户的对话发布者列表
        /// </summary>
        /// <param name="userId">当前用户ID</param>
        /// <returns></returns>
        public async Task<IEnumerable<ConversationPublisherDto>> GetUserConversationPublishersAsync(int userId)
        {
            // 获取与用户相关的所有私信
            var messages = await _dbContext.ChatMessages
                .Include(pm => pm.Publisher)
                .Where(pm => pm.UserId == userId)
                .OrderByDescending(pm => pm.CreatedAt)
                .ToListAsync();

            // 按发布者分组
            var publisherGroups = messages
                .GroupBy(pm => pm.PublisherId)
                .Select(g =>
                {
                    var publisherId = g.Key;
                    var lastMessage = g.First(); // 已经按时间排序，第一个是最新的
                    var publisher = lastMessage.Publisher;

                    return new ConversationPublisherDto
                    {
                        PublisherId = publisherId,
                        Name = publisher.Name,
                        AvatarUrl = publisher.AvatarUrl ?? string.Empty,
                        LastMessage = lastMessage.Content,
                        LastMessageTime = lastMessage.CreatedAt,
                        UnreadCount = g.Count(m =>
                            m.SenderType == MessageSenderType.Publisher &&
                            !m.IsRead)
                    };
                })
                .OrderByDescending(p => p.LastMessageTime)
                .ToList();

            return publisherGroups;
        }

        /// <summary>
        /// 获取发布者的对话用户列表
        /// </summary>
        /// <param name="userId">当前发布者ID</param>
        /// <returns></returns>
        public async Task<IEnumerable<ConversationUserDto>> GetPublisherConversationUsersAsync(int userId)
        {
            var user = await _dbContext.Users.FirstAsync(x => x.Id == userId);
            // 获取与发布者相关的所有私信
            var messages = await _dbContext.ChatMessages
                .Include(pm => pm.User)
                .Where(pm => pm.PublisherId == user.PublisherId)
                .OrderByDescending(pm => pm.CreatedAt)
                .ToListAsync();

            // 按用户分组
            var userGroups = messages
                .GroupBy(pm => pm.UserId)
                .Select(g =>
                {
                    var userId = g.Key;
                    var lastMessage = g.First(); // 已经按时间排序，第一个是最新的
                    var user = lastMessage.User;

                    return new ConversationUserDto
                    {
                        UserId = userId,
                        Username = user.Username,
                        AvatarUrl = user.AvatarUrl ?? string.Empty,
                        LastMessage = lastMessage.Content,
                        LastMessageTime = lastMessage.CreatedAt,
                        UnreadCount = g.Count(m =>
                            m.SenderType == MessageSenderType.User &&
                            !m.IsRead)
                    };
                })
                .OrderByDescending(p => p.LastMessageTime)
                .ToList();

            return userGroups;
        }

        /// <summary>
        /// 删除消息
        /// </summary>
        /// <param name="messageId">消息ID</param>
        /// <param name="isUser">是否是用户删除</param>
        /// <param name="currentId">当前操作者ID（用户ID或发布者ID）</param>
        /// <returns></returns>
        public async Task<bool> DeleteMessageAsync(int messageId, bool isUser, int currentId)
        {
            ChatMessage? message;

            if (isUser)
            {
                // 用户删除消息
                message = await _dbContext.ChatMessages
                    .FirstOrDefaultAsync(pm => pm.Id == messageId && pm.UserId == currentId);
            }
            else
            {
                // 发布者删除消息
                message = await _dbContext.ChatMessages
                    .FirstOrDefaultAsync(pm => pm.Id == messageId && pm.PublisherId == currentId);
            }

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