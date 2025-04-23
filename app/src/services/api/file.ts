// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 DELETE /api/File/${param0} */
export async function deleteFileFileName(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.deleteFileFileNameParams,
  options?: { [key: string]: any },
) {
  const { fileName: param0, ...queryParams } = params;
  return request<any>(`/api/File/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/File/download/${param0} */
export async function getFileDownloadFileName(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getFileDownloadFileNameParams,
  options?: { [key: string]: any },
) {
  const { fileName: param0, ...queryParams } = params;
  return request<any>(`/api/File/download/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/File/preview/${param0} */
export async function getFilePreviewFileName(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getFilePreviewFileNameParams,
  options?: { [key: string]: any },
) {
  const { fileName: param0, ...queryParams } = params;
  return request<any>(`/api/File/preview/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/File/upload */
export async function postFileUpload(
  body: {},
  file?: File,
  options?: { [key: string]: any },
) {
  const formData = new FormData();

  if (file) {
    formData.append('file', file);
  }

  Object.keys(body).forEach((ele) => {
    const item = (body as any)[ele];

    if (item !== undefined && item !== null) {
      if (typeof item === 'object' && !(item instanceof File)) {
        if (item instanceof Array) {
          item.forEach((f) => formData.append(ele, f || ''));
        } else {
          formData.append(ele, JSON.stringify(item));
        }
      } else {
        formData.append(ele, item);
      }
    }
  });

  return request<any>('/api/File/upload', {
    method: 'POST',
    data: formData,
    requestType: 'form',
    ...(options || {}),
  });
}
