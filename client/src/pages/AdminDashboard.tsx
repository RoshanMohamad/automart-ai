import { useAuth } from '../hooks/useAuth';
import ImageUpload from '../components/admin/ImageUpload';
import type { UploadedImage } from '../components/admin/ImageUpload';

export default function AdminDashboard() {
  const { user, logout } = useAuth();

  const handleUploadComplete = (images: UploadedImage[]) => {
    console.log('Uploaded images:', images);
    // Here you can handle the uploaded images, e.g., save to database
    // In production, the API endpoint would return the server URLs
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Admin Header */}
      <header className="bg-slate-900/50 backdrop-blur-md border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-2 rounded-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">AutoMart Admin</h1>
                <p className="text-slate-400 text-sm">Image Management Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-white font-medium">{user?.name}</p>
                <p className="text-sm text-slate-400">{user?.email}</p>
              </div>
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-sm border-2 border-cyan-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-300 text-sm mb-1">Total Images</p>
                <p className="text-3xl font-bold text-white">0</p>
              </div>
              <div className="bg-cyan-500/30 p-3 rounded-lg">
                <svg className="w-8 h-8 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border-2 border-purple-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-300 text-sm mb-1">Storage Used</p>
                <p className="text-3xl font-bold text-white">0 MB</p>
              </div>
              <div className="bg-purple-500/30 p-3 rounded-lg">
                <svg className="w-8 h-8 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm border-2 border-green-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-300 text-sm mb-1">Today's Uploads</p>
                <p className="text-3xl font-bold text-white">0</p>
              </div>
              <div className="bg-green-500/30 p-3 rounded-lg">
                <svg className="w-8 h-8 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Image Upload Section */}
        <div className="bg-slate-900/30 backdrop-blur-sm border-2 border-slate-700 rounded-2xl p-8">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-white mb-2">🖼️ Image Upload</h2>
            <p className="text-slate-400">
              Upload product images, banners, or any media files for your AutoMart platform
            </p>
          </div>
          
          <ImageUpload onUploadComplete={handleUploadComplete} />
        </div>
      </main>
    </div>
  );
}
