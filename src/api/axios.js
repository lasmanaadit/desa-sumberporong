import axios from 'axios'

export const BACKEND_URL = 'https://spbe-production.up.railway.app'
const api = axios.create({
  baseURL: 'https://spbe-production.up.railway.app/api',
  headers: {
    Accept: 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }

    if (error.response?.status === 403) {
      if (
        error.response?.data?.message ===
        'Akun Anda sedang dinonaktifkan.'
      ) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  },
)

export default api