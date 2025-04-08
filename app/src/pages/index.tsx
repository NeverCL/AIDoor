import { Navigate } from "@umijs/max"

export default () => {

    if (window.innerWidth > 500) {
        return (
            <iframe className="w-[500px] h-[100vh]" src="/home" frameborder="0"></iframe>
        )
    }

    return <Navigate to="/home" />
}