import FloatBtn from "@/components/FloatBtn"
import NavHeader from "@/components/NavHeader"
import { Outlet } from "@umijs/max"

export default () => {
    return (
        <>
            <NavHeader />
            <Outlet />
        </>
    )
}