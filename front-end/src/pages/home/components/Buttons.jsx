import { Link } from 'react-router'
import { useContext } from 'react'
import { AuthContext } from '../../../context/AuthContext'

const base =
   'w-full font-semibold text-[13px] py-1.5 rounded-md border-2 border-preto cursor-pointer transition-all duration-200 ease-in hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2'

export function Agendar() {
   const { auth } = useContext(AuthContext)

   return (
      <button
         type='button'
         className={`${base} bg-green-800 text-branco hover:bg-[#1a6f2e] focus-visible:outline-green-800`}
      >
         <Link to={auth ? './agendamento' : './auth/login'}>Agendar</Link>
      </button>
   )
}

export function Detalhes({ onClick }) {
   return (
      <button
         type='button'
         className={`${base} bg-laranja-500 text-preto hover:bg-laranja-400 focus-visible:outline-laranja-500`}
         onClick={onClick}
      >
         Detalhes
      </button>
   )
}
