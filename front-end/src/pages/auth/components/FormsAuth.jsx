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
      <form className='w-full flex flex-col py-2 gap-3'>
         {camposLogin.map((campo) => (
            <CampoInput key={campo.id} {...campo} />
         ))}
         <div className='grid grid-rows-2 gap-2 mt-3.5'>
            <BotaoSubmit texto='Entrar' />
            <p className='text-branco text-center'>ou</p>
            <LinkAuth texto='Criar uma conta' rota='cadastro' />
         </div>
      </form>
   )
}

export function Cadastro() {
   return (
      <form className='w-full flex flex-col py-2 gap-3'>
         {camposCadastro.map((campo) => (
            <CampoInput key={campo.id} {...campo} />
         ))}
         <div className='grid grid-rows-2 gap-0.5 mt-3.5'>
            <BotaoSubmit texto='Criar conta' />
            <p className='text-branco text-center text-sm'>ou</p>
            <LinkAuth texto='Login' rota='login' />
         </div>
      </form>
   )
}

function CampoInput({ id, label, tipo }) {
   if (tipo === 'password') return <CampoSenha id={id} label={label} />
   return (
      <div className='flex flex-col'>
         <label
            htmlFor={id}
            className='text-branco/90 text-lg font-medium ml-1.5'
         >
            {label}
         </label>
         <input
            type={tipo}
            name={id}
            id={id}
            autoComplete='username'
            required
            className='border-2 rounded-2xl px-3 py-1 outline-none text-branco'
         />
      </div>
   )
}

function CampoSenha({ id, label }) {
   const [visivel, setVisivel] = useState(false)
   const Icone = visivel ? IconEyeCheck : IconEyeOff

   return (
      <div className='flex flex-col'>
         <label
            htmlFor={id}
            className='text-branco/90 text-lg font-medium ml-1.5'
         >
            {label}
         </label>
         <div className='border-2 rounded-2xl text-branco flex items-center overflow-hidden'>
            <input
               type={visivel ? 'text' : 'password'}
               name={id}
               id={id}
               autoComplete='new-password'
               required
               className='outline-none w-full px-3 py-1'
            />
            <button
               type='button'
               onClick={() => setVisivel((prev) => !prev)}
               className='mr-2'
            >
               <Icone width={30} />
            </button>
         </div>
      </div>
   )
}

function BotaoSubmit({ texto }) {
   return (
      <button
         type='submit'
         className='bg-vermelho-600 text-branco rounded-lg text-center py-1.5 font-bold'
      >
         {texto}
      </button>
   )
}

function LinkAuth({ texto, rota }) {
   return (
      <NavLink
         to={`../${rota}`}
         className='text-branco rounded-lg text-center py-1.5 font-bold border-2 border-vermelho-400'
      >
         {texto}
      </NavLink>
   )
}
