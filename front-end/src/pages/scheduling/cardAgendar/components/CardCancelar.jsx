import { IconCalendarX } from '@tabler/icons-react'

export default function CardCancelar({
   data,
   duracao,
   mesa,
   onVoltar,
   onConfirmar,
}) {
   const dataFmt = new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
   })

   const fmt = (d) =>
      new Date(d).toLocaleTimeString('pt-BR', {
         hour: '2-digit',
         minute: '2-digit',
      })
   const fim = new Date(data)
   fim.setMinutes(fim.getMinutes() + Number(duracao))
   const horario = `${fmt(data)} – ${fmt(fim)}`

   return (
      <div
         className='fixed inset-0 z-50 flex items-center justify-center bg-preto-azulado/60 backdrop-blur-sm'
         onClick={onVoltar}
      >
         <div
            className='w-full max-w-xs bg-vermelho-600 border border-branco/8 rounded-2xl overflow-hidden'
            onClick={(e) => e.stopPropagation()}
         >
            <div className='px-4 pt-4 pb-3 border-b border-branco/6'>
               <div className='w-9 h-9 rounded-xl bg-red-500/15 border border-red-500/20 flex items-center justify-center mb-3'>
                  <IconCalendarX size={18} className='text-red-400' />
               </div>
               <p className='text-[13px] font-bold text-branco mb-1'>
                  Cancelar agendamento?
               </p>
               <p className='text-[11px] text-branco/40 leading-relaxed'>
                  Esta ação não pode ser desfeita. O horário ficará disponível
                  novamente.
               </p>
            </div>

            <div className='px-4 py-3 flex flex-col gap-3'>
               <div className='bg-preto/20 border border-branco/6 rounded-xl px-3 py-2.5 flex flex-col gap-1.5'>
                  {[
                     { chave: 'Data', valor: dataFmt },
                     { chave: 'Horário', valor: horario },
                     {
                        chave: 'Mesa',
                        valor: mesa?.codigo_mesa ?? '—',
                        laranja: true,
                     },
                  ].map(({ chave, valor, laranja }) => (
                     <div
                        key={chave}
                        className='flex justify-between items-center'
                     >
                        <span className='text-[10px] uppercase tracking-[.06em] text-branco/35'>
                           {chave}
                        </span>
                        <span
                           className={`text-[11px] font-semibold ${laranja ? 'text-laranja-400' : 'text-branco'}`}
                        >
                           {valor}
                        </span>
                     </div>
                  ))}
               </div>

               <div className='grid grid-cols-2 gap-2'>
                  <button
                     type='button'
                     onClick={onVoltar}
                     className='py-2 rounded-xl text-xs font-bold bg-branco/[.07] border border-branco/10 text-branco/60 hover:bg-branco/12 hover:text-branco transition-all duration-150'
                  >
                     Voltar
                  </button>
                  <button
                     type='button'
                     onClick={onConfirmar}
                     className='py-2 rounded-xl text-xs font-bold bg-red-500/20 border border-red-500/25 text-red-400 hover:bg-red-500/35 hover:text-red-300 transition-all duration-150'
                  >
                     Confirmar
                  </button>
               </div>
            </div>
         </div>
      </div>
   )
}
