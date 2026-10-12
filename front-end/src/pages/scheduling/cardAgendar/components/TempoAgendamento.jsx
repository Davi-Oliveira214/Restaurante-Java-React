const TEMPOS = [
   { texto: '1h', minutos: 60 },
   { texto: '1h30', minutos: 90 },
   { texto: '2h', minutos: 120 },
   { texto: '2h30', minutos: 150 },
   { texto: '3h', minutos: 180 },
]

export default function TempoAgendamento({ onChange, duracaoAtual }) {
   return (
      <div className='flex gap-2 flex-wrap'>
         {TEMPOS.map(({ texto, minutos }) => (
            <button
               key={texto}
               type='button'
               onClick={() => onChange(minutos)}
               className={`px-3.5 py-1.5 rounded-lg border text-xs font-bold transition-all duration-150
                        ${
                           duracaoAtual === minutos
                              ? 'bg-vermelho-400/35 border-vermelho-400 text-branco'
                              : 'bg-branco/5 border-branco/10 text-branco/50 hover:border-branco/20 hover:text-branco'
                        }`}
            >
               {texto}
            </button>
         ))}
      </div>
   )
}
