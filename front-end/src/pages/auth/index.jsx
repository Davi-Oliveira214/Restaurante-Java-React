import { NavLink, Outlet, useLocation } from 'react-router'
import fundo from '../../assets/imgs/fundo_auth.png'

export default function Auth() {
   let rota = useLocation()

   return (
      <main className='flex flex-1 w-full h-full justify-center items-center lg:justify-end z-10'>
         <div
            className='z-10 flex flex-col w-full mx-3.5 rounded-2xl py-8 px-7 max-w-105 lg:mr-24
                         bg-preto-azulado/20 backdrop-blur-xl
                         border border-white/30'
         >
            <div className='mb-7 text-center'>
               <h1 className='text-white text-2xl font-medium tracking-tight'>
                  {rota.pathname === '/auth/login'
                     ? 'Bem-vindo de volta'
                     : 'Criar conta'}
               </h1>
               <p className='text-white/40 text-sm mt-1'>
                  {rota.pathname === '/auth/login'
                     ? 'Entre para continuar'
                     : 'Preencha os dados abaixo'}
               </p>
            </div>

            <div className='relative flex text-center mb-7 bg-white/5 rounded-xl p-1'>
               <NavLink
                  to={'login'}
                  className={({ isActive }) =>
                     `flex-1 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 z-10
                      ${isActive ? 'text-white' : 'text-white/40 hover:text-white/70'}`
                  }
               >
                  Login
               </NavLink>
               <NavLink
                  to={'cadastro'}
                  className={({ isActive }) =>
                     `flex-1 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 z-10
                      ${isActive ? 'text-white' : 'text-white/40 hover:text-white/70'}`
                  }
               >
                  Cadastro
               </NavLink>
               <span
                  className={`absolute top-1 h-[calc(100%-8px)] w-[calc(50%-4px)] rounded-lg
                               bg-vermelho-400/80 border border-vermelho-300/30
                               transition-all duration-400 ease-out
                               ${rota.pathname === '/auth/login' ? 'left-1' : 'left-[calc(50%+2px)]'}`}
               />
            </div>

            <Outlet />
         </div>

         <div className='absolute inset-0 bg-preto'>
            <img
               src={fundo}
               alt=''
               className='object-cover w-full h-full opacity-65'
            />
            <div className='absolute inset-0 bg-linear-to-t from-preto/70 via-transparent' />
         </div>
      </main>
   )
}
