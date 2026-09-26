import cadastro from '../assets/icons/cadastro.png'
import login from '../assets/icons/login.png'
import home from '../assets/icons/home.png'
import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router'

const classeBurguer =
   'flex flex-col fixed top-[2%] right-4 p-[8px_5px] gap-1 border-4 rounded-full transition-all duration-350 ease-in md:hidden pointer-events-auto z-100'

const classeMenu =
   'flex flex-col justify-evenly pointer-events-auto bg-vermelho-600 w-38 h-full -translate-x-42 duration-800 transform ease-in overflow-hidden md:translate-0 md:w-17.5 md:duration-400 md:hover:w-40'

const itensMenu = [
   { img: home, texto: 'home', rota: '/' },
   { img: login, texto: 'login', rota: '/auth/login' },
   { img: cadastro, texto: 'cadastro', rota: '/auth/cadastro' },
]

export default function Header() {
   const [menuAberto, setMenuAberto] = useState(false)
   const refs = useRef({})
   const rotaAtual = useLocation()

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
         className={`z-80 h-screen fixed md:static md:w-17.5 ${
            menuAberto
               ? 'w-screen bg-[rgba(0,0,0,0.4)] pointer-events-auto'
               : 'pointer-events-none'
         }`}
         onClick={alternarMenu}
      >
         <div
            className={`${classeBurguer} ${
               menuAberto
                  ? 'border-laranja-500 [&>div]:border-laranja-400'
                  : 'border-vermelho-500'
            }`}
         >
            <LinhaBurguer />
            <LinhaBurguer />
            <LinhaBurguer />
         </div>

         <ul
            className={`group relative ${classeMenu} ${menuAberto ? 'translate-x-0' : ''}`}
            onClick={(e) => e.stopPropagation()}
         >
            {itensMenu.map(({ img, texto, rota }) => (
               <ItemMenu
                  key={texto}
                  img={img}
                  texto={texto}
                  rota={rota}
                  ref={(el) => (refs.current[texto] = el)}
               />
            ))}
            <li
               className='absolute bg-laranja-500 w-full h-14 transform duration-300 rounded-full'
               ref={(el) => (refs.current.barra = el)}
            />
         </ul>
      </header>
   )
}

function ItemMenu({ img, texto, rota, ref }) {
   return (
      <li
         className='text-branco text-[1.4rem] cursor-pointer px-2 z-10'
         ref={ref}
      >
         <NavLink
            to={rota}
            className='flex justify-center text-center w-full h-full pb-3 pt-2 gap-2 rounded-full overflow-hidden'
         >
            <img src={img} alt={texto} className='filtro-imagem w-8 z-0' />
            <span className='group-hover:flex capitalize pointer-events-auto md:hidden md:group-hover:flex'>
               {texto}
            </span>
         </NavLink>
      </li>
   )
}

function LinhaBurguer() {
   return (
      <div className='w-7.5 h-1 bg-vermelho-400 rounded-sm transition-all duration-350 ease-in' />
   )
}
