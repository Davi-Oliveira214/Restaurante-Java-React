import { useContext, useEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router'
import {
   IconUserPlus,
   IconUserCheck,
   IconHome,
   IconLogout2,
} from '@tabler/icons-react'
import { AuthContext } from '../../context/AuthContext'

const classeBurguer =
   'flex flex-col fixed top-4 right-4 p-2 gap-[5px] rounded-xl transition-all duration-300 ease-in md:hidden pointer-events-auto z-100 bg-vermelho-600/80 backdrop-blur-sm border border-vermelho-500/50'

const classeMenu =
   'group fixed flex flex-col justify-evenly pointer-events-auto bg-vermelho-600 w-38 h-full -translate-x-42 duration-600 transform ease-in-out overflow-hidden md:translate-x-0 md:w-17.5 md:duration-500 md:hover:w-40'

const itensMenu = [
   { Icone: IconHome, texto: 'home', rota: '/', tipo: 'comum' },
   { Icone: IconUserCheck, texto: 'login', rota: '/auth/login', tipo: 'auth' },
   {
      Icone: IconUserPlus,
      texto: 'cadastro',
      rota: '/auth/cadastro',
      tipo: 'auth',
   },
]

export default function Header() {
   const [menuAberto, setMenuAberto] = useState(false)
   const refs = useRef({})
   const rotaAtual = useLocation()
   const { auth } = useContext(AuthContext)

   const alternarMenu = () => setMenuAberto((prev) => !prev)

   useEffect(() => {
      const itemAtivo = itensMenu.find(
         (item) => item.rota === rotaAtual.pathname,
      )
      if (!itemAtivo) return

      const el = refs.current[itemAtivo.texto]
      if (!el) return

      const topo = parseInt(el.getBoundingClientRect().top)
      refs.current.barra.style.top = `${topo}px`
   }, [rotaAtual])

   return (
      <header
         className={`z-80 h-screen md:static md:min-w-17.5 ${
            menuAberto
               ? 'w-screen bg-black/50 pointer-events-auto absolute'
               : 'pointer-events-none'
         }`}
         onClick={alternarMenu}
      >
         <div className={classeBurguer}>
            <LinhaBurguer aberto={menuAberto} index={0} />
            <LinhaBurguer aberto={menuAberto} index={1} />
            <LinhaBurguer aberto={menuAberto} index={2} />
         </div>

         <ul
            className={`${classeMenu} ${menuAberto ? 'translate-x-0' : ''}`}
            onClick={(e) => e.stopPropagation()}
         >
            {itensMenu
               .filter(
                  ({ tipo }) => tipo === 'comum' || (!auth && tipo === 'auth'),
               )
               .map(({ Icone, rota, texto }) => (
                  <ItemMenu
                     key={texto}
                     Icone={Icone}
                     texto={texto}
                     rota={rota}
                     ref={(el) => (refs.current[texto] = el)}
                  />
               ))}

            {auth && <Logout />}
            <li
               className='absolute w-full h-14 transform duration-500 rounded-lg
                           bg-white/20 border-l-4 border-laranja-500 pointer-events-none'
               ref={(el) => (refs.current.barra = el)}
            />
         </ul>
      </header>
   )
}

function ItemMenu({ Icone, texto, rota, ref }) {
   return (
      <li className='text-branco cursor-pointer px-2 z-10' ref={ref}>
         <NavLink
            to={rota}
            className='flex items-center justify-center w-full h-full py-3 gap-2.5 rounded-lg'
         >
            <Icone size={28} />
            <span className='capitalize text-sm text-branco font-medium duration-200 md:hidden md:group-hover:block '>
               {texto}
            </span>
         </NavLink>
      </li>
   )
}

function Logout() {
   const { setAuth } = useContext(AuthContext)

   const sair = () => {
      localStorage.removeItem('@App:user')
      setAuth(null)
   }

   return (
      <li className='text-branco cursor-pointer px-2 z-10' onClick={sair}>
         <NavLink
            to={'/auth/login'}
            className='flex items-center justify-center w-full h-full py-3 gap-2.5 rounded-lg'
         >
            <IconLogout2 size={28} />
            <span className='capitalize text-sm text-branco font-medium duration-200 md:hidden md:group-hover:block '>
               Sair
            </span>
         </NavLink>
      </li>
   )
}

function LinhaBurguer({ aberto, index }) {
   return (
      <div
         className={`w-6 h-0.5 bg-branco rounded-full transition-all duration-500 ease-in-out
            ${aberto && index === 0 ? 'translate-y-1.75 rotate-45' : ''}
            ${aberto && index === 1 ? 'opacity-0 scale-x-0' : ''}
            ${aberto && index === 2 ? '-translate-y-1.75 -rotate-45' : ''}
         `}
      />
   )
}
