import {createBrowserRouter, RouterProvider} from "react-router-dom";
import LoginPage from "@/pages/login.tsx";
import RegisterPage from "@/pages/register.tsx";
import {AuthContextProvider} from "@/context/auth-context.tsx";
import PrivateRoutes from "@/layouts/auth-layout.tsx";

const routes = createBrowserRouter([
    {
        path: "/",
        element: <LoginPage/>
    },
    {
        path: "/register",
        element: <RegisterPage/>
    },
    {
        path: "/dashboard",
        element: <PrivateRoutes/>,
        children: [
            {
                path: "/dashboard",
                element: <h1>Protected</h1>
            }
        ]
    }
])

function App() {
    return (
        <>
            <AuthContextProvider>
                <RouterProvider router={routes}/>
            </AuthContextProvider>
        </>
    )
}

export default App
