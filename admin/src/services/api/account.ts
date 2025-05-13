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
