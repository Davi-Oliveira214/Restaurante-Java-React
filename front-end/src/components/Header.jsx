import cadastro from '../assets/icons/cadastro.png'
import login from '../assets/icons/login.png'
import home from '../assets/icons/home.png'
import { useState } from 'react'
import { Link } from 'react-router'

const burguer = 'flex flex-col fixed top-[2%] right-4 p-[8px_5px] gap-1 border-4 rounded-full transition-all duration-350 ease-in md:hidden pointer-events-auto z-100'

const menu = 'flex flex-col justify-evenly pointer-events-auto bg-vermelho-500 w-38 h-full -translate-x-42 duration-800 transform ease-in overflow-hidden md:translate-0 md:w-17.5  md:duration-400 md:hover:w-40'

export default function Header() {
    let [isMenu, setMenu] = useState(false)

    function ativarMenu(e) {
        console.log(e)
        setMenu(!isMenu)
    }

    return (
        <header className={`header z-80 h-screen fixed md:static md:w-17.5 ${isMenu ? 'w-screen bg-[rgba(0,0,0,0.4)] pointer-events-auto' : 'pointer-events-none'}`} onClick={ativarMenu}>
            <div className={`${burguer} ${isMenu ? 'border-laranja-500 [&>div]:bg-laranja-400 ' : 'border-vermelho-500 '}`} onClick={ativarMenu}>
                <Barra />
                <Barra />
                <Barra />
            </div>
            <ul className={`group ${menu} ${isMenu ? 'translate-x-0' : ''}`} onClick={(e) => e.stopPropagation()}>
                <Item img={home} texto={"home"} />
                <Item img={login} texto={"login"} />
                <Item img={cadastro} texto={"cadastro"} />
            </ul>
        </header>
    )
}

function Item({ img, texto }) {
    return (
        <li className='text-branco filtro-imagem text-[1.4rem] cursor-pointer'><Link to={texto} className='flex justify-center text-center gap-2'><img src={img} alt={texto} className='w-8 z-0' /><p className='group-hover:flex capitalize pointer-events-auto md:hidden md:group-hover:flex'>{texto}</p></Link></li>
    )
}

function Barra() {
    return (
        <div className='w-7.5 h-1 bg-vermelho-400 rounded-sm transition-all duration-350 ease-in'></div>
    )
}