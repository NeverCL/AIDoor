// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 GET /api/UserRecord */
export async function getUserRecord(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserRecordParams,
  options?: { [key: string]: any },
) {
  return request<any>('/api/UserRecord', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/UserRecord */
export async function postUserRecord(
  body: API.UserRecordCreateDto,
  options?: { [key: string]: any },
) {
  return request<any>('/api/UserRecord', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /api/UserRecord/${param0} */
export async function deleteUserRecordId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteUserRecordIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/api/UserRecord/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/UserRecord/app-visit */
export async function postUserRecordAppVisit(
  body: API.AppVisitDto,
  options?: { [key: string]: any },
) {
  return request<any>('/api/UserRecord/app-visit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /api/UserRecord/clear-footprints */
export async function deleteUserRecordClearFootprints(options?: {
  [key: string]: any;
}) {
  return request<any>('/api/UserRecord/clear-footprints', {
    method: 'DELETE',
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /api/UserRecord/clear/${param0} */
export async function deleteUserRecordClearRecordType(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteUserRecordClearRecordTypeParams,
  options?: { [key: string]: any },
) {
  const { recordType: param0, ...queryParams } = params;
  return request<any>(`/api/UserRecord/clear/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/UserRecord/content/${param0} */
export async function getUserRecordContentId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserRecordContentIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/api/UserRecord/content/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/UserRecord/footprints */
export async function getUserRecordFootprints(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getUserRecordFootprintsParams,
  options?: { [key: string]: any },
) {
  return request<any>('/api/UserRecord/footprints', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/UserRecord/my */
export async function getUserRecordMy(options?: { [key: string]: any }) {
  return request<any>('/api/UserRecord/my', {
    method: 'GET',
    ...(options || {}),
  });
}
