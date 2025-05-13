// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取所有Banner GET /api/admin/banners */
export async function getAdminBanners(options?: { [key: string]: any }) {
    return request<any>('/api/admin/banners', {
        method: 'GET',
        ...(options || {}),
    });
}

/** 创建新Banner POST /api/admin/banners */
export async function postAdminBanners(body: API.BannerCreateDto, options?: { [key: string]: any }) {
    return request<any>('/api/admin/banners', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
        ...(options || {}),
    });
}

/** 获取指定Banner GET /api/admin/banners/${param0} */
export async function getAdminBannersId(
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

/** 更新Banner PUT /api/admin/banners/${param0} */
export async function putAdminBannersId(
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

/** 删除Banner DELETE /api/admin/banners/${param0} */
export async function deleteAdminBannersId(
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