import { Navigate, useModel } from "@umijs/max";

export default () => {
    const { user } = useModel('global');

    if (user?.isDevMode) {
        return <Navigate to="/My/develop" />
    }

    return <Navigate to="/My/user" />
}