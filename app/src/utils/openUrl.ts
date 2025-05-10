import api from '@/services/api';

interface AppInfo {
    id: number;
    title: string;
    imageUrl?: string;
    link: string;
}

export default (url: string, appInfo?: AppInfo) => {
    // 如果提供了应用信息，记录访问
    if (appInfo && appInfo.id) {
        // 异步记录应用访问，不等待结果
        api.userRecord.postUserRecord({
            recordType: 1,
            title: appInfo.title,
            imageUrl: appInfo.imageUrl,
            targetId: appInfo.id,
            targetType: 'App',
        }).catch(error => {
            console.error('记录应用访问失败:', error);
        });
    }

    if (url.indexOf('://') === -1) {
        url = 'https://' + url;
    }

    // 在本地浏览器中打开
    if (typeof plus === 'undefined') {
        location.assign(url);
        return;
    }

    // 在 App 中使用 WebView 打开
    const wv = plus.webview.create(url, 'externalPage', {
        bounce: 'vertical',
        top: '0px',
        bottom: '0px'
    });

    // 可选：页面加载后注入 onAppBack 回调（外部页面必须定义这个函数）
    wv.addEventListener('loaded', () => {
        wv.evalJS(`
            plus.key.addEventListener('backbutton', function () {
                var ws = plus.webview.currentWebview();
                plus.webview.close(ws);
            });
      `);
    });

    // 显示页面
    wv.show('slide-in-right', 300);
};
