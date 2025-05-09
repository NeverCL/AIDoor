using AIDoor.WebAPI.Models.Dtos;

namespace AIDoor.WebAPI.Services
{
    /// <summary>
    /// 私信服务接口
    /// </summary>
    public interface IChatMessageService
    {
        /// <summary>
        /// 创建私信
        /// </summary>
        /// <param name="userId">当前用户ID</param>
        /// <param name="createDto">创建私信DTO</param>
        /// <returns></returns>
        Task<ChatMessageDto> CreateChatMessageAsync(int userId, CreatePrivateMessageDto createDto);

        /// <summary>
        /// 获取用户的私信列表
        /// </summary>
        /// <param name="userId">当前用户ID</param>
        /// <param name="queryParams">查询参数</param>
        /// <returns></returns>
        Task<(IEnumerable<ChatMessageDto> Messages, int Total)> GetUserChatMessagesAsync(int userId, PrivateMessageQueryParams queryParams);

        /// <summary>
        /// 获取未读消息数量
        /// </summary>
        /// <param name="userId">用户ID</param>
        /// <returns></returns>
        Task<int> GetUnreadCountAsync(int userId);

        /// <summary>
        /// 标记消息为已读
        /// </summary>
        /// <param name="userId">当前用户ID</param>
        /// <param name="messageId">消息ID</param>
        /// <returns></returns>
        Task<bool> MarkAsReadAsync(int userId, int messageId);

        /// <summary>
        /// 标记与特定用户的所有消息为已读
        /// </summary>
        /// <param name="userId">当前用户ID</param>
        /// <param name="partnerId">对话伙伴ID</param>
        /// <returns></returns>
        Task<int> MarkAllAsReadAsync(int userId, int partnerId);

        /// <summary>
        /// 获取用户的对话伙伴列表
        /// </summary>
        /// <param name="userId">当前用户ID</param>
        /// <returns></returns>
        Task<IEnumerable<ConversationPartnerDto>> GetConversationPartnersAsync(int userId);

        /// <summary>
        /// 删除消息
        /// </summary>
        /// <param name="userId">当前用户ID</param>
        /// <param name="messageId">消息ID</param>
        /// <returns></returns>
        Task<bool> DeleteMessageAsync(int userId, int messageId);
    }
}