export default function Calendario({ onChange, value }) {
   const date = value
      ? new Date(value).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0]

   return (
      <div className='flex flex-col gap-1.5'>
         <label
            htmlFor='calendario'
            className='text-[10px] font-semibold uppercase tracking-widest text-branco/40'
         >
            Selecione a data
         </label>
         <input
            id='calendario'
            name='calendario'
            type='date'
            value={date}
            onChange={onChange}
            min={new Date().toISOString().split('T')[0]}
            className='w-full bg-branco/6 border border-branco/10 rounded-xl px-4 py-2.5 text-branco text-sm outline-none focus:border-laranja-400/50 transition-all duration-200 scheme-dark'
         />
      </div>
   )
}
