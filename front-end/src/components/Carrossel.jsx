import Card from './Card.jsx'
import { getPratos } from '../services/API'
import { useEffect, useState } from 'react'

export default function Carrossel() {
   const [resp, setResp] = useState([])

   // useEffect(() => {
   //     const request = async () => {
   //         const res = await getPratos()
   //         setResp(res)
   //     }
   //     request()
   // }, [])

   return (
      <section
         aria-label='Carrossel de pratos'
         className='group relative w-full flex items-center overflow-x-clip'
      >
         <ButtonSeta dir='left' />

         <ul
            role='list'
            className='flex w-full h-full items-center gap-3.5 py-4 px-3 overflow-x-scroll scrollbar-none list-none'
         >
            {/* {resp.map((prato) => (
                    <li key={prato.id}>
                        <Card nome={prato.nome} descricao={prato.descricao} preco={prato.preco} data={prato.data} />
                    </li>
                ))} */}

            <li>
               <Card
                  data=''
                  descricao='A melhor feijoada'
                  nome='Feijoada'
                  preco={50}
               />
            </li>
         </ul>

         <ButtonSeta dir='right' />
      </section>
   )
}

function ButtonSeta({ dir }) {
   const isLeft = dir === 'left'
   const position = isLeft ? 'left-2 [--seta:-43px]' : 'right-2 [--seta:43px]'

   const style =
      'z-50 absolute top-1/2 -translate-y-1/2 px-4 pb-3 pt-1 rounded-full flex items-center justify-center opacity-0 sm:group-hover:opacity-100 bg-vermelho-400 border-2 border-vermelho-600 text-branco text-2xl leading-none cursor-pointer transition-all duration-200 hover:bg-vermelho-600 focus-visible:outline-2 focus-visible:outline-branco sm:group-hover:animate-setas'

   return (
      <button
         type='button'
         aria-label={isLeft ? 'Prato anterior' : 'Próximo prato'}
         className={`${style} ${position}`}
      >
         {isLeft ? '‹' : '›'}
      </button>
   )
}
