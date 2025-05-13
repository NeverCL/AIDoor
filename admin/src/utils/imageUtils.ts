import { remToPx } from './remToPx';

/**
 * 图像处理工具函数集合
 */

// 默认头像图片
const DEFAULT_AVATAR = '';

// 常用图片尺寸配置（rem值）
export const IMAGE_SIZES = {
    AVATAR_SMALL: 1.5,   // 小头像，约24px (@375设计稿)
    AVATAR_MEDIUM: 2,    // 中等头像，约32px
    AVATAR_LARGE: 3.5,   // 大头像，约56px
    CARD_THUMB: 6,       // 卡片缩略图，约96px 
    LIST_ITEM: 3,        // 列表项图片，约48px
    CONTENT_SMALL: 8,    // 内容小图，约128px
    CONTENT_MEDIUM: 10,  // 内容中图，约160px
    CONTENT_LARGE: 20,   // 内容大图，约320px
};

const noCompressExt = ['ico'];

/**
 * 处理图片URL，获取优化后的URL
 * @param url 原始图片URL
 * @param remWidth 图片宽度rem值
 * @param defaultImg 默认图片URL（当传入URL为空时返回）
 * @param quality 图片质量(1-100)
 * @returns 处理后的图片URL
 */
export function getImageUrl(
    url?: string,
    noCompress: boolean = false,
    remWidth: number = IMAGE_SIZES.CONTENT_SMALL,
    defaultImg: string = DEFAULT_AVATAR,
    quality: number = 85,
): string {
    // 如果URL为空或undefined，返回默认图片
    if (!url) return defaultImg;

    // 如果URL是默认图片，直接返回
    if (url === defaultImg) return url;

    // 计算对应的像素宽度（使用2倍DPR以支持高清屏幕）
    const pxWidth = remToPx(remWidth, 2);

    // 检查URL是否已包含参数
    const hasParams = url.includes('?');

    // 检查URL是否已包含x-oss-process参数 或者 视频格式
    noCompress = noCompress || url.includes('x-oss-process') || noCompressExt.includes(url.split('.').pop() || '');

    // 构建压缩参数
    const compressParams = noCompress ? '' : `${hasParams ? '&' : '?'}x-oss-process=image/resize,w_${pxWidth},m_lfit/quality,q_${quality}`;

    if (url.includes('http')) {
        return url + compressParams;
    }
    return 'https://cdn.thedoorofai.com/' + url + compressParams;
}