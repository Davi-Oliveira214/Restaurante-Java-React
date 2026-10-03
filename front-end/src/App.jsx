import Header from './components/Header'
import { Outlet } from 'react-router'
import { AuthProveider } from './context/AuthContext'

export default function App() {
   return (
      <AuthProveider>
         <Header />
         <Outlet />
      </AuthProveider>
   )
}
