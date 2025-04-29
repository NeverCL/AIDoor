/**
 * rem转px工具函数
 * 根据全局CSS中的font-size: 4.2667vw规则计算
 */

/**
 * 基于全局CSS规则，将rem值转换为像素值
 * @param remValue rem值
 * @param dpr 设备像素比，用于高清屏幕，默认为1
 * @returns 计算得到的像素值
 */
export function remToPx(remValue: number, dpr: number = 1): number {
    // 默认设计稿宽度（以iPhone 6/7/8为例）
    const designWidth = 375;

    // 获取当前设备宽度（客户端渲染时有效，服务端渲染时使用默认值）
    const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : designWidth;

    // 根据global.less中的font-size: 4.2667vw规则计算当前环境下1rem的像素值
    // 在375px的设备下, 4.2667vw = 16px
    const remUnit = viewportWidth * 0.042667;

    // 乘以设备像素比以支持高分辨率屏幕
    const pxValue = remValue * remUnit * dpr;

    // 返回整数像素值
    return Math.round(pxValue);
}

/**
 * 生成资源URL的图片尺寸优化参数
 * @param url 原始图片URL
 * @param remWidth 图片宽度的rem值
 * @param quality 图片质量(1-100)，默认为85
 * @returns 处理后的图片URL，包含尺寸和质量参数
 */
export function getOptimizedImageUrl(url: string, remWidth: number, quality: number = 85): string {
    // 如果URL为空，直接返回
    if (!url) return '';

    // 计算对应的像素宽度
    const pxWidth = remToPx(remWidth, 2); // 使用2倍DPR以适应高清屏幕

    // 检查URL是否已包含参数
    const hasParams = url.includes('?');

    // 构建压缩参数
    const compressParams = `${hasParams ? '&' : '?'}x-oss-process=image/resize,w_${pxWidth},m_lfit/quality,q_${quality}`;

    return url + compressParams;
}

/**
 * 为背景图片生成CSS样式对象
 * @param url 背景图片URL
 * @param remWidth 期望宽度的rem值
 * @param quality 图片质量，默认为85
 * @returns CSS样式对象
 */
export function getBackgroundImageStyle(url: string, remWidth: number, quality: number = 85): React.CSSProperties {
    if (!url) return {};

    const optimizedUrl = getOptimizedImageUrl(url, remWidth, quality);

    return {
        backgroundImage: `url(${optimizedUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    };
} 