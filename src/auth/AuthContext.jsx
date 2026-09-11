import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'

import {
  getCurrentUser,
  login as loginApi,
  register as registerApi,
  logout as logoutApi,
} from '../api/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user')

    try {
      return storedUser ? JSON.parse(storedUser) : null
    } catch {
      localStorage.removeItem('user')
      return null
    }
  })

  const [loading, setLoading] = useState(true)

  // Menandai request auth terakhir agar request lama
  // tidak boleh menimpa hasil login/register terbaru.
  const authVersion = useRef(0)

  useEffect(() => {
    let cancelled = false

    async function restoreSession() {
      const token = localStorage.getItem('token')

      if (!token) {
        if (!cancelled) {
          setLoading(false)
        }

        return
      }

      const currentVersion = authVersion.current

      try {
        const currentUser = await getCurrentUser()

        if (
          cancelled ||
          currentVersion !== authVersion.current
        ) {
          return
        }

        setUser(currentUser)
      } catch {
        if (
          cancelled ||
          currentVersion !== authVersion.current
        ) {
          return
        }

        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setUser(null)
      } finally {
        if (
          !cancelled &&
          currentVersion === authVersion.current
        ) {
          setLoading(false)
        }
      }
    }

    restoreSession()

    return () => {
      cancelled = true
    }
  }, [])

  /**
   * Login user.
   */
  async function login(credentials) {
    // Membatalkan secara logis request restore yang lebih lama.
    authVersion.current += 1

    const data = await loginApi(credentials)

    setUser(data.user)
    setLoading(false)

    return data
  }

  /**
   * Register masyarakat.
   */
  async function register(credentials) {
    // Membatalkan secara logis request restore yang lebih lama.
    authVersion.current += 1

    const data = await registerApi(credentials)

    setUser(data.user)
    setLoading(false)

    return data
  }

  /**
   * Logout user.
   */
  async function logout() {
    // Invalidate semua auth operation lama.
    authVersion.current += 1

    try {
      await logoutApi()
    } finally {
      setUser(null)
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: Boolean(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error(
      'useAuth harus digunakan di dalam AuthProvider',
    )
  }

  return context
}
