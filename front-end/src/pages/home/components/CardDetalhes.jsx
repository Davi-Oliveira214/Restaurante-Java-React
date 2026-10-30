import { createPortal } from 'react-dom'
import { Agendar } from './Buttons'

export default function CardDetalhes({
   nome,
   descricao,
   img,
   preco,
   data,
   onFechar,
}) {
   return createPortal(
      <div
         className='fixed inset-0 z-9999 flex items-center justify-center p-4 bg-preto-azulado/55 backdrop-blur-sm'
         onClick={onFechar}
      >
         <div
            className='w-full max-w-sm bg-branco rounded-3xl overflow-hidden shadow-2xl'
            onClick={(e) => e.stopPropagation()}
         >
            <div className='relative w-full h-56 overflow-hidden'>
               <img
                  src={img}
                  alt={`Foto do prato: ${nome}`}
                  className='w-full h-full object-cover'
               />
               <div
                  className='absolute inset-0 bg-linear-to-t from-preto-azulado/90 to-transparent'
                  aria-hidden='true'
               ></div>

               <span className='absolute top-3 right-3 bg-laranja-500 text-branco text-[10px] font-bold tracking-wide px-2.5 py-1 rounded-full'>
                  Popular
               </span>

               <button
                  type='button'
                  onClick={onFechar}
                  aria-label='Fechar'
                  className='absolute top-3 left-3 w-8 h-8 rounded-full bg-preto/35 backdrop-blur-sm flex items-center justify-center text-branco text-sm hover:bg-preto/55 transition-all duration-150'
               >
                  <i className='ti ti-x' aria-hidden='true' />
               </button>

               <div className='absolute bottom-3 left-4 right-4'>
                  <h3 className='font-serif text-2xl italic font-bold text-branco leading-tight'>
                     {nome}
                  </h3>
                  <p className='text-[11px] text-branco/60 mt-0.5'>
                     Prato principal
                  </p>
               </div>
            </div>

            <div className='flex flex-col gap-4 px-5 py-5'>
               <div className='flex items-center justify-between'>
                  <span className='font-serif text-2xl font-bold text-vermelho-500'>
                     R$ {preco}
                  </span>
                  <span className='text-[10px] italic text-cinza bg-cinza/20 px-2 py-1 rounded-md'>
                     {data ? `Disponível até: ${data}` : 'Sem data limite'}
                  </span>
               </div>

               <div className='h-px bg-cinza/30' aria-hidden='true' />

               <p className='text-[13px] text-gray-500 leading-relaxed'>
                  {descricao}
               </p>

               <div className='flex gap-2 flex-wrap'>
                  {[
                     { icone: 'ti-clock', texto: '~45 min' },
                     { icone: 'ti-users', texto: '1 pessoa' },
                     { icone: 'ti-flame', texto: '820 kcal' },
                  ].map(({ icone, texto }) => (
                     <span
                        key={texto}
                        className='flex items-center gap-1.5 text-[11px] font-semibold text-gray-500 bg-gray-50 border border-gray-100 px-2.5 py-1.5 rounded-lg'
                     >
                        <i
                           className={`ti ${icone} text-vermelho-400`}
                           aria-hidden='true'
                        />
                        {texto}
                     </span>
                  ))}
               </div>

               <Agendar />
            </div>
         </div>
      </div>,
      document.getElementById('portal'),
   )
}
