import { NavBar } from "antd-mobile"
import { history } from "@umijs/max"

export default () => {
    return (
        <div className="flex flex-col h-full text-white">
            <NavBar onBack={() => history.back()}>隐私政策</NavBar>

            <div className="flex-1 p-4 overflow-auto">
                <h2 className="text-xl font-bold mb-4">隐私政策</h2>

                <section className="mb-4">
                    <p className="mb-2">AIDoor非常重视您的隐私保护。本隐私政策旨在向您说明我们如何收集、使用、存储和保护您的个人信息。</p>
                    <p className="mb-2">请您在使用我们的服务前，仔细阅读并了解本隐私政策的全部内容。</p>
                </section>

                <section className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">1. 信息收集</h3>
                    <p className="mb-2">1.1 为了向您提供更好的服务，我们可能会收集以下信息：</p>
                    <p className="mb-2">- 注册信息：包括您的手机号码、昵称等；</p>
                    <p className="mb-2">- 设备信息：包括设备型号、操作系统、唯一设备标识符等；</p>
                    <p className="mb-2">- 日志信息：包括您使用我们服务的详细情况，如搜索查询内容、IP地址、浏览器类型等。</p>
                </section>

                <section className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">2. 信息使用</h3>
                    <p className="mb-2">2.1 我们可能将收集的信息用于以下用途：</p>
                    <p className="mb-2">- 提供、维护和改进我们的服务；</p>
                    <p className="mb-2">- 开发新的服务或功能；</p>
                    <p className="mb-2">- 了解用户如何使用我们的服务，以便改进用户体验；</p>
                    <p className="mb-2">- 向您发送服务通知和更新。</p>
                </section>

                <section className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">3. 信息共享</h3>
                    <p className="mb-2">3.1 除以下情况外，我们不会与任何第三方共享您的个人信息：</p>
                    <p className="mb-2">- 获得您的明确同意；</p>
                    <p className="mb-2">- 为遵守法律法规的要求；</p>
                    <p className="mb-2">- 为保护AIDoor的合法权益。</p>
                </section>

                <section className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">4. 信息安全</h3>
                    <p className="mb-2">我们采取各种安全技术和程序，以防信息的丢失、不当使用、未经授权阅览或披露。但请理解，互联网环境并非百分之百安全，我们将尽最大努力确保您的信息安全。</p>
                </section>

                <section className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">5. Cookie的使用</h3>
                    <p className="mb-2">我们使用Cookie和类似技术来提供更好的用户体验。您可以通过浏览器设置管理Cookie。</p>
                </section>

                <section className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">6. 隐私政策的更新</h3>
                    <p className="mb-2">我们可能会不时更新本隐私政策。当我们更新隐私政策时，我们会在应用程序中通知您，并提供更新后的隐私政策。</p>
                </section>

                <section className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">7. 联系我们</h3>
                    <p className="mb-2">如果您对本隐私政策有任何疑问，请通过以下方式联系我们：</p>
                    <p className="mb-2">邮箱：privacy@aidoor.com</p>
                </section>
            </div>
        </div>
    )
}