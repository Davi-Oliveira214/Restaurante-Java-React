import { useState } from 'react'
import { IconX } from '@tabler/icons-react'
import Calendario from './Calendario'
import Mesas from './Mesas'
import { api } from '../../../../services/API'

const TEMPOS = [
   { texto: '1h', minutos: 60 },
   { texto: '1h30', minutos: 90 },
   { texto: '2h', minutos: 120 },
   { texto: '2h30', minutos: 150 },
   { texto: '3h', minutos: 180 },
]

export default function CardEditar({ agendamento, token, onFechar }) {
   const { agendamentoId, data, duracao, mesa } = agendamento

   const dataInicial = new Date(data).toISOString().split('T')[0]
   const [novaData, setNovaData] = useState(dataInicial)
   const [novaDuracao, setNovaDuracao] = useState(Number(duracao))
   const [novaMesa, setNovaMesa] = useState([mesa?.id, mesa?.codigo_mesa])
   const [status, setStatus] = useState('idle')

   const salvarEdicao = async () => {
      setStatus('loading')
      try {
         const horaOriginal = new Date(data).toTimeString().slice(0, 8)
         const dataComHora = `${novaData}T${horaOriginal}`

         await api.put(
            `/agendamento/${agendamentoId}`,
            { data: dataComHora, duracao: novaDuracao, mesa: novaMesa[0] },
            { headers: { Authorization: `Bearer ${token}` } },
         )
         setStatus('sucesso')
      } catch {
         setStatus('erro')
      }
   }

   return (
      <div
         className='fixed inset-0 z-100 flex items-center justify-center bg-preto-azulado/60 backdrop-blur-sm px-2 py-2'
         onClick={onFechar}
      >
         <div
            className='w-full max-w-sm bg-vermelho-600 border border-branco/8 rounded-2xl overflow-hidden'
            onClick={(e) => e.stopPropagation()}
         >
            <div className='flex items-center justify-between px-5 py-4 bg-branco/3 border-b border-branco/[.07]'>
               <div>
                  <p className='text-[10px] tracking-[.15em] uppercase text-laranja-400/60 font-semibold'>
                     Editar reserva
                  </p>
                  <h2 className='font-serif text-xl italic font-bold text-branco leading-tight'>
                     Alterar agendamento
                  </h2>
               </div>
               <button
                  type='button'
                  onClick={onFechar}
                  aria-label='Fechar'
                  className='w-7 h-7 rounded-full bg-branco/8 flex items-center justify-center text-branco/50 hover:bg-branco/15 hover:text-branco transition-all duration-150'
               >
                  <IconX size={14} />
               </button>
            </div>

            <div className='flex flex-col gap-4 p-5'>
               <div className='flex flex-col gap-1.5'>
                  <label className='text-[10px] font-semibold uppercase tracking-widest text-branco/40'>
                     Data
                  </label>
                  <Calendario
                     value={novaData}
                     onChange={(e) => setNovaData(e.target.value)}
                  />
               </div>

               <div className='flex flex-col gap-1.5'>
                  <label className='text-[10px] font-semibold uppercase tracking-widest text-branco/40'>
                     Duração
                  </label>
                  <div className='flex gap-2 flex-wrap'>
                     {TEMPOS.map(({ texto, minutos }) => (
                        <button
                           key={texto}
                           type='button'
                           onClick={() => setNovaDuracao(minutos)}
                           className={`px-3.5 py-1.5 rounded-lg border text-xs font-bold transition-all duration-150
                                        ${
                                           novaDuracao === minutos
                                              ? 'bg-vermelho-400/35 border-vermelho-400 text-branco'
                                              : 'bg-branco/5 border-branco/10 text-branco/50 hover:border-branco/20 hover:text-branco'
                                        }`}
                        >
                           {texto}
                        </button>
                     ))}
                  </div>
               </div>

               <div className='flex flex-col gap-1.5'>
                  <label className='text-[10px] font-semibold uppercase tracking-widest text-branco/40'>
                     Mesa
                  </label>
                  <Mesas onClick={setNovaMesa} mesaAtual={novaMesa[0]} />
               </div>

               <div className='h-px bg-branco/6' aria-hidden='true' />

               {status === 'sucesso' && (
                  <div
                     className='flex items-center gap-2 px-3 py-2.5 rounded-lg bg-green-950/50 border border-green-700/30'
                     role='alert'
                  >
                     <i
                        className='ti ti-circle-check text-green-400 text-sm shrink-0'
                        aria-hidden='true'
                     />
                     <p className='text-[11px] text-green-400'>
                        Agendamento atualizado com sucesso!
                     </p>
                  </div>
               )}

               {status === 'erro' && (
                  <div
                     className='flex items-center gap-2 px-3 py-2.5 rounded-lg bg-branco/5 border border-branco/8'
                     role='alert'
                  >
                     <i
                        className='ti ti-info-circle text-vermelho-300/80 text-sm shrink-0'
                        aria-hidden='true'
                     />
                     <p className='text-[11px] text-branco/50'>
                        Erro ao salvar. Tente novamente.
                     </p>
                  </div>
               )}

               <button
                  type='button'
                  onClick={salvarEdicao}
                  disabled={status === 'loading' || status === 'sucesso'}
                  className='w-full py-3 rounded-xl font-bold text-sm text-branco bg-linear-to-b from-vermelho-400 to-vermelho-500 hover:opacity-90 active:scale-[.98] transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed'
               >
                  {status === 'loading' && (
                     <svg
                        className='animate-spin w-4 h-4'
                        viewBox='0 0 24 24'
                        fill='none'
                        aria-hidden='true'
                     >
                        <circle
                           className='opacity-25'
                           cx='12'
                           cy='12'
                           r='10'
                           stroke='currentColor'
                           strokeWidth='4'
                        />
                        <path
                           className='opacity-75'
                           fill='currentColor'
                           d='M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z'
                        />
                     </svg>
                  )}
                  {status === 'loading'
                     ? 'Salvando...'
                     : status === 'sucesso'
                       ? 'Salvo!'
                       : 'Salvar alterações'}
               </button>
            </div>
         </div>
      </div>
   )
}
