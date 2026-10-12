import { useState } from 'react'
import { IconX } from '@tabler/icons-react'
import Calendario from './components/Calendario'
import TempoAgendamento from './components/TempoAgendamento'
import Mesas from './components/Mesas'
import Horarios from './components/Horarios'
import StepBloco from './components/StepBloco'
import CardAgendaFinal from './components/CardAgendaFinal'

export default function CardAgendar({ userId, onFechar }) {
   const [dataEscolhida, setDataEscolhida] = useState('')
   const [duracao, setDuracao] = useState('')
   const [mesaEscolhida, setMesaEscolhida] = useState([])
   const [horarioReservado, setHorarioReservado] = useState('')
   const [stepEditando, setStepEditando] = useState(null)

   const stepAtual =
      stepEditando ??
      (!dataEscolhida
         ? 1
         : !duracao
           ? 2
           : !mesaEscolhida.length
             ? 3
             : !horarioReservado
               ? 4
               : 5)

   const sairEdicao = () => setStepEditando(null)

   const reeditar = (step) => {
      setStepEditando(step)
      if (step <= 4) setHorarioReservado('')
      if (step <= 3) setMesaEscolhida([])
      if (step <= 2) setDuracao('')
      if (step <= 1) setDataEscolhida('')
   }

   const fmt = (d, opts) => new Date(d).toLocaleDateString('pt-BR', opts)

   const STEPS = [
      {
         numero: 1,
         titulo: 'Data da visita',
         resumo: dataEscolhida
            ? fmt(`${dataEscolhida}T12:00:00`, {
                 weekday: 'short',
                 day: '2-digit',
                 month: 'short',
                 year: 'numeric',
              })
            : null,
         completo: !!dataEscolhida,
         bloqueado: false,
         children: (
            <Calendario
               onChange={(e) => {
                  setDataEscolhida(e.target.value)
                  setDuracao('')
                  setMesaEscolhida([])
                  setHorarioReservado('')
                  sairEdicao()
               }}
            />
         ),
      },
      {
         numero: 2,
         titulo: 'Duração da reserva',
         resumo: duracao ? `${duracao / 60}h` : null,
         completo: !!duracao,
         bloqueado: !dataEscolhida,
         children: (
            <TempoAgendamento
               onChange={(v) => {
                  setDuracao(v)
                  setMesaEscolhida([])
                  setHorarioReservado('')
                  sairEdicao()
               }}
               duracaoAtual={duracao}
            />
         ),
      },
      {
         numero: 3,
         titulo: 'Escolha a mesa',
         resumo: mesaEscolhida[1] ?? null,
         completo: !!mesaEscolhida.length,
         bloqueado: !duracao,
         children: (
            <Mesas
               onClick={(m) => {
                  setMesaEscolhida(m)
                  setHorarioReservado('')
                  sairEdicao()
               }}
               mesaAtual={mesaEscolhida[0]}
            />
         ),
      },
      {
         numero: 4,
         titulo: 'Horário disponível',
         resumo: horarioReservado
            ? new Date(horarioReservado).toLocaleTimeString('pt-BR', {
                 hour: '2-digit',
                 minute: '2-digit',
              })
            : null,
         completo: !!horarioReservado,
         bloqueado: !mesaEscolhida.length,
         children: (
            <Horarios
               id={mesaEscolhida[0]}
               codigo={mesaEscolhida[1]}
               data={dataEscolhida}
               duracao={duracao}
               onClick={(h) => {
                  setHorarioReservado(h)
                  sairEdicao()
               }}
               horarioAtual={horarioReservado}
            />
         ),
      },
   ]

   return (
      <div className='absolute w-screen h-screen flex justify-center items-center bg-preto/30 backdrop-blur-xs px-2'>
         <div className='w-full max-w-md bg-vermelho-600 border border-branco/8 rounded-2xl overflow-hidden flex flex-col'>
            <div className='flex items-center justify-between px-5 py-4 bg-branco/3 border-b border-branco/[.07]'>
               <div>
                  <p className='text-[10px] tracking-[.15em] uppercase text-laranja-400/60 font-semibold'>
                     Reserva
                  </p>
                  <h2 className='font-serif text-xl italic font-bold text-branco leading-tight'>
                     Novo agendamento
                  </h2>
               </div>
               {onFechar && (
                  <button
                     type='button'
                     onClick={onFechar}
                     aria-label='Fechar'
                     className='w-7 h-7 rounded-full bg-branco/8 flex items-center justify-center text-branco/50 hover:bg-branco/15 hover:text-branco transition-all duration-150 cursor-pointer'
                  >
                     <IconX size={14} />
                  </button>
               )}
            </div>

            <StepsIndicator stepAtual={stepAtual} />

            <div className='flex flex-col gap-3 p-4 overflow-y-auto scrollbar-none max-h-[70vh]'>
               {STEPS.map(
                  ({
                     numero,
                     titulo,
                     resumo,
                     completo,
                     bloqueado,
                     children,
                  }) => (
                     <StepBloco
                        key={numero}
                        numero={numero}
                        titulo={titulo}
                        resumo={resumo}
                        ativo={stepAtual === numero}
                        completo={completo && stepAtual !== numero}
                        bloqueado={bloqueado && stepAtual !== numero}
                        onReeditar={() => reeditar(numero)}
                     >
                        {children}
                     </StepBloco>
                  ),
               )}

               <CardAgendaFinal
                  userId={userId}
                  data={dataEscolhida}
                  duracao={duracao}
                  mesa={mesaEscolhida}
                  horario={horarioReservado}
               />
            </div>
         </div>
      </div>
   )
}

function StepsIndicator({ stepAtual }) {
   return (
      <div className='flex items-center px-5 py-3 border-b border-branco/6'>
         {[1, 2, 3, 4].map((n, i) => (
            <div key={n} className='flex items-center flex-1 last:flex-none'>
               <div
                  className={`w-5.5 h-5.5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-all duration-300
                        ${n < stepAtual ? 'bg-vermelho-400 text-branco' : n === stepAtual ? 'bg-laranja-500 text-branco' : 'bg-branco/8 text-branco/30 border border-branco/10'}
                    `}
               >
                  {n < stepAtual ? (
                     <i className='ti ti-check' style={{ fontSize: 10 }} />
                  ) : (
                     n
                  )}
               </div>
               {i < 3 && (
                  <div
                     className={`flex-1 h-px mx-1 transition-colors duration-300 ${n < stepAtual ? 'bg-vermelho-400' : 'bg-branco/10'}`}
                  />
               )}
            </div>
         ))}
      </div>
   )
}
