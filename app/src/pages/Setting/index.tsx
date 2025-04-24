import BackNavBar from "@/components/BackNavBar";
import { history, useModel } from "@umijs/max";
import { List, Dialog, Toast } from "antd-mobile";
import { postUserLogout } from "@/services/api/user";

const routes = [
    { text: "开发者社群", path: '/qrcode' },
    { text: "关于我们", path: '/setting/about' },
    { text: "用户协议", path: '/setting/useragreement' },
    { text: "隐私政策", path: '/setting/privacypolicy' },
    { text: "注销账号", path: '/' },
];

export default () => {
    const { refreshUser } = useModel('global');

    const handleAccountDeletion = async () => {
        const result = await Dialog.confirm({
            content: '确定要注销账号吗？此操作不可恢复！',
        });

        if (result) {
            Toast.show({
                icon: 'success',
                content: '账号注销功能暂未实现',
            });
        }
    };

    const handleLogout = async () => {
        const result = await Dialog.confirm({
            content: '确定要退出登录吗？',
        });

        if (result) {
            try {
                await postUserLogout();
                Toast.show({
                    icon: 'success',
                    content: '已退出登录',
                });
                history.replace('/account/login');
            } catch (error) {
                Toast.show({
                    icon: 'fail',
                    content: '退出失败，请重试',
                });
            }
        }
    };

    const handleItemClick = (path: string, text: string) => {
        if (text === "注销账号") {
            handleAccountDeletion();
        } else if (text === "退出登录") {
            handleLogout();
        } else {
            history.push(path);
        }
    };

    return (
        <BackNavBar title={'设置'}>
            <List>
                {
                    [...routes, { text: "退出登录", path: '/account/login' }].map(r =>
                        <List.Item key={r.text} onClick={() => handleItemClick(r.path, r.text)}>
                            {r.text}
                        </List.Item>
                    )
                }
            </List>
        </BackNavBar>
    )
}