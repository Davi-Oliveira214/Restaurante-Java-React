import Carrossel from '../components/Carrossel.jsx'
import Banner from '../components/Banner.jsx'

export default function Hero() {
   return (
      <section className='flex flex-col'>
         <Banner />
         <Carrossel />
      </section>
   )
}
