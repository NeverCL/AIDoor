import { Outlet } from "@umijs/max"
import { SafeArea } from "antd-mobile"
import { useEffect, useState } from "react"

export default () => {
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);

    useEffect(() => {
        const handleResize = () => setWindowHeight(window.visualViewport?.height ?? window.innerHeight);

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        document.addEventListener('plusready', function () {
            plus.key.addEventListener('backbutton', function () {
                if (window.history.length > 1) {
                    window.history.back();
                } else {
                    // 如果没有历史记录，可以选择退出应用或其他处理
                    plus.runtime.quit();
                }
            });
        });
    }, []);

    // const { pathname } = useLocation();

    // const routes = useSelectedRoutes();

    //const isBgGray = bgGrays.includes(routes.at(-1)?.pathnameBase ?? '');

    return (
        <>
            <div className="bg-[#2d2d2d] text-primary px-4" style={{ height: windowHeight }}>
                <Outlet />
            </div>
        </>
    )
}