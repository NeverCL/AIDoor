import { NavBar } from "antd-mobile"
import { useNavigate } from "@umijs/max"

export default ({ title, children }: { title: string, children: React.ReactNode }) => {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col h-full pt-4">
            <NavBar className="-mx-4" onBack={() => navigate(-1)}>{title}</NavBar>

            {children}
        </div >
    )
}