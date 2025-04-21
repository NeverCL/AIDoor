import FloatBtn from "@/components/FloatBtn"
import NavHeader from "@/components/NavHeader"
import { Outlet } from "@umijs/max"

export default () => {

    return (
        <>
            <div className="grid h-full gap-4">
                <NavHeader />
                <Outlet />
            </div>

            <FloatBtn />
        </>
    )
}