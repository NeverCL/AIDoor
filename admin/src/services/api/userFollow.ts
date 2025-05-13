// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 GET /api/UserFollow */
export async function getUserFollow(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserFollowParams,
  options?: { [key: string]: any },
) {
  return request<any>('/api/UserFollow', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/UserFollow */
export async function postUserFollow(
  body: API.UserFollowCreateDto,
  options?: { [key: string]: any },
) {
  return request<any>('/api/UserFollow', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /api/UserFollow/${param0} */
export async function deleteUserFollowId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteUserFollowIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/api/UserFollow/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/UserFollow/check/${param0} */
export async function getUserFollowCheckId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserFollowCheckIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/api/UserFollow/check/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}
