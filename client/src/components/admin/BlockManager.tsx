import React, { useEffect, useState } from 'react'
import Notification from '../ui/Notification'
import ConfirmModal from '../ui/ConfirmModal'

const AUTOSAVE_KEY = 'blockEditorDraft'

type Post = {
  _id: string
  title: string
  content: string
}

export default function BlockManager() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)
  const [notif, setNotif] = useState<{ text: string, type?: 'success'|'error'|'info' } | null>(null)
  const [confirm, setConfirm] = useState<{ open: boolean, title?: string, message?: string, onConfirm?: () => void }>({ open: false })

  async function fetchPosts() {
    setLoading(true)
    try {
      const res = await fetch('/api/v1/posts')
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`)
      const data = await res.json()
      const list = Array.isArray(data) ? data : data.data || []
      setPosts(list)
    } catch (err: unknown) {
      const e = err as Error
      setNotif({ text: e.message, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  function loadIntoEditor(post: Post) {
    // Create simple blocks: heading + paragraph
    const blocks = [
      { id: `h-${Date.now()}`, type: 'heading', content: post.title },
      { id: `p-${Date.now()}`, type: 'paragraph', content: post.content },
    ]
    try {
      localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(blocks))
      setNotif({ text: 'Loaded into editor (open Blocks Editor)', type: 'success' })
    } catch (err) {
      setNotif({ text: 'Failed to load into editor', type: 'error' })
    }
  }

  async function publishPost(post?: Post) {
    setNotif(null)
    try {
      if (!post) {
        // publish current draft from localStorage
        const draft = localStorage.getItem(AUTOSAVE_KEY)
        if (!draft) { setMessage('No draft to publish'); return }
        // Make a simple title from first heading or 'Untitled'
        const blocks = JSON.parse(draft)
        const title = blocks.find((b: any) => b.type === 'heading')?.content || 'Untitled'
        const content = blocks.map((b: any) => b.type === 'heading' ? `# ${b.content}` : b.content).join('\n\n')
        const res = await fetch('/api/v1/posts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ title, content }) })
        if (!res.ok) throw new Error(`Publish failed: ${res.status}`)
        setNotif({ text: 'Published draft to server', type: 'success' })
        fetchPosts()
        return
      }

      // Update existing post
      const res = await fetch(`/api/v1/posts/${post._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify({ title: post.title, content: post.content }) })
      if (!res.ok) throw new Error(`Update failed: ${res.status}`)
      setNotif({ text: 'Post updated on server', type: 'success' })
      fetchPosts()
    } catch (err: unknown) {
      const e = err as Error
      setNotif({ text: e.message, type: 'error' })
    }
  }

  async function deletePost(post: Post) {
    setConfirm({
      open: true,
      title: 'Delete post',
      message: `Delete post "${post.title}"? This action cannot be undone.`,
      onConfirm: async () => {
        setConfirm({ open: false })
        try {
          const res = await fetch(`/api/v1/posts/${post._id}`, { method: 'DELETE', credentials: 'include' })
          if (!res.ok) throw new Error(`Delete failed: ${res.status}`)
          setNotif({ text: 'Deleted', type: 'success' })
          fetchPosts()
        } catch (err: unknown) {
          const e = err as Error
          setNotif({ text: e.message, type: 'error' })
        }
      }
    })
  }

  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">Blocks Manager</h2>
        <p className="text-slate-400">Manage posts and load them into the block editor</p>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <button onClick={() => publishPost()} className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all">Publish Draft</button>
        <button onClick={() => { localStorage.removeItem(AUTOSAVE_KEY); setNotif({ text: 'Local draft cleared', type: 'info' }) }} className="px-4 py-2 bg-slate-700 text-slate-100 rounded-lg font-semibold hover:bg-slate-600 transition-all border border-slate-600">Clear Local Draft</button>
        <button onClick={fetchPosts} className="px-4 py-2 bg-slate-700 text-slate-100 rounded-lg font-semibold hover:bg-slate-600 transition-all border border-slate-600">Refresh</button>
      </div>

      {notif && <Notification message={notif.text} type={notif.type as any} onClose={() => setNotif(null)} />}

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
          <p className="mt-4 text-slate-400">Loading posts...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map(p => (
            <div key={p._id} className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 shadow-2xl hover:border-slate-600 transition-all duration-300">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h4 className="text-xl font-bold text-white mb-2">{p.title}</h4>
                  <p className="text-slate-400 text-sm truncate">{p.content.slice(0, 200)}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => { loadIntoEditor(p); setNotif({ text: 'Loaded into editor', type: 'info' }) }} className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all">Load</button>
                  <button onClick={() => publishPost(p)} className="px-4 py-2 bg-slate-700 text-slate-100 rounded-lg font-semibold hover:bg-slate-600 transition-all border border-slate-600">Update</button>
                  <button onClick={() => deletePost(p)} className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <ConfirmModal open={confirm.open} title={confirm.title} message={confirm.message || ''} onCancel={() => setConfirm({ open: false })} onConfirm={() => confirm.onConfirm && confirm.onConfirm()} />
    </div>
  )
}
