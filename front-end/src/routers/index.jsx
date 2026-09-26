import { createBrowserRouter } from "react-router"
import App from "../App"
import { HomePage } from "../pages/HomePage"
import Auth from "../pages/auth/index"
import { Cadastro, Login } from "../pages/auth/components/FormsAuth"

export const routers = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                index: true,
                element: <HomePage />
            },
            {
                path: 'auth',
                element: <Auth />,
                children: [
                    {
                        path: 'login',
                        element: <Login />
                    },
                    {
                        path: 'cadastro',
                        element: <Cadastro />
                    }
                ]
            }
        ]
    }
])