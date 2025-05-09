// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 GET /api/ChatMessage */
export async function getChatMessage(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getChatMessageParams,
  options?: { [key: string]: any },
) {
  return request<API.PagedResultOfChatMessageDto>('/api/ChatMessage', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/ChatMessage */
export async function postChatMessage(
  body: API.CreatePrivateMessageDto,
  options?: { [key: string]: any },
) {
  return request<API.ChatMessageDto>('/api/ChatMessage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /api/ChatMessage/${param0} */
export async function deleteChatMessageMessageId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteChatMessageMessageIdParams,
  options?: { [key: string]: any },
) {
  const { messageId: param0, ...queryParams } = params;
  return request<any>(`/api/ChatMessage/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PUT /api/ChatMessage/${param0}/read */
export async function putChatMessageMessageIdRead(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.putChatMessageMessageIdReadParams,
  options?: { [key: string]: any },
) {
  const { messageId: param0, ...queryParams } = params;
  return request<any>(`/api/ChatMessage/${param0}/read`, {
    method: 'PUT',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/ChatMessage/partners */
export async function getChatMessagePartners(options?: { [key: string]: any }) {
  return request<API.ConversationPartnerDto[]>('/api/ChatMessage/partners', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PUT /api/ChatMessage/read-all/${param0} */
export async function putChatMessageReadAllPartnerId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.putChatMessageReadAllPartnerIdParams,
  options?: { [key: string]: any },
) {
  const { partnerId: param0, ...queryParams } = params;
  return request<number>(`/api/ChatMessage/read-all/${param0}`, {
    method: 'PUT',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/ChatMessage/unread-count */
export async function getChatMessageUnreadCount(options?: {
  [key: string]: any;
}) {
  return request<number>('/api/ChatMessage/unread-count', {
    method: 'GET',
    ...(options || {}),
  });
}
