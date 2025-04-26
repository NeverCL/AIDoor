import BackNavBar from "@/components/BackNavBar";
import { useModel, history } from "@umijs/max"
import { Button } from "antd-mobile";

export default () => {

    const { user, switchUser } = useModel('global');

    return (
        <BackNavBar title="切换身份">
            <div className="flex flex-col justify-center items-center h-full *:mb-4 *:flex-shrink-0">
                <div>
                    <span className="text-4xl">
                        {user.isDev ? '👨‍💻' : '👤'}
                    </span>
                </div>

                <div>
                    <span>你当前的身份是</span>
                    <span>{user.isDev ? '“开发者”' : '“使用者”'}</span>
                </div>
                <Button block color="primary" onClick={() => {
                    switchUser(user);
                    history.replace('/');
                }}>切换身份</Button>
            </div>
        </BackNavBar>
    )
}
