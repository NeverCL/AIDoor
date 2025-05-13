// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取所有系统消息 GET /api/admin/system-messages */
export async function getAdminSystemMessages(
    params?: API.getAdminSystemMessagesParams,
    options?: { [key: string]: any }
) {
    return request<any>('/api/admin/system-messages', {
        method: 'GET',
        params: {
            ...params,
        },
        ...(options || {}),
    });
}

/** 创建系统消息 POST /api/admin/system-messages */
export async function postAdminSystemMessages(
    body: API.SystemMessageAdminCreateDto,
    options?: { [key: string]: any }
) {
    return request<any>('/api/admin/system-messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
        ...(options || {}),
    });
}

/** 获取系统消息详情 GET /api/admin/system-messages/${param0} */
export async function getAdminSystemMessagesId(
    params: API.getAdminSystemMessagesIdParams,
    options?: { [key: string]: any }
) {
    const { id: param0, ...queryParams } = params;
    return request<any>(`/api/admin/system-messages/${param0}`, {
        method: 'GET',
        params: { ...queryParams },
        ...(options || {}),
    });
}

/** 更新系统消息状态 PUT /api/admin/system-messages/${param0} */
export async function putAdminSystemMessagesId(
    params: API.putAdminSystemMessagesIdParams,
    body: API.SystemMessageAdminUpdateDto,
    options?: { [key: string]: any }
) {
    const { id: param0, ...queryParams } = params;
    return request<any>(`/api/admin/system-messages/${param0}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        params: { ...queryParams },
        data: body,
        ...(options || {}),
    });
}

/** 删除系统消息 DELETE /api/admin/system-messages/${param0} */
export async function deleteAdminSystemMessagesId(
    params: API.deleteAdminSystemMessagesIdParams,
    options?: { [key: string]: any }
) {
    const { id: param0, ...queryParams } = params;
    return request<any>(`/api/admin/system-messages/${param0}`, {
        method: 'DELETE',
        params: { ...queryParams },
        ...(options || {}),
    });
} 