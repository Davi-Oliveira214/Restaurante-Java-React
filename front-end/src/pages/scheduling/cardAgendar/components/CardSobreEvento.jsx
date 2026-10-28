import {
   IconCalendarCheck,
   IconCalendarClock,
   IconPlus,
} from '@tabler/icons-react'

export default function CardSobreEvento({ agendamento }) {
   const { agendamentoId, data, duracao, mesa, status } = agendamento

   const dataInicio = new Date(data)
   const passado = dataInicio.getTime() < Date.now()
   let statusColor = ''

   if (status === 'confirmado') statusColor = 'bg-green-400/30'
   else if (status === 'aguardando') statusColor = 'bg-laranja-500/20'
   else statusColor = 'bg-red-800/30'

   return (
      <article
         className={`relative shrink-0 overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-[22px] border border-white/10 bg-vermelho-600 p-4 sm:py-3.5 sm:pl-6 sm:pr-4 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 ${passado ? 'before:bg-white/20' : 'before:bg-laranja-500'}`}
      >
         <div className='flex items-center gap-4 min-w-0'>
            <div
               className={`shrink-0 w-14 h-14 rounded-xl flex items-center justify-center border
            ${
               passado
                  ? 'bg-black/15 border-white/10 text-white/75'
                  : 'bg-red-950 border-red-900 text-laranja-500'
            }`}
            >
               {passado ? (
                  <IconCalendarCheck size={28} />
               ) : (
                  <IconCalendarClock size={28} />
               )}
            </div>

            <div className='min-w-0'>
               <div className='flex flex-wrap items-center gap-2 mb-1'>
                  <p className='font-bold text-base text-branco'>
                     {dataInicio
                        .toLocaleDateString('pt-BR', {
                           day: '2-digit',
                           month: 'short',
                           year: 'numeric',
                           timeZone: 'UTC',
                        })
                        .replace('.', '')}
                  </p>

                  <span
                     className={`rounded-md px-2 py-0.5
                text-[11px] font-bold tracking-wide
                ${
                   passado
                      ? 'bg-white/10 text-white/60'
                      : 'bg-orange-950 text-laranja-400'
                }`}
                  >
                     {passado ? 'ANTERIORES' : 'POSTERIORES'}
                  </span>
               </div>

               <div className='flex flex-wrap items-center gap-2 text-xs'>
                  <span className='rounded-md bg-black/20 px-2 py-1 text-branco/80'>
                     {formatData(data, duracao)}
                  </span>

                  <span className='rounded-md bg-black/20 px-2 py-1 text-branco/80'>
                     {Number(duracao) / 60}h
                  </span>

                  <span
                     className='rounded-md bg-laranja-500/20 px-2 py-1
                font-semibold text-laranja-400'
                  >
                     {mesa?.codigo_mesa ?? 'Mesa não informada'}
                  </span>

                  <span
                     className={`w-max rounded-md px-2 py-1 font-semibold text-white first-letter:uppercase ${statusColor}`}
                  >
                     {status}
                  </span>
               </div>
            </div>
         </div>

         {!passado && (
            <div className='flex sm:flex-col gap-2 sm:w-29.5 shrink-0'>
               <BtnInCard num={1} onclick={() => editar(agendamentoId)} />
               <BtnInCard num={0} onclick={() => cancelar(agendamentoId)} />
            </div>
         )}
      </article>
   )
}

function BtnInCard({ num, onclick }) {
   const texto = num ? 'Editar' : 'Cancelar'

   return (
      <button
         type='button'
         className={`flex-1 sm:w-full rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold text-branco transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${num ? 'hover:border-laranja-500 hover:text-laranja-500' : 'hover:border-red-400 hover:text-red-300'}`}
         onClick={onclick}
      >
         {texto}
      </button>
   )
}

function editar(agendamentoId) {}

function cancelar(agendamentoId) {}

function formatData(inicio, duracao) {
   const horaInicio = new Date(inicio)
   const horaFim = new Date(inicio)

   horaFim.setMinutes(horaFim.getMinutes() + Number(duracao))

   const formatarHora = (data) =>
      data.toLocaleTimeString('pt-BR', {
         hour: '2-digit',
         minute: '2-digit',
      })

   return `${formatarHora(horaInicio)} - ${formatarHora(horaFim)}`
}
