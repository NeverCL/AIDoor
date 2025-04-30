// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 POST /api/DeveloperApplication */
export async function postDeveloperApplication(
  body: API.DeveloperApplicationCreateDto,
  options?: { [key: string]: any },
) {
  return request<any>('/api/DeveloperApplication', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/DeveloperApplication/${param0} */
export async function getDeveloperApplicationId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getDeveloperApplicationIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/api/DeveloperApplication/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/DeveloperApplication/status */
export async function getDeveloperApplicationStatus(options?: {
  [key: string]: any;
}) {
  return request<any>('/api/DeveloperApplication/status', {
    method: 'GET',
    ...(options || {}),
  });
}
