import axios from 'axios'
const URL_API = 'http://localhost:8080/api'

export const api = axios.create({
   baseURL: URL_API,
   timeout: 10000,
   headers: {
      'Content-Type': 'application/json',
   },
})
