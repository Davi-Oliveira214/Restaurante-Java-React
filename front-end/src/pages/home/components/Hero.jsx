import Carrossel from './Carrossel.jsx'
import Banner from './Banner.jsx'

export default function Hero() {
   return (
      <section className='flex flex-col w-full'>
         <Banner />
         <Carrossel />
      </section>
   )
}
