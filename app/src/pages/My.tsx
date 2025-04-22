import FloatBtn from "@/components/FloatBtn"
import { Outlet } from "@umijs/max"

export default () => {

    return (
        <>
            <Outlet />

            <FloatBtn />
        </>
    )
}