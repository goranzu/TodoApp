import {Navigate, Outlet, useLocation} from "react-router-dom";
import {useAuth} from "@/context/auth-context.tsx";

export default function PrivateRoutes() {
    const location = useLocation();
    const {isAuthenticated, isLoading} = useAuth();

    if (isLoading) {
        return <div>Loading...</div>
    }
    // if (isAuthenticated == null) {
    //     return null;
    // }

    return isAuthenticated ? <Outlet/> : <Navigate to="/" replace state={{from: location}}/>;
}