import { createContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'

interface User {
  id: string
  username: string
  email: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (username: string, email: string, password: string) => Promise<void>
  logout: () => void
  checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export { AuthContext }

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/v1/users', {
        credentials: 'include',
      })
      if (res.ok) {
        const data = await res.json()
        // If we can access protected route, we're logged in
        // But we need actual user data, so this is a workaround
        // In production you'd have a /me endpoint
        if (data.data && data.data.length > 0) {
          // For now, we'll just set a flag that we're authenticated
          // but don't have user details until login
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    const res = await fetch('/api/v1/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    })

    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.message || 'Login failed')
    }

    const data = await res.json()
    setUser(data.user)
  }

  const signup = async (username: string, email: string, password: string) => {
    const res = await fetch('/api/v1/users/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username, email, password }),
    })

    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.message || 'Signup failed')
    }

    // After signup, auto-login
    await login(email, password)
  }

  const logout = () => {
    setUser(null)
    // In production, you'd call a logout endpoint to destroy the session
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  )
}
