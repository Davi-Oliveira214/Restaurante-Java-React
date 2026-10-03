import {
   IconAlertCircle,
   IconCircleCheck,
   IconEyeCheck,
   IconEyeOff,
} from '@tabler/icons-react'
import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router'
import { api } from '../../../services/API'
import { useContext } from 'react'
import { AuthContext } from '../../../context/AuthContext'

export function Login() {
   const [mensagem, setMensagem] = useState({ msg: '', tipo: '' })
   const [disabilitar, setDesabilitar] = useState(false)
   const navegate = useNavigate()

   const { setAuth } = useContext(AuthContext)

   const submitLogin = async (e) => {
      e.preventDefault()
      setDesabilitar(true)

      const formData = new FormData(e.currentTarget)

      const resp = await api
         .post('/auth/login', {
            email: formData.get('email'),
            senha: formData.get('senha'),
         })
         .then((data) => data.data)
         .catch((error) => error.response.data)

      if (resp.status >= 400) {
         setMensagem(() => ({
            msg: resp.message,
            tipo: 'error',
         }))
      } else {
         localStorage.setItem('@App:user', JSON.stringify(resp))
         setAuth(resp)
         navegate('/')
      }

      setDesabilitar(false)
   }

   return (
      <form className='w-full flex flex-col gap-4' onSubmit={submitLogin}>
         {mensagem.msg && <MensagemAviso prop={mensagem} />}
         <CampoInput id={'email'} label={'Email'} tipo={'email'} />
         <CampoSenha id={'senha'} label={'Senha'} />

         {/* <NavLink
            to='/auth/recuperar-senha'
            className='text-white/40 text-xs text-right -mt-1 hover:text-white/70 transition-colors'
         >
            Esqueceu a senha?
         </NavLink> */}

         <div className='flex flex-col gap-3 mt-2'>
            <BotaoSubmit texto='Entrar' disable={disabilitar} />
            <Separador />
            <LinkAuth texto='Criar uma conta' rota='cadastro' />
         </div>
      </form>
   )
}

export function Cadastro() {
   const [mensagem, setMensagem] = useState({ msg: '', tipo: '' })
   const [disabilitar, setDesabilitar] = useState(false)

   const submitCadastro = async (e) => {
      e.preventDefault()
      setDesabilitar(true)

      const formData = new FormData(e.currentTarget)

      if (formData.get('senha') !== formData.get('repita_senha')) {
         setMensagem(() => ({
            msg: 'As senhas não são iguais',
            tipo: 'error',
         }))

         setDesabilitar(false)
         return
      }

      const data = {
         nome: formData.get('nome'),
         email: formData.get('email'),
         senha: formData.get('senha'),
         repita_senha: formData.get('repita_senha'),
      }

      const resp = await api
         .post('/auth/cadastro', data)
         .then((data) => data.data)
         .catch((error) => error.response.data)

      if (resp.status >= 400) {
         setMensagem(() => ({
            msg: resp.message,
            tipo: 'error',
         }))
      } else {
         setMensagem(() => ({
            msg: 'Usuário cadastrado com sucesso!',
            tipo: 'ok',
         }))
      }

      setDesabilitar(false)
   }

   return (
      <form className='w-full flex flex-col gap-4' onSubmit={submitCadastro}>
         {mensagem.msg && <MensagemAviso prop={mensagem} />}
         <CampoInput id={'nome'} label={'Nome'} tipo={'text'} />
         <CampoInput id={'email'} label={'Email'} tipo={'email'} />
         <CampoSenha id={'senha'} label={'Senha'} />
         <CampoSenha id={'repita_senha'} label={'Repita a senha'} />

         <div className='flex flex-col gap-3 mt-2'>
            <BotaoSubmit texto='Criar conta' disable={disabilitar} />
            <Separador />
            <LinkAuth texto='Já tenho uma conta' rota='login' />
         </div>
      </form>
   )
}

function CampoInput({ id, label, tipo }) {
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
      <div className='flex flex-col'>
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
      </div>
   )
}

function BotaoSubmit({ texto, disable }) {
   return (
      <button
         type='submit'
         className={`w-full py-2.5 rounded-xl font-semibold text-sm text-white bg-linear-to-b from-vermelho-300 to-vermelho-400 hover:from-vermelho-300/90 hover:to-vermelho-400/90 active:scale-[0.98] transition-all duration-150 ${disable ? 'opacity-45' : ''}`}
         disabled={disable}
      >
         {!disable ? texto : 'Carregando...'}
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

function MensagemAviso({ prop }) {
   const { msg, tipo } = prop
   const Icone = tipo === 'ok' ? IconCircleCheck : IconAlertCircle

   return (
      <div
         role='alert'
         className='flex items-start gap-2.5 -mt-1 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10'
      >
         <span className='text-vermelho-500/90 my-auto shrink-0'>
            <Icone size={34} />
         </span>
         <p className='text-white/55 text-xs leading-relaxed my-auto'>{msg}</p>
      </div>
   )
}
