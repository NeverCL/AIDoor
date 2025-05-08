// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 POST /api/Publisher */
export async function postPublisher(
  body: API.PublisherCreateUpdateRequest,
  options?: { [key: string]: any },
) {
  return request<any>('/api/Publisher', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/Publisher/${param0} */
export async function getPublisherId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getPublisherIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/api/Publisher/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 DELETE /api/Publisher/${param0} */
export async function deletePublisherId(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deletePublisherIdParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/api/Publisher/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/Publisher/${param0}/refresh-stats */
export async function postPublisherIdRefreshStats(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.postPublisherIdRefreshStatsParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/api/Publisher/${param0}/refresh-stats`, {
    method: 'POST',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/Publisher/${param0}/review */
export async function postPublisherIdReview(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.postPublisherIdReviewParams,
  body: API.ReviewPublisherRequest,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/api/Publisher/${param0}/review`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/Publisher/all */
export async function getPublisherAll(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getPublisherAllParams,
  options?: { [key: string]: any },
) {
  return request<any>('/api/Publisher/all', {
    method: 'GET',
    params: {
      // page has a default value: 1
      page: '1',
      // pageSize has a default value: 20
      pageSize: '20',
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/Publisher/my */
export async function getPublisherMy(options?: { [key: string]: any }) {
  return request<any>('/api/Publisher/my', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/Publisher/pending */
export async function getPublisherPending(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getPublisherPendingParams,
  options?: { [key: string]: any },
) {
  return request<any>('/api/Publisher/pending', {
    method: 'GET',
    params: {
      // page has a default value: 1
      page: '1',
      // pageSize has a default value: 20
      pageSize: '20',
      ...params,
    },
    ...(options || {}),
  });
}

/** 为发布者评分 POST /api/Publisher/${param0}/rate */
export async function postPublisherIdRate(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.postPublisherIdRateParams,
  body: API.PublisherRatingDto,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/api/Publisher/${param0}/rate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 获取当前用户对发布者的评分 GET /api/Publisher/${param0}/my-rating */
export async function getPublisherIdMyRating(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getPublisherIdMyRatingParams,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params;
  return request<any>(`/api/Publisher/${param0}/my-rating`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}
