import axios from 'axios'

export type Page<T> = { items: T[]; page: number; size: number; totalItems: number; totalPages: number }

export type Location = {
  id: number
  name: string
  building: string
  floor: number
  status: 'OPEN' | 'CLOSED'
  description: string
}

export type Ticket = {
  id: number
  resourceId: number
  resourceName: string
  description: string
  status: 'OPEN' | 'CLOSED'
}

export const PAGE_SIZE = 5

export const api = axios.create({ baseURL: 'https://aulasoporte-api.aaron-navarro.workers.dev/api' })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && !err.config?.url?.startsWith('/auth')) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  },
)

export const errorCode = (err: unknown): string | undefined =>
  axios.isAxiosError(err) ? err.response?.data?.code : undefined

export const errorMessage = (err: unknown, fallback = 'Ocurrió un error.'): string =>
  (axios.isAxiosError(err) && err.response?.data?.message) || fallback
