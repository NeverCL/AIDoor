import { request } from '@umijs/max';

/** 获取系统消息列表 */
export async function getSystemMessages(params: {
    page?: number;
    limit?: number;
    onlyUnread?: boolean;
    type?: number;
    minPriority?: number;
}) {
    return request<API.PagedResult<API.SystemMessageDto>>('/api/SystemMessage', {
        method: 'GET',
        params,
    });
}

/** 获取未读消息数量 */
export async function getUnreadCount() {
    return request<number>('/api/SystemMessage/unread-count', {
        method: 'GET',
    });
}

/** 获取单个系统消息 */
export async function getSystemMessage(id: number) {
    return request<API.SystemMessageDto>(`/api/SystemMessage/${id}`, {
        method: 'GET',
    });
}

/** 更新消息状态 */
export async function updateMessageStatus(id: number, isRead: boolean) {
    return request<API.Result>(`/api/SystemMessage/${id}`, {
        method: 'PUT',
        data: { isRead },
    });
}

/** 批量标记消息为已读 */
export async function markAllAsRead() {
    return request<API.Result>('/api/SystemMessage/mark-all-read', {
        method: 'PUT',
    });
}

/** 删除系统消息 */
export async function deleteMessage(id: number) {
    return request<API.Result>(`/api/SystemMessage/${id}`, {
        method: 'DELETE',
    });
} 