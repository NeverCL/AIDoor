import { useModel, history } from "@umijs/max"
import { useEffect } from "react";

export default () => {

    const { user, switchUser } = useModel('global');

    useEffect(() => {
        switchUser(user);
        history.replace('/');
    }, []);

    // todo 切换开发者时，未注册过，则跳转到注册开发者页面

    return (
        <div>
            <span>切换身份</span>
        </div>
    )
}
