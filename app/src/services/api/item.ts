// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 GET /api/Item */
export async function getItem(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getItemParams,
  options?: { [key: string]: any },
) {
  return request<any>('/api/Item', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/Item */
export async function postItem(
  body: API.ItemCreateDto,
  options?: { [key: string]: any },
) {
  return request<any>('/api/Item', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/Item/${param0} */
export async function getItemId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getItemIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/api/Item/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PUT /api/Item/${param0} */
export async function putItemId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.putItemIdParams,
  body: API.ItemUpdateDto,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/api/Item/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /api/Item/${param0} */
export async function deleteItemId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteItemIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/api/Item/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}
