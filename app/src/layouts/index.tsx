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

    // const { pathname } = useLocation();

    // const routes = useSelectedRoutes();

    //const isBgGray = bgGrays.includes(routes.at(-1)?.pathnameBase ?? '');

    return (
        <>
            <div className="bg-[#2d2d2d] px-4" style={{ height: windowHeight }}>
                <Outlet />
            </div>
        </>
    )
}