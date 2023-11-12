import {Route, Routes} from "react-router-dom";
import LoginPage from "@/pages/login.tsx";
import RegisterPage from "@/pages/register.tsx";
import {AuthContextProvider} from "@/context/auth-context.tsx";
import PrivateRoutes from "@/layouts/auth-layout.tsx";
import DashboardPage from "@/pages/dashboard.tsx";

function App() {
    return (
        <>
            <AuthContextProvider>
                <Routes>
                    <Route path={"/"} element={<LoginPage/>}/>
                    <Route path={"register"} element={<RegisterPage/>}/>
                    <Route path={"dashboard"} element={<PrivateRoutes/>}>
                        <Route index element={<DashboardPage/>}/>
                    </Route>
                </Routes>
            </AuthContextProvider>
        </>
    )
}

export default App
