import { useState } from 'react'
import BlockEditor from './components/BlockEditor'
import AuthModal from './components/AuthModal'
import { useAuth } from './hooks/useAuth'
import AdminDashboard from './components/admin/AdminDashboard'
import BlockPage from './components/admin/BlockPage'
import BlockManager from './components/admin/BlockManager'

function App() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { user, logout } = useAuth()
  const [adminView, setAdminView] = useState<'none' | 'dashboard' | 'blocks' | 'blocksManager'>('none')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Automart AI
              </h1>
              <div className="hidden md:flex space-x-2">
                <button onClick={() => setAdminView('dashboard')} className={`px-4 py-2 rounded-lg font-medium transition-all ${adminView === 'dashboard' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}>Dashboard</button>
                <button onClick={() => setAdminView('blocks')} className={`px-4 py-2 rounded-lg font-medium transition-all ${adminView === 'blocks' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}>Editor</button>
                <button onClick={() => setAdminView('blocksManager')} className={`px-4 py-2 rounded-lg font-medium transition-all ${adminView === 'blocksManager' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}>Manager</button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-slate-300">Welcome, <span className="font-semibold text-cyan-400">{user.username}</span></span>
                  <button onClick={logout} className="px-4 py-2 bg-slate-700 text-slate-100 rounded-lg font-medium hover:bg-slate-600 transition-all">Logout</button>
                </div>
              ) : (
                <button onClick={() => setShowAuthModal(true)} className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all">Login / Sign Up</button>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="pt-20 px-4">
        {adminView === 'dashboard' && <AdminDashboard />}
        {adminView === 'blocks' && <BlockPage />}
        {adminView === 'blocksManager' && <BlockManager />}
        {adminView === 'none' && <BlockEditor />}
      </main>
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </div>
  )
}

export default App
