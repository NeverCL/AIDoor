import BackNavBar from "@/components/BackNavBar";
import { history, useModel, useRequest } from "@umijs/max";
import { List, Dialog, Toast, Modal } from "antd-mobile";
import { postUserLogout, postUserDeleteAccount } from "@/services/api/user";
import api from "@/services/api";

const routes = [
    { text: "开发者社群", path: '/qrcode' },
    { text: "关于我们", path: '/setting/about' },
    { text: "用户协议", path: '/setting/useragreement' },
    { text: "隐私政策", path: '/setting/privacypolicy' },
];

export default () => {

    const { run: logout } = useRequest(api.user.postUserLogout, {
        manual: true,
        onSuccess: () => {
            history.replace('/account/login');
        }
    });

    const handleAccountDeletion = async () => {
        const result1 = await Dialog.confirm({
            content: '确定要注销账号吗？此操作不可恢复！',
            confirmText: '继续注销',
            cancelText: '取消',
        });

        if (result1) {
            // 二次确认
            const result2 = await Dialog.confirm({
                content: '注销账号后，您的所有数据将被删除且无法恢复，确认继续吗？',
                confirmText: '确认注销',
                cancelText: '再想想',
            });

            if (result2) {
                Modal.show({
                    content: '正在处理注销请求...',
                    closeOnMaskClick: false,
                    showCloseButton: false,
                });

                await postUserDeleteAccount();

                Modal.clear();

                Toast.show({
                    icon: 'success',
                    content: '账号已成功注销',
                });

                // 跳转到登录页
                history.replace('/account/login');
            }
        }
    };

    const handleLogout = async () => {
        const result = await Dialog.confirm({
            content: '确定要退出登录吗？',
        });

        if (result) {
            await logout();
            Toast.show({
                icon: 'success',
                content: '已退出登录',
            });
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
                    [...routes].map(r =>
                        <List.Item key={r.text} onClick={() => handleItemClick(r.path, r.text)}>
                            {r.text}
                        </List.Item>
                    )
                }
                <List.Item onClick={() => handleAccountDeletion()}>
                    <span className="text-red-500">注销账号</span>
                </List.Item>
                <List.Item onClick={() => handleLogout()}>
                    退出登录
                </List.Item>
            </List>
        </BackNavBar>
    )
}