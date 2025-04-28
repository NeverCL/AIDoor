// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 GET /api/Comment */
export async function getComment(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getCommentParams,
  options?: { [key: string]: any },
) {
  return request<any>('/api/Comment', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/Comment */
export async function postComment(
  body: API.CommentCreateDto,
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

/** 此处后端没有提供注释 DELETE /api/Comment/${param0} */
export async function deleteCommentId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteCommentIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/api/Comment/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}
