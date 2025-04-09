import { Outlet, useLocation, useRouteData, useSelectedRoutes } from "@umijs/max"
import { SafeArea } from "antd-mobile"
import { useEffect, useState } from "react"

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

    const isBgWhite = routes.at(-1)?.pathnameBase.includes('/account');


    return (
        <>
            <div className={"flex flex-col px-4 overflow-y-auto overflow-x-hidden text-secondary text-xs " + (isBgWhite ? 'bg-white' : 'bg-[#2d2d2d]')} style={{ height: windowHeight }}>
                <SafeArea position={"top"} />
                <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                    <Outlet />
                </div>
                <SafeArea position={"bottom"} />
            </div >
        </>
    )
}