import { Outlet, useLocation } from 'react-router'
import fundo from '../../assets/imgs/fundo_auth.png'

export default function Auth() {
   let rota = useLocation()

   return (
      <main className='flex flex-1 w-full h-full justify-center items-center lg:justify-end z-10'>
         <div className='z-10 flex flex-col w-full mx-3.5 border-2 border-branco bg-preto/60 rounded-lg py-3.5 px-4 max-w-125 lg:mr-20'>
            <h1 className='text-branco text-3xl font-bold italic px-1 py-2.5 text-center'>
               {rota.pathname == '/auth/login'
                  ? 'Bem vindo(a) de volta!'
                  : 'Prazer em conhecer!'}
            </h1>
            <Outlet />
         </div>

         <div className='absolute w-full h-full bg-preto'>
            <img
               src={fundo}
               alt=''
               className='object-cover w-full h-full opacity-60'
            />
         </div>
      </main>
   )
}
