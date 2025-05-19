// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 GET /api/Account */
export async function getAccount(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAccountParams,
  options?: { [key: string]: any },
) {
  return request<API.AccountListResponse>('/api/Account', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/Account */
export async function postAccount(
  body: API.AccountCreateRequest,
  options?: { [key: string]: any },
) {
  return request<API.AccountInfoResponse>('/api/Account', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/Account/${param0} */
export async function getAccountId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAccountIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.AccountInfoResponse>(`/api/Account/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PUT /api/Account/${param0} */
export async function putAccountId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.putAccountIdParams,
  body: API.AccountUpdateRequest,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<API.AccountInfoResponse>(`/api/Account/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /api/Account/${param0} */
export async function deleteAccountId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteAccountIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/api/Account/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/Account/currentUser */
export async function getAccountCurrentUser(options?: { [key: string]: any }) {
  return request<any>('/api/Account/currentUser', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/Account/login */
export async function postAccountLogin(
  body: API.LoginInput,
  options?: { [key: string]: any },
) {
  return request<API.LoginResponse>('/api/Account/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/Account/logout */
export async function postAccountLogout(options?: { [key: string]: any }) {
  return request<any>('/api/Account/logout', {
    method: 'POST',
    ...(options || {}),
  });
}
