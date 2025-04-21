import { Outlet, useLocation, useRouteData, useSelectedRoutes } from "@umijs/max"
import { SafeArea } from "antd-mobile"
import { useEffect, useState } from "react"

const bgGrays = ['/home', '/my', '/setting'];

export default () => {
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);

    useEffect(() => {
        function handleResize() {
            setWindowHeight(window.innerHeight);
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // const { pathname } = useLocation();

    const routes = useSelectedRoutes();

    const isBgGray = true;//bgGrays.includes(routes.at(-1)?.pathnameBase ?? '');

    return (
        <>
            {/* <div className={"flex flex-col px-4 overflow-y-auto overflow-x-hidden text-xs " + (!isBgGray ? 'bg-white text-black' : 'bg-[#2d2d2d] text-secondary')} style={{ height: windowHeight }}>
                <SafeArea position={"top"} />
                <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                    <Outlet />
                </div>
                <SafeArea position={"bottom"} />
            </div > */}
            <div className="bg-[#2d2d2d] h-svh p-4 overflow-hidden">
                <Outlet />
            </div>
        </>
    )
}