const button = 'font-bold text-[1rem] p-1 text-preto border-2 border-preto rounded-sm cursor-pointer duration-300 transition-all ease-in hover:bg-[var(--cor-btn)] hover:-translate-y-1'

export function Agendar() {
    return (
        <button type='button' className={`${button} bg-green-800 [--cor-btn:#00a63e]`}>Agendar</button>
    )
}

export function Detalhes() {
    return (
        <button type='button' className={`${button} bg-laranja-500 [--cor-btn:#faa307]`}>Detalhes</button>
    )
}