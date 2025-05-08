// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 GET /api/PrivateMessage */
export async function getPrivateMessage(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getPrivateMessageParams,
  options?: { [key: string]: any },
) {
  return request<API.PagedResultOfPrivateMessageDto>('/api/PrivateMessage', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/PrivateMessage */
export async function postPrivateMessage(
  body: API.CreatePrivateMessageDto,
  options?: { [key: string]: any },
) {
  return request<API.PrivateMessageDto>('/api/PrivateMessage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /api/PrivateMessage/${param0} */
export async function deletePrivateMessageMessageId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deletePrivateMessageMessageIdParams,
  options?: { [key: string]: any },
) {
  const { messageId: param0, ...queryParams } = params;
  return request<any>(`/api/PrivateMessage/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PUT /api/PrivateMessage/${param0}/read */
export async function putPrivateMessageMessageIdRead(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.putPrivateMessageMessageIdReadParams,
  options?: { [key: string]: any },
) {
  const { messageId: param0, ...queryParams } = params;
  return request<any>(`/api/PrivateMessage/${param0}/read`, {
    method: 'PUT',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/PrivateMessage/partners */
export async function getPrivateMessagePartners(options?: {
  [key: string]: any;
}) {
  return request<API.ConversationPartnerDto[]>('/api/PrivateMessage/partners', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PUT /api/PrivateMessage/read-all/${param0} */
export async function putPrivateMessageReadAllPartnerId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.putPrivateMessageReadAllPartnerIdParams,
  options?: { [key: string]: any },
) {
  const { partnerId: param0, ...queryParams } = params;
  return request<number>(`/api/PrivateMessage/read-all/${param0}`, {
    method: 'PUT',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/PrivateMessage/unread-count */
export async function getPrivateMessageUnreadCount(options?: {
  [key: string]: any;
}) {
  return request<number>('/api/PrivateMessage/unread-count', {
    method: 'GET',
    ...(options || {}),
  });
}
