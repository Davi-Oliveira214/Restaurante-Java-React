import { useState } from 'react'
import { api } from '../../../../services/API'

export default function CardAgendaFinal({
   token,
   data,
   duracao,
   mesa,
   horario,
}) {
   const [status, setStatus] = useState('idle')
   const [mensagem, setMensagem] = useState('')
   const pronto = data && duracao && mesa.length > 0 && horario

   const formatarHora = (inicio, dur) => {
      if (!inicio || !dur) return '—'
      const ini = new Date(inicio)
      const fim = new Date(inicio)
      fim.setMinutes(fim.getMinutes() + Number(dur))
      const fmt = (d) =>
         d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      return `${fmt(ini)} – ${fmt(fim)}`
   }

   async function submit(e) {
      e.preventDefault()
      if (!pronto) {
         setStatus('erro')
         setMensagem('Preencha todos os campos')
         return
      }

      setStatus('loading')
      setMensagem('')

      try {
         await api.post(
            '/agendamento',
            {
               data: horario,
               duracao,
               mesa: mesa[0],
            },
            {
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            },
         )
         setStatus('sucesso')
         setMensagem('Agendamento confirmado com sucesso!')

         let segundos = 6

         const intervalo = setInterval(() => {
            segundos -= 1
            setMensagem(`Reiniciando em ${segundos}s`)

            if (segundos <= 0) {
               clearInterval(intervalo)
               window.location.reload()
            }
         }, 1000)
      } catch {
         setStatus('erro')
         setMensagem('Erro ao confirmar. Tente novamente.')
      }
   }

   const resumo = [
      {
         chave: 'Data',
         valor: data
            ? new Date(`${data}T12:00:00`).toLocaleDateString('pt-BR')
            : '—',
      },
      { chave: 'Duração', valor: duracao ? `${duracao / 60}h` : '—' },
      { chave: 'Mesa', valor: mesa[1] ?? '—' },
      { chave: 'Horário', valor: formatarHora(horario, duracao) },
   ]

   return (
      <form onSubmit={submit} className='flex flex-col gap-3'>
         <div className='bg-preto/20 border border-branco/[.07] rounded-xl overflow-hidden'>
            <p className='text-[10px] font-semibold uppercase tracking-[.07em] text-branco/40 px-3.5 py-2.5 border-b border-branco/6'>
               Resumo
            </p>
            <div className='grid grid-cols-2'>
               {resumo.map(({ chave, valor }, i) => (
                  <div
                     key={chave}
                     className={`flex flex-col gap-0.5 px-3.5 py-2.5
                            ${i % 2 === 0 ? 'border-r border-branco/6' : ''}
                            ${i < 2 ? 'border-b border-branco/5' : ''}
                        `}
                  >
                     <span className='text-[10px] uppercase tracking-[.07em] text-branco/35'>
                        {chave}
                     </span>
                     <span
                        className={`text-sm font-semibold ${valor === '—' ? 'text-laranja-400/50' : 'text-branco'}`}
                     >
                        {valor}
                     </span>
                  </div>
               ))}
            </div>
         </div>

         {(status === 'erro' || status === 'sucesso') && mensagem && (
            <div
               className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border
                    ${
                       status === 'sucesso'
                          ? 'bg-green-950/50 border-green-700/30 text-green-400'
                          : 'bg-branco/5 border-branco/8 text-branco/50'
                    }`}
               role='alert'
            >
               <i
                  className={`ti shrink-0 text-sm
                        ${status === 'sucesso' ? 'ti-circle-check text-green-400' : 'ti-info-circle text-vermelho-300/80'}
                    `}
                  aria-hidden='true'
               />
               <p className='text-[11px] leading-relaxed'>{mensagem}</p>
            </div>
         )}

         <button
            type='submit'
            disabled={!pronto || status === 'loading' || status === 'sucesso'}
            className='w-full py-3 rounded-xl font-bold text-sm text-branco bg-linear-to-b from-vermelho-400 to-vermelho-500 transition-all duration-150 active:scale-[.98] disabled:opacity-30 disabled:cursor-not-allowed enabled:hover:opacity-90 flex items-center justify-center gap-2'
         >
            {status === 'loading'
               ? 'Confirmando...'
               : status === 'sucesso'
                 ? 'Agendado!'
                 : 'Confirmar reserva'}
         </button>
      </form>
   )
}
