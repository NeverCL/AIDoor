// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 GET /api/UserContent */
export async function getUserContent(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserContentParams,
  options?: { [key: string]: any },
) {
  return request<any>('/api/UserContent', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/UserContent */
export async function postUserContent(
  body: API.UserContentCreateDto,
  options?: { [key: string]: any },
) {
  return request<any>('/api/UserContent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/UserContent/${param0} */
export async function getUserContentId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserContentIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/api/UserContent/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /api/UserContent/${param0} */
export async function deleteUserContentId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteUserContentIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/api/UserContent/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}
