// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取内容评论列表 GET /api/Comment */
export async function getComments(
    params: {
        contentId: number;
        page?: number;
        limit?: number;
    },
    options?: { [key: string]: any },
) {
    return request<any>('/api/Comment', {
        method: 'GET',
        params: {
            ContentId: params.contentId,
            Page: params.page,
            Limit: params.limit,
        },
        ...(options || {}),
    });
}

/** 发表评论 POST /api/Comment */
export async function postComment(
    body: {
        contentId: number;
        content: string;
    },
    options?: { [key: string]: any },
) {
    return request<any>('/api/Comment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
        ...(options || {}),
    });
}

/** 删除评论 DELETE /api/Comment/${param0} */
export async function deleteComment(
    params: {
        id: number;
    },
    options?: { [key: string]: any },
) {
    const { id: param0, ...queryParams } = params;
    return request<any>(`/api/Comment/${param0}`, {
        method: 'DELETE',
        params: { ...queryParams },
        ...(options || {}),
    });
} 