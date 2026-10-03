import Card from './Card.jsx'
import { api } from '../../services/API.js'
import { useEffect, useState } from 'react'

export default function Carrossel() {
   const [resp, setResp] = useState([])

   useEffect(() => {
      const request = async () => {
         const res = await api.get('/pratos')
         const data = await res.data
         setResp(data)
      }
      request()
   }, [])

   return (
      <section className='flex flex-1 overflow-hidden'>
         <ul className='flex gap-2 px-4 py-3 animate-carrossel'>
            {resp.map((prato) => (
               <li key={prato.id} className='shrink-0'>
                  <Card
                     nome={prato.nome}
                     descricao={prato.descricao}
                     preco={prato.preco}
                     data={prato.data}
                  />
               </li>
            ))}
            {resp.map((prato) => (
               <li key={prato.id} className='shrink-0'>
                  <Card
                     nome={prato.nome}
                     descricao={prato.descricao}
                     preco={prato.preco}
                     data={prato.data}
                  />
               </li>
            ))}
         </ul>
      </section>
   )
}
