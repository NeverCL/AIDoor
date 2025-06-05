import BackNavBar from "@/components/BackNavBar";
import { useModel, history } from "@umijs/max"
import { Button, Toast } from "antd-mobile";
import { useRequest } from '@umijs/max';
import api from '@/services/api';

export default () => {
    const { user, switchUserMode } = useModel('global');

    // 使用useRequest钩子获取当前用户的开发者信息
    const { data: publisherData, loading, run: getMyPublisher } = useRequest(api.publisher.getPublisherMy, {
        manual: true, // 手动触发
        onError: () => {
            // 请求错误，说明用户没有开发者信息
            console.log('用户没有开发者信息');
        }
    });

    const handleSwitchMode = async () => {
        try {
            Toast.show({
                icon: 'loading',
                content: '切换中...',
                duration: 0,
            });

            // 如果要从用户模式切换到开发者模式，需要检查开发者信息
            if (!user?.isDevMode) {
                try {
                    // 获取当前用户的开发者信息
                    const publisherInfo = await getMyPublisher();

                    // 如果获取成功，检查开发者状态
                    if (publisherInfo) {

                        // 已审核通过，可以切换到开发者模式
                        const result = await switchUserMode();

                        Toast.clear();

                        if (result.success) {
                            history.replace('/');
                        }
                        return;

                        const publisher = publisherInfo;

                        // 根据开发者状态处理
                        if (publisher.status === 0) { // Pending
                            Toast.clear();
                            Toast.show({
                                icon: 'fail',
                                content: '您的开发者信息正在审核中，请耐心等待',
                            });
                            return;
                        } else if (publisher.status === 2) { // Rejected
                            Toast.clear();
                            Toast.show({
                                icon: 'fail',
                                content: '您的开发者申请被拒绝，点击确定修改信息重新提交',
                                afterClose: () => {
                                    history.replace('/Account/Develop');
                                }
                            });
                            return;
                        } else if (publisher.status === 1) { // Approved
                            // 已审核通过，可以切换到开发者模式
                            const result = await switchUserMode();

                            Toast.clear();

                            if (result.success) {
                                history.replace('/');
                            }
                        }
                    }
                } catch (error) {
                    // 没有找到开发者信息，需要注册
                    Toast.clear();
                    Toast.show({
                        icon: 'fail',
                        content: '您需要先注册为开发者',
                        afterClose: () => {
                            history.replace('/Account/Develop');
                        }
                    });
                    return;
                }
            } else {
                // 从开发者模式切换到用户模式，直接切换
                const result = await switchUserMode();

                Toast.clear();

                if (result.success) {
                    history.replace('/');
                }
            }
        } catch (error) {
            Toast.clear();
            Toast.show({
                icon: 'fail',
                content: '切换失败，请重试',
            });
            console.error('切换身份失败:', error);
        }
    };

    return (
        <BackNavBar title="切换身份">
            <div className="flex flex-col justify-center items-center h-full *:mb-8">
                <div>
                    <span className="text-8xl">
                        {user?.isDevMode ? '👨‍💻' : '🧑‍💼'}
                    </span>
                </div>

                <div className="text-center">
                    <div>你当前的身份是
                        <span className="font-bold mt-2">
                            {user?.isDevMode ? '"开发者"' : '"使用者"'}
                        </span>
                    </div>
                </div>

                <div className="w-full rounded-3xl overflow-hidden">
                    <Button block color="primary" onClick={handleSwitchMode}>
                        点击切换为{!user?.isDevMode ? '"开发者"' : '"使用者"'}身份
                    </Button>
                </div>
            </div>
        </BackNavBar>
    )
}
