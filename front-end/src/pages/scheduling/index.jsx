import { useContext, useEffect, useState } from 'react'
import { api } from '../../services/API'
import { AuthContext } from '../../context/AuthContext'
import { IconPlus } from '@tabler/icons-react'
import CardAgendar from './cardAgendar/CardAgenda'
import CardSobreEvento from './cardAgendar/components/CardSobreEvento'

export default function Agendamento() {
   const { auth } = useContext(AuthContext)
   const [abrirAgendar, setAbrirAgendar] = useState(false)

   const abrirCard = () => {
      setAbrirAgendar(!abrirAgendar)
   }

   return (
      <>
         <main className='w-full h-screen flex flex-col'>
            <TextoAgenda onClick={abrirCard} />
            <Agendamentos token={auth} />
         </main>
         {abrirAgendar && <CardAgendar token={auth} onFechar={abrirCard} />}
      </>
   )
}

function TextoAgenda({ onClick }) {
   return (
      <header className='w-full px-5 md:px-7 pt-5 pb-6 bg-vermelho-600'>
         <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5'>
            <div>
               <p className='text-laranja-500 uppercase text-sm font-bold tracking-[0.15em]'>
                  Suas reservas
               </p>

               <h2 className='text-branco/90 text-3xl font-serif italic font-bold'>
                  Agendamentos
               </h2>

               <p className='text-branco/60 text-sm mt-1'>
                  Gerencie todas as suas reservas
               </p>
            </div>

            <button
               type='button'
               className='flex items-center justify-center gap-3 border border-branco/20 rounded-xl px-5 py-2.5 text-branco font-semibold transition duration-300 hover:border-laranja-500 hover:text-laranja-500 cursor-pointer'
               onClick={onClick}
            >
               <IconPlus stroke={3} />
               Novo agendamento
            </button>
         </div>
      </header>
   )
}

function Agendamentos({ token }) {
   const [agendamentos, setAgendamentos] = useState([])
   const [carregando, setCarregando] = useState(true)
   const [erro, setErro] = useState('')

   useEffect(() => {
      if (!token) {
         setCarregando(false)
         return
      }

      let ativo = true

      async function getAgendamentos() {
         try {
            setCarregando(true)
            setErro('')

            const resp = await api.get(`/agendamento/meus_agendamentos`, {
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            })

            if (ativo) {
               setAgendamentos(resp.data)
            }
         } catch (error) {
            if (ativo) {
               setErro('Não foi possível carregar seus agendamentos.')
            }
         } finally {
            if (ativo) {
               setCarregando(false)
            }
         }
      }

      getAgendamentos()

      return () => {
         ativo = false
      }
   }, [token])

   return (
      <section className='flex-1 min-h-0 px-5 md:px-7  py-3'>
         <div className='h-full flex flex-col gap-4'>
            <div
               className='w-full flex items-center gap-3
            rounded-2xl border border-white/10
            bg-vermelho-600 px-4 py-3'
            >
               <span className='text-laranja-500 text-3xl font-bold'>
                  {agendamentos.length}
               </span>

               <div className='flex flex-col text-sm text-branco/80 leading-tight'>
                  <span>agendamentos</span>
                  <span>encontrados</span>
               </div>
            </div>

            <div className='flex-1 min-h-0 overflow-y-scroll scrollbar-none flex flex-col gap-3 pr-1'>
               {carregando && (
                  <p className='text-vermelho-500/70 text-center py-8'>
                     Carregando agendamentos...
                  </p>
               )}

               {erro && <p className='text-red-400 text-center py-8'>{erro}</p>}

               {!carregando && !erro && agendamentos.length === 0 && (
                  <div className='rounded-2xl border border-white/10 bg-vermelho-600 p-8 text-center'>
                     <p className='text-branco font-semibold'>
                        Nenhum agendamento encontrado
                     </p>

                     <p className='text-branco/70 text-sm mt-2'>
                        Seus próximos agendamentos aparecerão aqui.
                     </p>
                  </div>
               )}

               {!carregando &&
                  !erro &&
                  agendamentos.map((agendamento) => (
                     <CardSobreEvento
                        key={agendamento.agendamentoId}
                        agendamento={agendamento}
                     />
                  ))}
            </div>
         </div>
      </section>
   )
}
