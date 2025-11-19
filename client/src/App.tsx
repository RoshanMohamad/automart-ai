import { useAuth } from './hooks/useAuth';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import './index.css';

function App() {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <Login />;
  }

  // Show admin dashboard if authenticated as admin
  if (isAdmin) {
    return <AdminDashboard />;
  }

  // Default: unauthorized access
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-slate-800/50 backdrop-blur-sm border-2 border-slate-700 rounded-2xl p-8 text-center">
        <svg className="w-20 h-20 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h1 className="text-2xl font-bold text-white mb-2">Unauthorized Access</h1>
        <p className="text-slate-400 mb-4">You don't have permission to access this page.</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-cyan-500 hover:bg-cyan-600 text-white font-medium py-2 px-6 rounded-lg transition-all duration-300"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}

export default App;
