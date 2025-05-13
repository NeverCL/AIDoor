// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取所有活跃的Banner GET /api/banners */
export async function getBanners(options?: { [key: string]: any }) {
    return request<any>('/api/banners', {
        method: 'GET',
        ...(options || {}),
    });
}

/** 获取指定Banner GET /api/banners/${param0} */
export async function getBannerId(
    params: API.getBannerIdParams,
    options?: { [key: string]: any },
) {
    const { id: param0, ...queryParams } = params;
    return request<any>(`/api/banners/${param0}`, {
        method: 'GET',
        params: { ...queryParams },
        ...(options || {}),
    });
} 