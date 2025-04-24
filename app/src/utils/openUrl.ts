export default (url, id = 'externalPage') => {

    if (!plus) {
        location.assign(url);
        return;
    }

    const wv = plus.webview.create(url, id, {
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
