import api from './axios'

export async function login(credentials) {
  const response = await api.post('/login', credentials)

  const { token, user } = response.data

  localStorage.setItem('token', token)
  localStorage.setItem('user', JSON.stringify(user))

  return response.data
}

export async function register(payload) {
  const response = await api.post('/register', payload)

  const { token, user } = response.data

  localStorage.setItem('token', token)
  localStorage.setItem('user', JSON.stringify(user))

  return response.data
}

export async function logout() {
  try {
    await api.post('/logout')
  } finally {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }
}

export async function getCurrentUser() {
  const response = await api.get('/user')

  localStorage.setItem(
    'user',
    JSON.stringify(response.data.user),
  )

  return response.data.user
}