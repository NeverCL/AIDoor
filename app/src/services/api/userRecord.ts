// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取用户记录列表 GET /api/UserRecord */
export async function getUserRecords(
    params: {
        page?: number;
        limit?: number;
        recordType?: number;
    },
    options?: { [key: string]: any },
) {
    return request<any>('/api/UserRecord', {
        method: 'GET',
        params: {
            Page: params.page,
            Limit: params.limit,
            RecordType: params.recordType,
        },
        ...(options || {}),
    });
}

/** 创建用户记录 POST /api/UserRecord */
export async function createUserRecord(
    body: {
        recordType: number;
        title: string;
        imageUrl?: string;
        targetId?: number;
        targetType?: string;
        notes?: string;
    },
    options?: { [key: string]: any },
) {
    return request<any>('/api/UserRecord', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
        ...(options || {}),
    });
}

/** 查看内容并添加足迹记录 GET /api/UserRecord/content/${param0} */
export async function viewContent(
    params: {
        id: number;
    },
    options?: { [key: string]: any },
) {
    const { id: param0, ...queryParams } = params;
    return request<any>(`/api/UserRecord/content/${param0}`, {
        method: 'GET',
        params: { ...queryParams },
        ...(options || {}),
    });
}

/** 应用访问记录 POST /api/UserRecord/app-visit */
export async function recordAppVisit(
    body: {
        appId: number;
        title: string;
        imageUrl?: string;
        link?: string;
    },
    options?: { [key: string]: any },
) {
    return request<any>('/api/UserRecord/app-visit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
        ...(options || {}),
    });
}

/** 删除用户记录 DELETE /api/UserRecord/${param0} */
export async function deleteUserRecord(
    params: {
        id: number;
    },
    options?: { [key: string]: any },
) {
    const { id: param0, ...queryParams } = params;
    return request<any>(`/api/UserRecord/${param0}`, {
        method: 'DELETE',
        params: { ...queryParams },
        ...(options || {}),
    });
}

/** 清空某类型的所有记录 DELETE /api/UserRecord/clear/${param0} */
export async function clearRecords(
    params: {
        recordType: number;
    },
    options?: { [key: string]: any },
) {
    const { recordType: param0, ...queryParams } = params;
    return request<any>(`/api/UserRecord/clear/${param0}`, {
        method: 'DELETE',
        params: { ...queryParams },
        ...(options || {}),
    });
} 