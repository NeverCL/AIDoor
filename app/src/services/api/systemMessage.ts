// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 GET /api/SystemMessage */
export async function getSystemMessage(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getSystemMessageParams,
  options?: { [key: string]: any },
) {
  return request<any>('/api/SystemMessage', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/SystemMessage */
export async function postSystemMessage(
  body: API.SystemMessageCreateDto,
  options?: { [key: string]: any },
) {
  return request<any>('/api/SystemMessage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/SystemMessage/${param0} */
export async function getSystemMessageId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getSystemMessageIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/api/SystemMessage/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PUT /api/SystemMessage/${param0} */
export async function putSystemMessageId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.putSystemMessageIdParams,
  body: API.SystemMessageUpdateDto,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/api/SystemMessage/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /api/SystemMessage/${param0} */
export async function deleteSystemMessageId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteSystemMessageIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/api/SystemMessage/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PUT /api/SystemMessage/mark-all-read */
export async function putSystemMessageMarkAllRead(options?: {
  [key: string]: any;
}) {
  return request<any>('/api/SystemMessage/mark-all-read', {
    method: 'PUT',
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/SystemMessage/unread-count */
export async function getSystemMessageUnreadCount(options?: {
  [key: string]: any;
}) {
  return request<any>('/api/SystemMessage/unread-count', {
    method: 'GET',
    ...(options || {}),
  });
}
