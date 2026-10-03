import { createBrowserRouter } from 'react-router'
import App from '../App'
import { HomePage } from '../pages/HomePage'
import Auth from '../pages/auth/index'
import { Cadastro, Login } from '../pages/auth/components/FormsAuth'
import RecuperarSenha from '../pages/auth/components/RecuperarSenha'

export const routers = createBrowserRouter([
   {
      path: '/',
      element: <App />,
      children: [
         {
            index: true,
            element: <HomePage />,
         },
         {
            path: 'auth',
            element: <Auth />,
            children: [
               {
                  path: 'login',
                  element: <Login />,
               },
               {
                  path: 'cadastro',
                  element: <Cadastro />,
               },
               {
                  path: 'recuperar-senha',
                  element: <RecuperarSenha />,
               },
            ],
         },
      ],
   },
])
