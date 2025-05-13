// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 GET /api/AppItem/${param0} */
export async function getAppItemId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAppItemIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/api/AppItem/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/AppItem/all */
export async function getAppItemAll(options?: { [key: string]: any }) {
  return request<any>('/api/AppItem/all', {
    method: 'GET',
    ...(options || {}),
  });
}
