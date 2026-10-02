import Header from './components/util/Header'
import { Outlet } from 'react-router'

export default function App() {
   return (
      <>
         <Header />
         <Outlet />
      </>
   )
}
