// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 DELETE /api/messages/publisher-delete/${param0} */
export async function deleteMessagesPublisherDeleteMessageId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteMessagesPublisherDeleteMessageIdParams,
  options?: { [key: string]: any },
) {
  const { messageId: param0, ...queryParams } = params;
  return request<any>(`/api/messages/publisher-delete/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PUT /api/messages/publisher-mark-all-read/${param0} */
export async function putMessagesPublisherMarkAllReadUserId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.putMessagesPublisherMarkAllReadUserIdParams,
  options?: { [key: string]: any },
) {
  const { userId: param0, ...queryParams } = params;
  return request<number>(`/api/messages/publisher-mark-all-read/${param0}`, {
    method: 'PUT',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PUT /api/messages/publisher-mark-read/${param0} */
export async function putMessagesPublisherMarkReadMessageId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.putMessagesPublisherMarkReadMessageIdParams,
  options?: { [key: string]: any },
) {
  const { messageId: param0, ...queryParams } = params;
  return request<any>(`/api/messages/publisher-mark-read/${param0}`, {
    method: 'PUT',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/messages/publisher-messages */
export async function getMessagesPublisherMessages(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getMessagesPublisherMessagesParams,
  options?: { [key: string]: any },
) {
  return request<API.PagedResultOfChatMessageDto>('/api/messages/publisher-messages', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/messages/publisher-unread-count */
export async function getMessagesPublisherUnreadCount(options?: { [key: string]: any }) {
  return request<number>('/api/messages/publisher-unread-count', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/messages/publisher-users */
export async function getMessagesPublisherUsers(options?: { [key: string]: any }) {
  return request<API.ConversationUserDto[]>('/api/messages/publisher-users', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/messages/send-to-publisher */
export async function postMessagesSendToPublisher(
  body: API.CreatePrivateMessageDto,
  options?: { [key: string]: any },
) {
  return request<API.ChatMessageDto>('/api/messages/send-to-publisher', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/messages/send-to-user */
export async function postMessagesSendToUser(
  body: API.PublisherCreateMessageDto,
  options?: { [key: string]: any },
) {
  return request<API.ChatMessageDto>('/api/messages/send-to-user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /api/messages/user-delete/${param0} */
export async function deleteMessagesUserDeleteMessageId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteMessagesUserDeleteMessageIdParams,
  options?: { [key: string]: any },
) {
  const { messageId: param0, ...queryParams } = params;
  return request<any>(`/api/messages/user-delete/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PUT /api/messages/user-mark-all-read/${param0} */
export async function putMessagesUserMarkAllReadPublisherId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.putMessagesUserMarkAllReadPublisherIdParams,
  options?: { [key: string]: any },
) {
  const { publisherId: param0, ...queryParams } = params;
  return request<number>(`/api/messages/user-mark-all-read/${param0}`, {
    method: 'PUT',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PUT /api/messages/user-mark-read/${param0} */
export async function putMessagesUserMarkReadMessageId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.putMessagesUserMarkReadMessageIdParams,
  options?: { [key: string]: any },
) {
  const { messageId: param0, ...queryParams } = params;
  return request<any>(`/api/messages/user-mark-read/${param0}`, {
    method: 'PUT',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/messages/user-messages */
export async function getMessagesUserMessages(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getMessagesUserMessagesParams,
  options?: { [key: string]: any },
) {
  return request<API.PagedResultOfChatMessageDto>('/api/messages/user-messages', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/messages/user-publishers */
export async function getMessagesUserPublishers(options?: { [key: string]: any }) {
  return request<API.ConversationPublisherDto[]>('/api/messages/user-publishers', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/messages/user-unread-count */
export async function getMessagesUserUnreadCount(options?: { [key: string]: any }) {
  return request<number>('/api/messages/user-unread-count', {
    method: 'GET',
    ...(options || {}),
  });
}
