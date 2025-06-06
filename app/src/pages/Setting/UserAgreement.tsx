import { NavBar } from "antd-mobile"
import { history } from "@umijs/max"
import BackNavBar from "@/components/BackNavBar"

export default () => {
    return (
        <BackNavBar title="用户协议">
            <div className="flex-1 p-4 overflow-auto">
                <h2 className="text-xl font-bold mb-4">用户协议</h2>

                <section className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">1. 协议概述</h3>
                    <p className="mb-2">简要说明本协议是用户与"AI之门"之间就服务使用所订立的权利义务条款。</p>
                </section>

                <section className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">2. 定义说明</h3>
                    <p className="mb-2">• "平台"：指AI之门App及相关服务。</p>
                    <p className="mb-2">• "用户"：指使用本平台服务的个人。</p>
                    <p className="mb-2">• "开发者"：指通过平台发布AI应用、图文或视频内容的注册用户。</p>
                    <p className="mb-2">• "第三方AI应用"：平台通过iframe技术嵌入的外部服务和网站。</p>
                </section>

                <section className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">3. 用户注册与管理</h3>
                    <p className="mb-2">• 用户须提供真实有效的手机号码进行注册。</p>
                    <p className="mb-2">• 禁止冒用他人信息注册账号。</p>
                    <p className="mb-2">• 用户应妥善保管账号与验证码，因用户自身原因造成的损失由用户自行承担。</p>
                </section>

                <section className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">4. 服务内容与使用规范</h3>
                    <p className="mb-2">• 平台为AI应用聚合服务平台，用户可浏览、跳转、体验第三方AI应用。</p>
                    <p className="mb-2">• 开发者可通过平台发布与其AI应用相关的图文、视频介绍，并设置跳转链接。</p>
                    <p className="mb-2">• 用户使用第三方AI应用时应遵守对方平台的条款与政策。</p>
                    <p className="mb-2">• 禁止以下行为：</p>
                    <p className="ml-4 mb-2">- 上传违法违规内容或诱导信息；</p>
                    <p className="ml-4 mb-2">- 利用平台进行钓鱼、诈骗、恶意营销；</p>
                    <p className="ml-4 mb-2">- 非授权爬取、复制、传播平台内容。</p>
                </section>

                <section className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">5. iframe嵌入与免责声明</h3>
                    <p className="mb-2">• 平台嵌入的内容由第三方提供，不对其准确性、稳定性、安全性负责。</p>
                    <p className="mb-2">• 用户与第三方应用之间的任何交易、数据交互、支付行为，均由用户与该第三方自行处理。</p>
                </section>

                <section className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">6. 开发者责任与规范</h3>
                    <p className="mb-2">• 开发者应确保其上传内容合法、真实、无误导成分，不得发布违反中国法律法规的内容。</p>
                    <p className="mb-2">• 平台有权对不合规内容或链接进行下架、屏蔽、封号等处理。</p>
                    <p className="mb-2">• 对上传的内容承担全部法律责任。</p>
                </section>

                <section className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">7. 知识产权声明</h3>
                    <p className="mb-2">• "AI之门"平台的商标、标识、界面、结构等属于平台所有。</p>
                    <p className="mb-2">• 开发者上传内容的知识产权归开发者本人或其授权方所有，但平台有权展示、推荐、运营推广。</p>
                </section>

                <section className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">8. 责任限制</h3>
                    <p className="mb-2">• 平台作为信息服务中介，仅提供工具和展示服务，不对开发者与用户之间产生的任何纠纷负责。</p>
                    <p className="mb-2">• 用户使用本平台服务所造成的任何直接或间接损失，平台不承担责任。</p>
                </section>

                <section className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">9. 修改与终止</h3>
                    <p className="mb-2">• 平台可不时更新本协议，并在App内公示。更新后继续使用即视为接受修改。</p>
                    <p className="mb-2">• 用户若违反本协议条款，平台有权限制或终止其账号权限。</p>
                </section>

                <section className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">10. 法律适用与争议解决</h3>
                    <p className="mb-2">• 本协议适用中华人民共和国法律。</p>
                    <p className="mb-2">• 因协议引起的争议应提交平台所在地人民法院管辖。</p>
                </section>

                <section className="mb-4">
                    <p className="text-center">本协议最终解释权归AI之门所有</p>
                </section>
            </div>
        </BackNavBar>
    )
}