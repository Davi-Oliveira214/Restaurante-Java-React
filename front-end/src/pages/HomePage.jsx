import Hero from '../components/Hero.jsx'
import { apresentar } from '../data/apresentacao.js'

export function HomePage() {
   return (
      <div className='flex flex-1 overflow-hidden flex-col'>
         <Hero />
         <main className='flex flex-col '>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-px bg-vermelho-400'>
               {apresentar.map((item) => (
                  <CardApresentacao
                     key={item.titulo}
                     Icone={item.Icone}
                     tag={item.tag}
                     titulo={item.titulo}
                     texto={item.texto}
                     badge={item.badge}
                  />
               ))}
            </div>
         </main>
      </div>
   )
}

function CardApresentacao({ Icone, tag, titulo, texto, badge }) {
   return (
      <article className='relative flex flex-col gap-2.5 h-70 w-full bg-vermelho-600 px-5 py-7 overflow-hidden transition-colors duration-200'>
         <Icone size={28} color='rgba(255,255,255,0.55)' />

         <div>
            <p className='text-[10px] font-semibold tracking-widest uppercase text-laranja-400/60 mb-1'>
               {tag}
            </p>
            <h2 className='relative font-serif text-lg italic font-bold w-max text-laranja-400 after:absolute after:w-[65%] after:h-0.5 after:-bottom-1 after:left-0 after:bg-laranja-500 after:opacity-70'>
               {titulo}
            </h2>
         </div>

         <p className='flex-1 text-sm leading-relaxed text-branco/55 text-justify mt-1'>
            {texto}
         </p>

         <span className='self-start text-[10px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full bg-laranja-400/10 text-laranja-400/75 border border-laranja-400/20 mt-auto'>
            {badge}
         </span>
      </article>
   )
}
