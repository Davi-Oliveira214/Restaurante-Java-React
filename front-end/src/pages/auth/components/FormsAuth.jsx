import { IconEyeCheck, IconEyeOff } from '@tabler/icons-react'
import { useState } from 'react'
import { NavLink } from 'react-router'

const camposLogin = [
   { id: 'email', label: 'Email', tipo: 'email' },
   { id: 'senha', label: 'Senha', tipo: 'password' },
]

const camposCadastro = [
   { id: 'nome', label: 'Nome', tipo: 'text' },
   { id: 'email', label: 'Email', tipo: 'email' },
   { id: 'senha', label: 'Senha', tipo: 'password' },
   { id: 'repita_senha', label: 'Repita a senha', tipo: 'password' },
]

export function Login() {
   return (
      <form className='w-full flex flex-col gap-4'>
         {camposLogin.map((campo) => (
            <CampoInput key={campo.id} {...campo} />
         ))}

         <a
            href='#'
            className='text-white/40 text-xs text-right -mt-1 hover:text-white/70 transition-colors'
         >
            Esqueceu a senha?
         </a>

         <div className='flex flex-col gap-3 mt-2'>
            <BotaoSubmit texto='Entrar' />
            <Separador />
            <LinkAuth texto='Criar uma conta' rota='cadastro' />
         </div>
      </form>
   )
}

export function Cadastro() {
   return (
      <form className='w-full flex flex-col gap-4'>
         {camposCadastro.map((campo) => (
            <CampoInput key={campo.id} {...campo} />
         ))}
         <div className='flex flex-col gap-3 mt-2'>
            <BotaoSubmit texto='Criar conta' />
            <Separador />
            <LinkAuth texto='Já tenho uma conta' rota='login' />
         </div>
      </form>
   )
}

function CampoInput({ id, label, tipo }) {
   if (tipo === 'password') return <CampoSenha id={id} label={label} />
   return (
      <div className='flex flex-col gap-1.5'>
         <label
            htmlFor={id}
            className='text-white/60 text-xs font-medium uppercase tracking-wider ml-0.5'
         >
            {label}
         </label>
         <input
            type={tipo}
            name={id}
            id={id}
            autoComplete='username'
            required
            className='bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/20 outline-none focus:border-vermelho-300/60 focus:bg-white/8 transition-all duration-200'
         />
      </div>
   )
}

function CampoSenha({ id, label }) {
   const [visivel, setVisivel] = useState(false)
   const Icone = visivel ? IconEyeCheck : IconEyeOff

   return (
      <div className='flex flex-col gap-1.5'>
         <label
            htmlFor={id}
            className='text-white/60 text-xs font-medium uppercase tracking-wider ml-0.5'
         >
            {label}
         </label>
         <div className='bg-white/5 border border-white/10 rounded-xl flex items-center overflow-hidden focus-within:border-vermelho-300/60 focus-within:bg-white/8 transition-all duration-200'>
            <input
               type={visivel ? 'text' : 'password'}
               name={id}
               id={id}
               autoComplete='new-password'
               required
               className='outline-none w-full bg-transparent px-4 py-2.5 text-white text-sm'
            />
            <button
               type='button'
               onClick={() => setVisivel((prev) => !prev)}
               className='px-3 text-white/30 hover:text-white/70 transition-colors'
            >
               <Icone size={18} />
            </button>
         </div>
      </div>
   )
}

function BotaoSubmit({ texto }) {
   return (
      <button
         type='submit'
         className='w-full py-2.5 rounded-xl font-semibold text-sm text-white bg-linear-to-b from-vermelho-300 to-vermelho-400 hover:from-vermelho-300/90 hover:to-vermelho-400/90 active:scale-[0.98] transition-all duration-150'
      >
         {texto}
      </button>
   )
}

function Separador() {
   return (
      <div className='flex items-center gap-3'>
         <span className='flex-1 h-px bg-white/10' />
         <span className='text-white/25 text-xs'>ou</span>
         <span className='flex-1 h-px bg-white/10' />
      </div>
   )
}

function LinkAuth({ texto, rota }) {
   return (
      <NavLink
         to={`../${rota}`}
         className='w-full py-2.5 rounded-xl font-medium text-sm text-white/60
                     border border-white/10 text-center
                     hover:border-white/20 hover:text-white/90
                     transition-all duration-150'
      >
         {texto}
      </NavLink>
   )
}
