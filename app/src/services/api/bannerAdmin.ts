// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 GET /api/admin/banners */
export async function getAdminBanners(options?: { [key: string]: any }) {
  return request<any>('/api/admin/banners', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/admin/banners */
export async function postAdminBanners(
  body: API.BannerCreateDto,
  options?: { [key: string]: any },
) {
  return request<any>('/api/admin/banners', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/admin/banners/${param0} */
export async function getAdminBannersId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAdminBannersIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/api/admin/banners/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PUT /api/admin/banners/${param0} */
export async function putAdminBannersId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.putAdminBannersIdParams,
  body: API.BannerUpdateDto,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/api/admin/banners/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /api/admin/banners/${param0} */
export async function deleteAdminBannersId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteAdminBannersIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/api/admin/banners/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}
