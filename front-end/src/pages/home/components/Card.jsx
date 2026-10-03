import imagem from '../../../assets/imgs/banner.png'
import { Agendar, Detalhes } from './Buttons.jsx'

export default function Card({ nome, descricao, preco, data }) {
   return (
      <article className='min-w-65 h-auto rounded-xl overflow-hidden border-2 border-vermelho-600 bg-branco transition-all duration-300 ease-in hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(56,4,14,0.18)]'>
         <div className='relative w-full h-36 overflow-hidden'>
            <img
               src={imagem}
               alt={`Foto do prato: ${nome}`}
               className='w-full h-full object-cover'
            />
            <span className='absolute top-2 right-2 bg-laranja-500 text-branco text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded-full'>
               Popular
            </span>
         </div>

         <div className='flex flex-col gap-1.5 p-3.5'>
            <h2 className='font-serif text-xl font-bold text-preto-azulado leading-tight'>
               {nome}
            </h2>
            <p className='text-xs text-gray-500 leading-relaxed'>{descricao}</p>

            <div className='flex items-center justify-between mt-1'>
               <p className='text-base font-bold text-vermelho-500'>
                  R$ {preco}
               </p>
               <p className='text-[10px] text-cinza italic'>
                  {data ? `Disponível até: ${data}` : 'Sem data limite'}
               </p>
            </div>

            <div className='grid grid-cols-2 gap-2 mt-2'>
               <Detalhes />
               <Agendar />
            </div>
         </div>
      </article>
   )
}
