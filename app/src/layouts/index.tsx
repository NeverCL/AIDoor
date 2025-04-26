import { Outlet, useModel, useNavigate, useSelectedRoutes } from "@umijs/max"
import { Toast } from "antd-mobile"
import { useEffect, useState } from "react"

export default () => {
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);

    useEffect(() => {
        const handleResize = () => setWindowHeight(window.visualViewport?.height ?? window.innerHeight);

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        let firstBackTime = 0;

        document.addEventListener('plusready', function () {
            plus.key.addEventListener('backbutton', function () {
                if (window.history.length > 2) {
                    window.history.back();
                } else {
                    // 如果没有历史记录，可以选择退出应用或其他处理
                    // 如果在首页
                    const now = Date.now();
                    if (now - firstBackTime < 1500) {
                        plus.runtime.quit(); // 1.5秒内第二次按，退出
                    } else {
                        plus.nativeUI.toast("再按一次退出应用");
                        firstBackTime = now;
                    }
                }
            });
        });
    }, []);


    // const { pathname } = useLocation();

    const routes = useSelectedRoutes();

    const navigate = useNavigate();

    const { user, isLoading } = useModel('global');

    if (isLoading) {
        return <LoadingUser />;
    }

    const pathname = routes.at(-1)?.pathnameBase ?? '';

    const noLoginRoutes = ['/account/login', '/account/register', '/', '/home'];

    const checkLogin = !noLoginRoutes.includes(pathname);

    if (checkLogin && !user) {
        navigate('/account/login');
    }

    return (
        <>
            <div className="bg-[#2d2d2d] text-primary px-4" style={{ height: windowHeight }}>
                <Outlet />
            </div>
        </>
    )
}


const LoadingUser = () => {

    return (
        <div className="bg-[#2d2d2d] h-screen text-primary flex justify-center items-center flex-col">
            身份验证中...
        </div>
    )
}
