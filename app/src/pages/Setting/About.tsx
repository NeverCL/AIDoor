import { NavBar } from "antd-mobile"
import { history } from "@umijs/max"
import BackNavBar from "@/components/BackNavBar"

export default () => {
    return (
        <BackNavBar title="关于我们">
            <div className="flex-1 p-4 overflow-auto">
                <h2 className="text-xl font-bold mb-4">AIDoor</h2>

                <section className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">公司简介</h3>
                    <p className="mb-2">AIDoor是一家专注于人工智能应用开发的科技公司，致力于将先进的AI技术应用到日常生活和工作中，为用户提供智能、便捷的服务体验。</p>
                </section>

                <section className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">我们的使命</h3>
                    <p className="mb-2">通过创新的AI技术，打破传统应用的边界，为用户创造更加智能、高效的生活方式。</p>
                </section>

                <section className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">联系我们</h3>
                    <p className="mb-1">邮箱：contact@aidoor.com</p>
                    <p className="mb-1">电话：400-888-8888</p>
                    <p className="mb-1">地址：北京市海淀区科技园区88号</p>
                </section>

                <section>
                    <h3 className="text-lg font-semibold mb-2">版本信息</h3>
                    <p>当前版本：v1.0.0</p>
                </section>
            </div>
        </BackNavBar>
    )
}