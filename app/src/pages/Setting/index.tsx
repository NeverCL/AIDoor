import BackNavBar from "@/components/BackNavBar";
import { history } from "@umijs/max"
import { List } from "antd-mobile"

const routes = [
    { text: "开发者社群", path: '/qrcode' },
    { text: "关于我们", path: '/setting/about' },
    { text: "用户协议", path: '/setting/useragreement' },
    { text: "隐私政策", path: '/setting/privacypolicy' },
    { text: "注销账号", path: '/' },
    { text: "退出登录", path: '/account/login' },
];

export default () => {

    return (
        <BackNavBar title="设置">
            <List>
                {
                    routes.map(r =>
                        <List.Item key={r.text} onClick={() => { history.push(r.path) }}>
                            {r.text}
                        </List.Item>
                    )
                }
            </List>
        </BackNavBar>
    )
}