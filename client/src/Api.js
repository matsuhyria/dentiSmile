import axios from 'axios'

export const Api = axios.create({
  baseURL: import.meta.env.VITE_API_ENDPOINT || 'http://localhost:5000/api/v1',
  withCredentials: true
})
