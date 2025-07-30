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
            recordType: 2,
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

    const wv = createWebViewWithControls(url);

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

// 全局变量存储控制栏元素，方便后续销毁
var controlBar = null;

// 创建主页面的控制按钮区域
function createControlBar() {
    // 如果控制栏已存在则先移除
    if (controlBar) {
        document.body.removeChild(controlBar);
    }

    // 创建控制栏
    controlBar = document.createElement('div');
    controlBar.id = 'webviewControlBar'; // 增加ID便于识别
    controlBar.style.position = 'fixed';
    controlBar.style.top = '0px';
    controlBar.style.left = '0px';
    controlBar.style.right = '0px';
    controlBar.style.height = '44px';
    controlBar.style.backgroundColor = '#f5f5f5';
    controlBar.style.display = 'flex';
    controlBar.style.alignItems = 'center';
    controlBar.style.justifyContent = 'space-between';
    controlBar.style.padding = '0 15px';
    controlBar.style.zIndex = '9999'; // 确保在WebView上方

    // 创建返回按钮
    // var backBtn = document.createElement('button');
    // backBtn.innerText = '返回';
    // backBtn.style.padding = '5px 10px';
    // backBtn.onclick = function () {
    //     var webview = plus.webview.getWebviewById('externalPage');
    //     if (webview && webview.canBack()) {
    //         webview.back(); // 网页后退
    //     } else if (webview) {
    //         closeWebViewAndControls(webview); // 关闭WebView及控制栏
    //     }
    // };

    // // 创建刷新按钮
    // var refreshBtn = document.createElement('button');
    // refreshBtn.innerText = '刷新';
    // refreshBtn.style.padding = '5px 10px';
    // refreshBtn.onclick = function () {
    //     var webview = plus.webview.getWebviewById('externalPage');
    //     if (webview) webview.reload(); // 刷新网页
    // };

    // 创建关闭按钮
    var closeBtn = document.createElement('button');
    closeBtn.innerText = 'X';
    closeBtn.style.padding = '5px 10px';
    closeBtn.onclick = function () {
        var webview = plus.webview.getWebviewById('externalPage');
        if (webview) closeWebViewAndControls(webview);
    };

    // 添加按钮到控制栏
    // controlBar.appendChild(backBtn);
    // controlBar.appendChild(refreshBtn);
    controlBar.appendChild(closeBtn);

    // 添加控制栏到页面
    document.body.appendChild(controlBar);
}

// 关闭WebView并销毁控制按钮
function closeWebViewAndControls(webview) {
    // 关闭WebView
    webview.close();
}

// 创建带控制按钮的WebView
function createWebViewWithControls(url) {
    // 先创建控制栏
    createControlBar();

    // 计算WebView的位置（避开控制栏）
    var webview = plus.webview.create(url, 'externalPage', {
        bounce: 'vertical',
        top: '44px', // 顶部距离设为控制栏的高度
        bottom: '0px'
    });

    // 监听WebView关闭事件（比如用户通过其他方式关闭）
    webview.addEventListener('close', function () {
        if (controlBar && document.body.contains(controlBar)) {
            document.body.removeChild(controlBar);
            controlBar = null;
        }
    }, false);

    // 显示WebView
    webview.show();

    return webview;
}