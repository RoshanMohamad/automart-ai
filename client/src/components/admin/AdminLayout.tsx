import React, { ReactNode } from 'react'
import './Admin.css'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="admin-root">
      <aside className="admin-sidebar">
        <div className="brand">Automart AI</div>
        <nav>
          <ul>
            <li className="active">Dashboard</li>
            <li>Blocks</li>
            <li>Posts</li>
            <li>Users</li>
            <li>Settings</li>
          </ul>
        </nav>
        <div className="sidebar-footer">v1.0</div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div className="topbar-left">
            <h2>Admin Panel</h2>
          </div>
          <div className="topbar-right">
            <input className="search" placeholder="Search..." />
            <button className="btn">New Post</button>
          </div>
        </header>

        <main className="admin-content">{children}</main>
      </div>
    </div>
  )
}
