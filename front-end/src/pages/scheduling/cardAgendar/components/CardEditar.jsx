import { useState } from 'react'
import { IconX } from '@tabler/icons-react'
import Calendario from './Calendario'
import TempoAgendamento from './TempoAgendamento'
import Mesas from './Mesas'

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

   const salvarEdicao = async () => {}

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
                  <label className='text-[10px] font-semibold uppercase text-branco/40'>
                     Data
                  </label>
                  <Calendario
                     onChange={(e) => setNovaData(e.target.value)}
                     value={data}
                  />
               </div>

               <div className='flex flex-col gap-1.5'>
                  <label className='text-[10px] font-semibold uppercase text-branco/40'>
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

               <button
                  type='button'
                  onClick={salvarEdicao}
                  className='w-full py-3 rounded-xl font-bold text-sm text-branco bg-linear-to-b from-vermelho-400 to-vermelho-500 hover:opacity-90 active:scale-[.98] transition-all duration-150'
               >
                  Salvar alterações
               </button>
            </div>
         </div>
      </div>
   )
}
