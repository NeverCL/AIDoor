// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 GET /api/admin/appitems/applications */
export async function getAdminAppitemsApplications(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params?: API.getAdminAppitemsApplicationsParams,
  options?: { [key: string]: any },
) {
  return request<any>('/api/admin/appitems/applications', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/admin/appitems/applications */
export async function postAdminAppitemsApplications(
  body: API.ApplicationCreateDto,
  options?: { [key: string]: any },
) {
  return request<any>('/api/admin/appitems/applications', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/admin/appitems/applications/${param0} */
export async function getAdminAppitemsApplicationsApplicationId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAdminAppitemsApplicationsApplicationIdParams,
  options?: { [key: string]: any },
) {
  const { applicationId: param0, ...queryParams } = params;
  return request<any>(`/api/admin/appitems/applications/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PUT /api/admin/appitems/applications/${param0} */
export async function putAdminAppitemsApplicationsApplicationId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.putAdminAppitemsApplicationsApplicationIdParams,
  body: API.ApplicationUpdateDto,
  options?: { [key: string]: any },
) {
  const { applicationId: param0, ...queryParams } = params;
  return request<any>(`/api/admin/appitems/applications/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /api/admin/appitems/applications/${param0} */
export async function deleteAdminAppitemsApplicationsApplicationId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteAdminAppitemsApplicationsApplicationIdParams,
  options?: { [key: string]: any },
) {
  const { applicationId: param0, ...queryParams } = params;
  return request<any>(`/api/admin/appitems/applications/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/admin/appitems/categories */
export async function getAdminAppitemsCategories(options?: { [key: string]: any }) {
  return request<any>('/api/admin/appitems/categories', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/admin/appitems/categories */
export async function postAdminAppitemsCategories(
  body: API.CategoryCreateDto,
  options?: { [key: string]: any },
) {
  return request<any>('/api/admin/appitems/categories', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/admin/appitems/categories/${param0} */
export async function getAdminAppitemsCategoriesCategoryId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAdminAppitemsCategoriesCategoryIdParams,
  options?: { [key: string]: any },
) {
  const { categoryId: param0, ...queryParams } = params;
  return request<any>(`/api/admin/appitems/categories/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 PUT /api/admin/appitems/categories/${param0} */
export async function putAdminAppitemsCategoriesCategoryId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.putAdminAppitemsCategoriesCategoryIdParams,
  body: API.CategoryUpdateDto,
  options?: { [key: string]: any },
) {
  const { categoryId: param0, ...queryParams } = params;
  return request<any>(`/api/admin/appitems/categories/${param0}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /api/admin/appitems/categories/${param0} */
export async function deleteAdminAppitemsCategoriesCategoryId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteAdminAppitemsCategoriesCategoryIdParams,
  options?: { [key: string]: any },
) {
  const { categoryId: param0, ...queryParams } = params;
  return request<any>(`/api/admin/appitems/categories/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}
