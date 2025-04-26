import BackNavBar from "@/components/BackNavBar";
import { useModel, history } from "@umijs/max"
import { Button, Toast } from "antd-mobile";

export default () => {
    const { user, switchUser } = useModel('global');

    const handleSwitchMode = async () => {
        try {
            Toast.show({
                icon: 'loading',
                content: '切换中...',
                duration: 0,
            });

            await switchUser();

            Toast.clear();
            Toast.show({
                icon: 'success',
                content: `已切换为${!user?.isDevMode ? '开发者' : '使用者'}模式`,
            });

            history.replace('/');
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
                        {user.isDevMode ? '👨‍💻' : '🧑‍💼'}
                    </span>
                </div>

                <div className="text-center">
                    <div>你当前的身份是
                        <span className="font-bold mt-2">
                            {user.isDevMode ? '"开发者"' : '"使用者"'}
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
