// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 GET /api/admin/system-messages */
export async function getAdminSystemMessages(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAdminSystemMessagesParams,
  options?: { [key: string]: any },
) {
  return request<any>('/api/admin/system-messages', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/admin/system-messages */
export async function postAdminSystemMessages(
  body: API.SystemMessageCreateDto,
  options?: { [key: string]: any },
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

/** 此处后端没有提供注释 GET /api/admin/system-messages/${param0} */
export async function getAdminSystemMessagesId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAdminSystemMessagesIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/api/admin/system-messages/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PUT /api/admin/system-messages/${param0} */
export async function putAdminSystemMessagesId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.putAdminSystemMessagesIdParams,
  body: API.SystemMessageUpdateDto,
  options?: { [key: string]: any },
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

/** 此处后端没有提供注释 DELETE /api/admin/system-messages/${param0} */
export async function deleteAdminSystemMessagesId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteAdminSystemMessagesIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/api/admin/system-messages/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}
