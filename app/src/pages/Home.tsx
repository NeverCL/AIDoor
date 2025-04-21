import FloatBtn from "@/components/FloatBtn"
import NavHeader from "@/components/NavHeader"
import { Outlet } from "@umijs/max"

export default () => {

    return (
        <>
            <div className="grid h-full gap-4 grid-rows-[auto_auto_1fr]">
                <NavHeader />
                <Outlet />
            </div>

            <FloatBtn />
        </>
    )
}