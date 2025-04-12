import { NavBar } from "antd-mobile"

export default ({ title, children }: { title: string, children: React.ReactNode }) => {
    return (
        <div className="flex flex-col h-full text-white">
            <NavBar className="relative -left-4 mt-5 w-[calc(100%+2rem)]" onBack={() => history.back()}>{title}</NavBar>
            <div className="mt-10">
                {children}
            </div>
        </div >
    )
}