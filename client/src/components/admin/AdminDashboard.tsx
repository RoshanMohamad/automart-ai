import React from 'react'

export default function AdminDashboard() {
  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Dashboard</h2>
        <p className="text-slate-400">Monitor your content and activity</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 shadow-2xl hover:border-cyan-500/50 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">Total Posts</p>
              <p className="text-3xl font-bold text-white mt-2">24</p>
            </div>
            <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 shadow-2xl hover:border-purple-500/50 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">Users</p>
              <p className="text-3xl font-bold text-white mt-2">112</p>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 shadow-2xl hover:border-green-500/50 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">Drafts</p>
              <p className="text-3xl font-bold text-white mt-2">7</p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 shadow-2xl">
        <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-3 bg-slate-800/50 rounded-lg">
            <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
            <div className="flex-1">
              <p className="text-slate-200">New user signed up: <span className="text-cyan-400">alice@example.com</span></p>
              <p className="text-xs text-slate-500 mt-1">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-3 bg-slate-800/50 rounded-lg">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <div className="flex-1">
              <p className="text-slate-200">Post published: <span className="text-green-400">"How to use AI"</span></p>
              <p className="text-xs text-slate-500 mt-1">5 hours ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
