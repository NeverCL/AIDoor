import { NavBar } from "antd-mobile"

export default ({ title, children }: { title: string, children: React.ReactNode }) => {
    return (
        <div className="flex flex-col h-full overflow-hidden">
            <NavBar className="-mx-4" onBack={() => history.back()}>{title}</NavBar>

            {children}
        </div >
    )
}