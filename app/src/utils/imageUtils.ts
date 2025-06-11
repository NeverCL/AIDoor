import { remToPx } from './remToPx';

/**
 * 图像处理工具函数集合
 */

// 默认头像图片
const DEFAULT_AVATAR = require('@/assets/my/icon.png');

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

const videoExt = ['.mp4', '.mov'];

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
    const compressParams = noCompress ? '' : `${hasParams ? '&' : '?'}x-oss-process=image/resize,w_${pxWidth},m_lfit`;

    if (url.includes('http')) {
        return url + compressParams;
    }
    return 'https://cdn.thedoorofai.com/' + url + compressParams;
}

/**
 * 获取CDN图片完整URL
 * @param filename 图片文件名
 * @param remWidth 显示宽度rem值
 * @param quality 图片质量
 * @returns 完整的CDN URL
 */
export function getCdnImageUrl(
    filename?: string,
    remWidth: number = IMAGE_SIZES.CONTENT_SMALL,
    quality: number = 85
): string {
    if (!filename) return DEFAULT_AVATAR;

    const baseUrl = `https://cdn.thedoorofai.com/${filename}`;
    return getImageUrl(baseUrl, remWidth, DEFAULT_AVATAR, quality);
}

/**
 * 处理用户头像URL
 * @param avatarUrl 用户头像URL
 * @param size 头像尺寸类型
 * @returns 优化后的头像URL
 */
export function getAvatarUrl(
    avatarUrl?: string,
    size: number = IMAGE_SIZES.AVATAR_MEDIUM
): string {
    return getImageUrl(avatarUrl, size, DEFAULT_AVATAR, 90);
}

/**
 * 为图片添加加载失败的容错处理
 * @param event 图片加载错误事件
 */
export function handleImageError(event: React.SyntheticEvent<HTMLImageElement>) {
    const target = event.target as HTMLImageElement;
    target.onerror = null; // 防止循环触发错误
    target.src = DEFAULT_AVATAR;
} 