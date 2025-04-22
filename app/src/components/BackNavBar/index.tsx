import { NavBar } from "antd-mobile"
import { history } from "@umijs/max"

export default ({ title, children }: { title: string, children: React.ReactNode }) => {
    return (
        <div className="flex flex-col h-full overflow-hidden">
            <NavBar className="-mx-4" onBack={() => history.go(-1)}>{title}</NavBar>

            {children}
        </div >
    )
}