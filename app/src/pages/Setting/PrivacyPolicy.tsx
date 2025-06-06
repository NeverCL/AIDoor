import { NavBar } from "antd-mobile"
import { history } from "@umijs/max"
import BackNavBar from "@/components/BackNavBar"

export default () => {
    return (
        <BackNavBar title="隐私政策">
            <div className="flex-1 p-4 overflow-auto">
                <h2 className="text-xl font-bold mb-4">隐私政策</h2>

                <section className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">1. 引言</h3>
                    <p className="mb-2">说明平台重视用户隐私，承诺依法保护用户个人信息。</p>
                </section>

                <section className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">2. 收集的信息</h3>
                    <p className="mb-2">• 注册信息：手机号码，用于身份验证与功能使用。</p>
                    <p className="mb-2">• 使用数据（未来）：设备型号、操作系统、使用时长、点击行为等。</p>
                    <p className="mb-2">• 开发者上传内容：图文、视频、链接。</p>
                </section>

                <section className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">3. 信息的使用目的</h3>
                    <p className="mb-2">• 用于提供服务、功能体验、故障排查、安全保障、未来内容推荐。</p>
                    <p className="mb-2">• 将来可能用于行为分析、广告投放优化。</p>
                </section>

                <section className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">4. 第三方内容与跳转说明</h3>
                    <p className="mb-2">• 平台内含iframe加载的第三方AI应用页面，平台不控制该等页面的隐私政策。</p>
                    <p className="mb-2">• 建议用户使用前查看跳转页面的相关政策。</p>
                </section>

                <section className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">5. 信息的共享与披露</h3>
                    <p className="mb-2">• 平台不会将用户信息出售或非法提供给第三方。</p>
                    <p className="mb-2">• 在法律法规要求或行政司法机关依法请求时，平台将配合提供必要数据。</p>
                </section>

                <section className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">6. 信息存储与保护</h3>
                    <p className="mb-2">• 数据存储在中国大陆服务器（如阿里云/腾讯云），仅限授权人员访问。</p>
                    <p className="mb-2">• 采用加密、访问控制等手段保护数据安全。</p>
                </section>

                <section className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">7. 用户的权利</h3>
                    <p className="mb-2">• 用户有权查询、更正、删除其个人信息；</p>
                    <p className="mb-2">• 有权注销账号，相关数据在注销后进行脱敏或删除处理。</p>
                </section>

                <section className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">8. 未成年人隐私</h3>
                    <p className="mb-2">• 未满14岁未成年人应在监护人同意下使用本平台。</p>
                </section>

                <section className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">9. 政策变更</h3>
                    <p className="mb-2">• 政策变更将在平台内发布通知，变更后继续使用视为接受新政策。</p>
                </section>

                <section className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">10. 联系方式</h3>
                    <p className="mb-2">• 用户如有隐私相关疑问，可通过以下方式联系我们：</p>
                    <p className="mb-2">邮箱：653705548@qq.com</p>
                </section>
            </div>
        </BackNavBar>
    )
}