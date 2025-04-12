import { NavBar } from "antd-mobile"
import { history } from "@umijs/max"
import BackNavBar from "@/components/BackNavBar"

export default () => {
    return (
        <BackNavBar title="用户协议">
            <div className="flex-1 p-4 overflow-auto">
                <h2 className="text-xl font-bold mb-4">用户协议</h2>

                <section className="mb-4">
                    <p className="mb-2">欢迎使用AIDoor服务！</p>
                    <p className="mb-2">本协议是您与AIDoor之间关于使用AIDoor服务的法律协议。请您务必审慎阅读、充分理解各条款内容。</p>
                </section>

                <section className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">1. 服务内容</h3>
                    <p className="mb-2">AIDoor为用户提供智能化服务，包括但不限于智能助手、数据分析、智能推荐等功能。我们会不断改进服务质量，优化用户体验。</p>
                </section>

                <section className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">2. 用户注册</h3>
                    <p className="mb-2">2.1 用户在使用本服务前需要注册账号。注册时，用户应当提供真实、准确、完整的个人资料。</p>
                    <p className="mb-2">2.2 用户应妥善保管账号及密码信息，因账号密码保管不善造成的损失由用户自行承担。</p>
                </section>

                <section className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">3. 用户行为规范</h3>
                    <p className="mb-2">3.1 用户在使用AIDoor服务时，必须遵守中华人民共和国相关法律法规。</p>
                    <p className="mb-2">3.2 用户不得利用AIDoor服务从事违法活动，不得传播违法信息。</p>
                </section>

                <section className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">4. 知识产权</h3>
                    <p className="mb-2">AIDoor服务中的所有内容，包括但不限于文字、图片、音频、视频、软件、程序、数据等，均由AIDoor或其关联公司依法拥有其知识产权。</p>
                </section>

                <section className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">5. 协议修改</h3>
                    <p className="mb-2">AIDoor有权在必要时修改本协议条款。您可以在相关服务页面查阅最新版本的协议条款。</p>
                </section>

                <section className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">6. 免责声明</h3>
                    <p className="mb-2">6.1 用户明确了解并同意，AIDoor不对因网络连接故障、计算机故障、病毒侵袭等不可抗力因素导致的服务中断或数据丢失承担责任。</p>
                    <p className="mb-2">6.2 AIDoor不保证服务一定能满足用户的所有需求，也不保证服务不会中断。</p>
                </section>

                <section className="mb-4">
                    <p className="text-center">本协议最终解释权归AIDoor所有</p>
                </section>
            </div>
        </BackNavBar>
    )
}