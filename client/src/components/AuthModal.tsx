import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

interface AuthModalProps {
  onClose: () => void
}

export default function AuthModal({ onClose }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, signup } = useAuth()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (mode === 'login') {
        await login(email, password)
      } else {
        await signup(username, email, password)
      }
      onClose()
    } catch (err: unknown) {
      const error = err as Error
      setError(error.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn" onClick={onClose}>
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl animate-slideUp" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-6">{mode === 'login' ? 'Login' : 'Sign Up'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
          />
          {error && <div className="px-4 py-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">{error}</div>}
          <button type="submit" disabled={loading} className="w-full px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
            {loading ? 'Processing...' : mode === 'login' ? 'Login' : 'Sign Up'}
          </button>
        </form>
        <button
          className="w-full mt-4 text-cyan-400 hover:text-cyan-300 transition-all text-sm"
          onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
        >
          {mode === 'login' ? 'Need an account? Sign up' : 'Have an account? Login'}
        </button>
        <button className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg transition-all text-slate-400 hover:text-white text-xl" onClick={onClose}>
          ×
        </button>
      </div>
    </div>
  )
}
