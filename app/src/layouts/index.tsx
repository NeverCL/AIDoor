import FloatBtn from "@/components/FloatBtn"
import NavHeader from "@/components/NavHeader"
import { Outlet } from "@umijs/max"

export default () => {
    return (
        <>
            <div className="flex flex-col px-4 h-[100vh] overflow-y-auto overflow-x-hidden text-secondary text-xs">
                <Outlet />
            </div>

            <FloatBtn />
        </>
    )
}