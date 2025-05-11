using AIDoor.WebAPI.Models.Dtos;

namespace AIDoor.WebAPI.Services
{
    /// <summary>
    /// 私信服务接口
    /// </summary>
    public interface IChatMessageService
    {
        /// <summary>
        /// 用户创建私信 - 发送给发布者
        /// </summary>
        /// <param name="userId">当前用户ID</param>
        /// <param name="createDto">创建私信DTO</param>
        /// <returns></returns>
        Task<ChatMessageDto> CreateUserMessageAsync(int userId, CreatePrivateMessageDto createDto);

        /// <summary>
        /// 发布者创建私信 - 发送给用户
        /// </summary>
        /// <param name="publisherId">当前发布者ID</param>
        /// <param name="createDto">创建私信DTO</param>
        /// <returns></returns>
        Task<ChatMessageDto> CreatePublisherMessageAsync(int publisherId, PublisherCreateMessageDto createDto);

        /// <summary>
        /// 获取用户与指定发布者的私信列表
        /// </summary>
        /// <param name="userId">当前用户ID</param>
        /// <param name="queryParams">查询参数</param>
        /// <returns></returns>
        Task<(IEnumerable<ChatMessageDto> Messages, int Total)> GetUserChatMessagesAsync(int userId, PrivateMessageQueryParams queryParams);

        /// <summary>
        /// 获取发布者与指定用户的私信列表
        /// </summary>
        /// <param name="publisherId">当前发布者ID</param>
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
        /// 获取发布者的未读消息数量
        /// </summary>
        /// <param name="publisherId">发布者ID</param>
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
        /// 发布者标记消息为已读
        /// </summary>
        /// <param name="publisherId">当前发布者ID</param>
        /// <param name="messageId">消息ID</param>
        /// <returns></returns>
        Task<bool> MarkPublisherMessageAsReadAsync(int publisherId, int messageId);

        /// <summary>
        /// 用户标记与特定发布者的所有消息为已读
        /// </summary>
        /// <param name="userId">当前用户ID</param>
        /// <param name="publisherId">发布者ID</param>
        /// <returns></returns>
        Task<int> MarkAllUserMessagesAsReadAsync(int userId, int publisherId);

        /// <summary>
        /// 发布者标记与特定用户的所有消息为已读
        /// </summary>
        /// <param name="publisherId">当前发布者ID</param>
        /// <param name="userId">用户ID</param>
        /// <returns></returns>
        Task<int> MarkAllPublisherMessagesAsReadAsync(int publisherId, int userId);

        /// <summary>
        /// 获取用户的对话发布者列表
        /// </summary>
        /// <param name="userId">当前用户ID</param>
        /// <returns></returns>
        Task<IEnumerable<ConversationPublisherDto>> GetUserConversationPublishersAsync(int userId);

        /// <summary>
        /// 获取发布者的对话用户列表
        /// </summary>
        /// <param name="userId">当前发布者ID</param>
        /// <returns></returns>
        Task<IEnumerable<ConversationUserDto>> GetPublisherConversationUsersAsync(int userId);

        /// <summary>
        /// 删除消息
        /// </summary>
        /// <param name="messageId">消息ID</param>
        /// <param name="isUser">是否是用户删除</param>
        /// <param name="currentId">当前操作者ID（用户ID或发布者ID）</param>
        /// <returns></returns>
        Task<bool> DeleteMessageAsync(int messageId, bool isUser, int currentId);
    }
}