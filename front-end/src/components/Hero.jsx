import Carrossel from '../components/util/Carrossel.jsx'
import Banner from '../components/util/Banner.jsx'

export default function Hero() {
   return (
      <section className='flex flex-col w-full'>
         <Banner />
         <Carrossel />
      </section>
   )
}
