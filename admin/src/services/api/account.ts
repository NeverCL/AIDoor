// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 GET /api/Account/currentUser */
export async function getAccountCurrentUser(options?: { [key: string]: any }) {
  return request<any>('/api/Account/currentUser', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/Account/login */
export async function postAccountLogin(body: API.LoginInput, options?: { [key: string]: any }) {
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

/** 获取账户列表 GET /api/Account */
export async function getAccounts(params?: {
  pageSize?: number;
  current?: number;
  username?: string;
  isActive?: boolean;
}, options?: { [key: string]: any }) {
  return request<API.AccountList>('/api/Account', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取单个账户信息 GET /api/Account/{id} */
export async function getAccount(id: number, options?: { [key: string]: any }) {
  return request<API.AccountInfo>(`/api/Account/${id}`, {
    method: 'GET',
    ...(options || {}),
  });
}

/** 创建账户 POST /api/Account */
export async function createAccount(body: API.AccountCreateRequest, options?: { [key: string]: any }) {
  return request<API.AccountInfo>('/api/Account', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 更新账户 PUT /api/Account/{id} */
export async function updateAccount(id: number, body: API.AccountUpdateRequest, options?: { [key: string]: any }) {
  return request<API.AccountInfo>(`/api/Account/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除账户 DELETE /api/Account/{id} */
export async function deleteAccount(id: number, options?: { [key: string]: any }) {
  return request<any>(`/api/Account/${id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}
