import axios from 'axios'
const URL_API = import.meta.env.VITE_API_URL

export const api = axios.create({
   baseURL: URL_API,
   timeout: 10000,
   headers: {
      'Content-Type': 'application/json',
   },
})
