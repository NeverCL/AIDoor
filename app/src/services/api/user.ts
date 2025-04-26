// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 POST /api/User/delete-account */
export async function postUserDeleteAccount(options?: { [key: string]: any }) {
  return request<any>('/api/User/delete-account', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/User/login */
export async function postUserLogin(
  body: API.LoginRequest,
  options?: { [key: string]: any },
) {
  return request<any>('/api/User/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/User/logout */
export async function postUserLogout(options?: { [key: string]: any }) {
  return request<any>('/api/User/logout', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/User/profile */
export async function getUserProfile(options?: { [key: string]: any }) {
  return request<any>('/api/User/profile', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PUT /api/User/profile */
export async function putUserProfile(
  body: API.UpdateProfileRequest,
  options?: { [key: string]: any },
) {
  return request<any>('/api/User/profile', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/User/random-nickname */
export async function getUserRandomNickname(options?: { [key: string]: any }) {
  return request<any>('/api/User/random-nickname', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/User/records */
export async function getUserRecords(options?: { [key: string]: any }) {
  return request<any>('/api/User/records', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/User/register */
export async function postUserRegister(
  body: API.RegisterRequest,
  options?: { [key: string]: any },
) {
  return request<any>('/api/User/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/User/send-code */
export async function postUserSendCode(
  body: API.SendCodeRequest,
  options?: { [key: string]: any },
) {
  return request<any>('/api/User/send-code', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/User/stats */
export async function getUserStats(options?: { [key: string]: any }) {
  return request<any>('/api/User/stats', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/User/switch-mode */
export async function postUserSwitchMode(options?: { [key: string]: any }) {
  return request<any>('/api/User/switch-mode', {
    method: 'POST',
    ...(options || {}),
  });
}
