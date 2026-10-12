import { useEffect, useState } from 'react'
import { api } from '../../../../services/API'

export default function Horarios({ id, data, duracao, onClick, horarioAtual }) {
   const [horarios, setHorarios] = useState([])

   useEffect(() => {
      if (!id || !data || !duracao) return
      const getMesas = async () => {
         const resp = await api.get(
            `/agendamento/${id}/horarios?data=${data}&duracao=${duracao}`,
         )
         const dados = await resp.data
         setHorarios(dados)
      }

      getMesas()
   }, [id, data, duracao])

   if (horarios.length === 0) {
      return (
         <p className='text-[11px] text-branco/35 italic text-center py-2'>
            Nenhuma mesa disponível
         </p>
      )
   }

   return (
      <div className='flex gap-2 overflow-x-auto scrollbar-none pb-0.5'>
         {horarios.map(({ inicio, fim }, i) => {
            const fmt = (d) =>
               new Date(d).toLocaleTimeString('pt-BR', {
                  hour: '2-digit',
                  minute: '2-digit',
               })
            const selecionado = horarioAtual === inicio

            return (
               <button
                  key={i}
                  type='button'
                  onClick={() => onClick(inicio)}
                  className={`shrink-0 flex flex-col items-center px-3 py-2 rounded-xl border transition-all duration-150
                            ${
                               selecionado
                                  ? 'bg-laranja-500/20 border-laranja-500 text-branco'
                                  : 'bg-branco/5 border-branco/10 text-branco/55 hover:border-branco/20 hover:text-branco'
                            }`}
               >
                  <span className='text-xs font-semibold'>{fmt(inicio)}</span>
                  <span className='text-[9px] text-branco/35 mt-0.5'>
                     {fmt(fim)}
                  </span>
               </button>
            )
         })}
      </div>
   )
}
