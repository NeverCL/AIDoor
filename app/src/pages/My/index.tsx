import { history, useModel } from "@umijs/max";

export default () => {
    const { user } = useModel('global');

    if (user?.isDevMode) {
        history.replace('/My/develop');
        return;
    }

    history.replace('/My/user');

    return;
}