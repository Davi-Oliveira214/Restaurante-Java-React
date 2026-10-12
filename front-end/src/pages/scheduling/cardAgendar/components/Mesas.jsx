import { useState, useEffect } from 'react'
import { api } from '../../../../services/API'

export default function Mesas({ onClick, mesaAtual }) {
   const [mesas, setMesas] = useState([])

   useEffect(() => {
      api.get('/mesa').then((res) => setMesas(res.data))
   }, [])

   return (
      <div className='flex gap-2 overflow-x-auto scrollbar-none pb-0.5'>
         {mesas.map(({ id, codigo_mesa }) => (
            <button
               key={id}
               type='button'
               onClick={() => onClick([id, codigo_mesa])}
               className={`shrink-0 flex flex-col items-center px-3 py-2 rounded-xl border transition-all duration-150
                        ${
                           mesaAtual === id
                              ? 'bg-laranja-500/20 border-laranja-500 text-branco'
                              : 'bg-branco/6 border-branco/10 text-branco/55 hover:border-branco/20 hover:text-branco'
                        }`}
            >
               <span className='text-sm font-bold'>{codigo_mesa}</span>
               <span className='text-[9px] text-branco/35 mt-0.5'>Mesa</span>
            </button>
         ))}
      </div>
   )
}
