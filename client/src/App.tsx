import { useState,useEffect } from 'react'
import './App.css'
import BlockEditor from './components/BlockEditor'
import AuthModal from './components/AuthModal'
import { useAuth } from './hooks/useAuth'

function App() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { user, logout } = useAuth()

  useEffect(() => {
    fetch('http://localhost:5000/api/hello')
      .then(response => response.json())
      .then(data => {
        console.log(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);
  
  return (
    <>
      <div className="app-header">
        {user ? (
          <div className="user-info">
            <span>Welcome, {user.username}!</span>
            <button onClick={logout}>Logout</button>
          </div>
        ) : (
          <button onClick={() => setShowAuthModal(true)}>Login / Sign Up</button>
        )}
      </div>
      <BlockEditor />
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      
    </>
  )
}

export default App
