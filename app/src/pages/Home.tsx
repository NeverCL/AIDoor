import FloatBtn from "@/components/FloatBtn"
import NavHeader from "@/components/NavHeader"
import { Outlet } from "@umijs/max"

export default () => {

    return (
        <>
            <div className="h-full flex flex-col *:mt-4">
                <NavHeader />
                <Outlet />
            </div>

            <FloatBtn />
        </>
    )
}