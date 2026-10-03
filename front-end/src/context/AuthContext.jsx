// createContext serve para criar um contexto
import { createContext, useState } from 'react'

export const AuthContext = createContext()

// Proveider, é o que gerência todos os itens que vão utilizar o contexto
export const AuthProveider = ({ children }) => {
   const [auth, setAuth] = useState(() => {
      const user = localStorage.getItem('@App:user')
      return user ? JSON.parse(user) : null
   })

   return (
      <AuthContext.Provider value={{ auth, setAuth }}>
         {children}
      </AuthContext.Provider>
   )
}
