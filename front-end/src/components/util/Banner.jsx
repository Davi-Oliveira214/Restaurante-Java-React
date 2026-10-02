import bannerImg from '../../assets/imgs/banner.png'

export default function Banner() {
   return (
      <header className='relative flex justify-center items-center w-full h-90 overflow-hidden'>
         <img
            src={bannerImg}
            alt='Banner do restaurante'
            className='w-full h-full object-cover'
         />

         <div className='bg-vermelho-600/55 inset-0 z-10 absolute'></div>

         <div className='absolute z-20 flex flex-col items-center gap-2 text-center px-4'>
            <h1 className='font-serif text-5xl md:text-7xl italic font-bold text-branco leading-none'>
               Bem <span className='text-laranja-400'>Vindo</span>
            </h1>
            <p className='text-branco/60 text-sm tracking-wide'>
               Sabor que conta histórias
            </p>
         </div>

         <p className='flex flex-col z-30 items-center absolute bottom-2 right-5 italic font-medium text-laranja-400/75 text-lg'>
            <span>React</span>&<span>Spring boot</span>
         </p>
      </header>
   )
}
