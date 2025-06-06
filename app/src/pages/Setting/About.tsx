import { NavBar } from "antd-mobile"
import { history } from "@umijs/max"
import BackNavBar from "@/components/BackNavBar"

export default () => {
    return (
        <BackNavBar title="关于我们">
            <div className="flex-1 p-4 flex flex-col items-center justify-between">
                <div className="flex flex-col items-center mt-16">
                    <h2 className="text-2xl font-medium mb-2">AI之门</h2>
                    <p className="text-gray-500 text-center">新一代AI创意生产力平台</p>
                </div>

                <div className="w-full rounded-xl border border-gray-200 p-4 flex justify-between items-center mb-4">
                    <span className="text-gray-500">当前版本</span>
                    <span className="text-gray-500">version 1.0.0</span>
                </div>

                <div className="mb-8 text-xs text-gray-500 text-center">
                    <p className="mb-1">ICP备案号：京ICP备 2024082134号-3</p>
                </div>
            </div>
        </BackNavBar>
    )
}