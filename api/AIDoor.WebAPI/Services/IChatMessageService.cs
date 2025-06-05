using AIDoor.WebAPI.Models.Dtos;

namespace AIDoor.WebAPI.Services
{
    /// <summary>
    /// 私信服务接口
    /// </summary>
    public interface IChatMessageService
    {
        /// <summary>
        /// 用户创建私信 - 发送给开发者
        /// </summary>
        /// <param name="userId">当前用户ID</param>
        /// <param name="createDto">创建私信DTO</param>
        /// <returns></returns>
        Task<ChatMessageDto> CreateUserMessageAsync(int userId, CreatePrivateMessageDto createDto);

        /// <summary>
        /// 开发者创建私信 - 发送给用户
        /// </summary>
        /// <param name="userId">当前开发者ID</param>
        /// <param name="createDto">创建私信DTO</param>
        /// <returns></returns>
        Task<ChatMessageDto> CreatePublisherMessageAsync(int userId, PublisherCreateMessageDto createDto);

        /// <summary>
        /// 获取用户与指定开发者的私信列表
        /// </summary>
        /// <param name="userId">当前用户ID</param>
        /// <param name="queryParams">查询参数</param>
        /// <returns></returns>
        Task<(IEnumerable<ChatMessageDto> Messages, int Total)> GetUserChatMessagesAsync(int userId, PrivateMessageQueryParams queryParams);

        /// <summary>
        /// 获取开发者与指定用户的私信列表
        /// </summary>
        /// <param name="publisherId">当前开发者ID</param>
        /// <param name="queryParams">查询参数</param>
        /// <returns></returns>
        Task<(IEnumerable<ChatMessageDto> Messages, int Total)> GetPublisherChatMessagesAsync(int publisherId, PrivateMessageQueryParams queryParams);

        /// <summary>
        /// 获取用户的未读消息数量
        /// </summary>
        /// <param name="userId">用户ID</param>
        /// <returns></returns>
        Task<int> GetUserUnreadCountAsync(int userId);

        /// <summary>
        /// 获取开发者的未读消息数量
        /// </summary>
        /// <param name="publisherId">开发者ID</param>
        /// <returns></returns>
        Task<int> GetPublisherUnreadCountAsync(int publisherId);

        /// <summary>
        /// 用户标记消息为已读
        /// </summary>
        /// <param name="userId">当前用户ID</param>
        /// <param name="messageId">消息ID</param>
        /// <returns></returns>
        Task<bool> MarkUserMessageAsReadAsync(int userId, int messageId);

        /// <summary>
        /// 开发者标记消息为已读
        /// </summary>
        /// <param name="publisherId">当前开发者ID</param>
        /// <param name="messageId">消息ID</param>
        /// <returns></returns>
        Task<bool> MarkPublisherMessageAsReadAsync(int publisherId, int messageId);

        /// <summary>
        /// 用户标记与特定开发者的所有消息为已读
        /// </summary>
        /// <param name="userId">当前用户ID</param>
        /// <param name="publisherId">开发者ID</param>
        /// <returns></returns>
        Task<int> MarkAllUserMessagesAsReadAsync(int userId, int publisherId);

        /// <summary>
        /// 开发者标记与特定用户的所有消息为已读
        /// </summary>
        /// <param name="userPublisherId">当前开发者ID</param>
        /// <param name="userId">用户ID</param>
        /// <returns></returns>
        Task<int> MarkAllPublisherMessagesAsReadAsync(int userPublisherId, int userId);

        /// <summary>
        /// 获取用户的对话开发者列表
        /// </summary>
        /// <param name="userId">当前用户ID</param>
        /// <returns></returns>
        Task<IEnumerable<ConversationPublisherDto>> GetUserConversationPublishersAsync(int userId);

        /// <summary>
        /// 获取开发者的对话用户列表
        /// </summary>
        /// <param name="userId">当前开发者ID</param>
        /// <returns></returns>
        Task<IEnumerable<ConversationUserDto>> GetPublisherConversationUsersAsync(int userId);

        /// <summary>
        /// 删除消息
        /// </summary>
        /// <param name="messageId">消息ID</param>
        /// <param name="isUser">是否是用户删除</param>
        /// <param name="currentId">当前操作者ID（用户ID或开发者ID）</param>
        /// <returns></returns>
        Task<bool> DeleteMessageAsync(int messageId, bool isUser, int currentId);
    }
}