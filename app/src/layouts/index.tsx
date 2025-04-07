import FloatBtn from "@/components/FloatBtn"
import { Outlet } from "@umijs/max"
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

    return (
        <>

            <div className="flex flex-col px-4 overflow-y-auto overflow-x-hidden text-secondary text-xs" style={{ height: windowHeight }}>
                <SafeArea position={"top"} />
                <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                    <Outlet />
                </div>
                <SafeArea position={"bottom"} />
            </div>

            <FloatBtn />
        </>
    )
}