// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 GET /api/banners */
export async function getBanners(options?: { [key: string]: any }) {
  return request<any>('/api/banners', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/banners/${param0} */
export async function getBannersId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getBannersIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/api/banners/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}
