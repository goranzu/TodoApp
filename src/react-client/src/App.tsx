import {createBrowserRouter, RouterProvider} from "react-router-dom";
import LoginPage from "@/pages/login.tsx";
import RegisterPage from "@/pages/register.tsx";

const routes = createBrowserRouter([
    {
        path: "/",
        element: <LoginPage/>
    },
    {
        path: "/register",
        element: <RegisterPage/>
    }
])

function App() {
    return (
        <>
            <RouterProvider router={routes}/>
        </>
    )
}

export default App
