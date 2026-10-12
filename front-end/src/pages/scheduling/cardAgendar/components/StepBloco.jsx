export default function StepBloco({
   numero,
   titulo,
   resumo,
   ativo,
   completo,
   bloqueado,
   children,
   onReeditar,
}) {
   return (
      <div
         className={`border rounded-xl transition-all duration-200
            ${bloqueado ? 'border-branco/5 opacity-40 pointer-events-none' : 'border-branco/8'}
        `}
      >
         <div
            className={`flex items-center gap-2 px-3.5 py-2.5 bg-branco/4 border-b border-branco/6
                    ${completo ? 'cursor-pointer hover:bg-branco/8 transition-colors duration-150' : ''}
                `}
            onClick={completo && onReeditar ? onReeditar : undefined}
         >
            <div
               className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0
                    ${completo ? 'bg-vermelho-400 text-branco' : 'bg-vermelho-500 text-branco/70'}
                `}
            >
               {completo ? (
                  <i className='ti ti-check' style={{ fontSize: 10 }} />
               ) : (
                  numero
               )}
            </div>

            <span className='text-[11px] font-semibold text-branco/70 tracking-[.03em]'>
               {titulo}
            </span>

            {resumo && (
               <span className='ml-auto text-[11px] font-semibold text-laranja-400'>
                  {resumo}
               </span>
            )}

            {completo && onReeditar && (
               <i
                  className='ti ti-pencil text-branco/25 text-[11px] ml-1 hover:text-branco/60'
                  aria-hidden='true'
               />
            )}
         </div>

         {(ativo || (!completo && !bloqueado)) && (
            <div className='p-3.5'>{children}</div>
         )}
      </div>
   )
}
