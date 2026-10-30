import Card from './Card.jsx'
import { api } from '../../../services/API.js'
import { useEffect, useState } from 'react'

export default function Carrossel() {
   const [resp, setResp] = useState([])
   const [pausado, setPausado] = useState(false)

   useEffect(() => {
      api.get('/pratos').then((res) => setResp(res.data))
   }, [])

   return (
      <section className='flex flex-1 overflow-hidden'>
         <ul
            className={`flex gap-2 px-4 py-3 animate-carrossel ${pausado ? '[animation-play-state:paused]' : ''}`}
         >
            {resp.map((prato) => (
               <li key={prato.id} className='shrink-0'>
                  <Card {...prato} onAbrirCard={setPausado} />
               </li>
            ))}
            {resp.map((prato) => (
               <li key={`clone-${prato.id}`} className='shrink-0'>
                  <Card {...prato} onAbrirCard={setPausado} />
               </li>
            ))}
         </ul>
      </section>
   )
}
