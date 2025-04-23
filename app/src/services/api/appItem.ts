// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 GET /api/AppItem/all */
export async function getAppItemAll(options?: { [key: string]: any }) {
  return request<any>('/api/AppItem/all', {
    method: 'GET',
    ...(options || {}),
  });
}
