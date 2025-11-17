import { useState, useEffect } from 'react'
import { marked } from 'marked'
import { useAuth } from '../hooks/useAuth'
import Notification from './ui/Notification'

type BlockType = 'paragraph' | 'heading' | 'code' | 'image' | 'list'

type Block = {
  id: string
  type: BlockType
  content: string
  language?: string // for code blocks
}

function makeId() {
  return `${Date.now().toString(36)}-${Math.floor(Math.random() * 10000)}`
}

const AUTOSAVE_KEY = 'blockEditorDraft'

export default function BlockEditor() {
  const { user } = useAuth()
  const [blocks, setBlocks] = useState<Block[]>(() => {
    // Try to load from localStorage
    const saved = localStorage.getItem(AUTOSAVE_KEY)
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        // Fall through to default
      }
    }
    return [
      { id: makeId(), type: 'heading', content: 'Untitled' },
      { id: makeId(), type: 'paragraph', content: 'Start writing your post...' },
    ]
  })
  const [saving, setSaving] = useState(false)
  const [notif, setNotif] = useState<{ text: string, type?: 'success'|'error'|'info' } | null>(null)
  const [showPreview, setShowPreview] = useState(false)

  // Autosave to localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!user) {
        try { localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(blocks)) } catch {}
      }
    }, 1000)
    return () => clearTimeout(timer)
  }, [blocks, user])

  function addBlock(type: BlockType) {
    setBlocks((b) => [...b, { id: makeId(), type, content: '' }])
  }

  function updateBlock(id: string, content: string) {
    setBlocks((b) => b.map(x => x.id === id ? { ...x, content } : x))
  }

  function deleteBlock(id: string) {
    setBlocks((b) => b.filter(x => x.id !== id))
  }

  function moveBlock(id: string, dir: -1 | 1) {
    setBlocks((b) => {
      const idx = b.findIndex(x => x.id === id)
      if (idx === -1) return b
      const newIdx = idx + dir
      if (newIdx < 0 || newIdx >= b.length) return b
      const copy = [...b]
      const [item] = copy.splice(idx, 1)
      copy.splice(newIdx, 0, item)
      return copy
    })
  }

  function exportAsMarkdown() {
    return blocks.map(block => {
      if (block.type === 'heading') return `# ${block.content}`
      if (block.type === 'code') return `\`\`\`${block.language || ''}\n${block.content}\n\`\`\``
      if (block.type === 'image') return `![Image](${block.content})`
      if (block.type === 'list') return block.content.split('\n').map(line => `- ${line}`).join('\n')
      return block.content
    }).join('\n\n')
  }

  function renderPreview() {
    const markdown = exportAsMarkdown()
    return marked(markdown)
  }

  function clearDraft() {
    localStorage.removeItem(AUTOSAVE_KEY)
    setMessage('Draft cleared')
  }

  async function savePost() {
    if (!user) {
      setNotif({ text: 'Please login to save posts to the server. Your draft is saved locally.', type: 'info' })
      return
    }

    setSaving(true)
    setNotif(null)
    const title = blocks.find(b => b.type === 'heading')?.content || 'Untitled'
    const content = exportAsMarkdown()

    try {
      const res = await fetch('/api/v1/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ title, content }),
      })

      if (!res.ok) {
        const text = await res.text()
        setNotif({ text: `Save failed: ${res.status} ${text}`, type: 'error' })
      } else {
        setNotif({ text: 'Saved successfully to server', type: 'success' })
        localStorage.removeItem(AUTOSAVE_KEY) // Clear draft after successful save
      }
    } catch (err: unknown) {
      const error = err as Error
      setNotif({ text: `Save error: ${error?.message || err}`, type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Toolbar */}
      <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 mb-6 shadow-2xl">
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={() => addBlock('heading')} className="px-3 py-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 rounded-lg font-medium hover:bg-cyan-500/30 transition-all">+ Heading</button>
          <button onClick={() => addBlock('paragraph')} className="px-3 py-2 bg-slate-700 text-slate-200 border border-slate-600 rounded-lg font-medium hover:bg-slate-600 transition-all">+ Paragraph</button>
          <button onClick={() => addBlock('code')} className="px-3 py-2 bg-slate-700 text-slate-200 border border-slate-600 rounded-lg font-medium hover:bg-slate-600 transition-all">+ Code</button>
          <button onClick={() => addBlock('image')} className="px-3 py-2 bg-slate-700 text-slate-200 border border-slate-600 rounded-lg font-medium hover:bg-slate-600 transition-all">+ Image</button>
          <button onClick={() => addBlock('list')} className="px-3 py-2 bg-slate-700 text-slate-200 border border-slate-600 rounded-lg font-medium hover:bg-slate-600 transition-all">+ List</button>
          <div className="flex-1" />
          {!user && <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 border border-yellow-500/50 rounded-lg text-sm font-medium">💾 Auto-saving</span>}
          <button onClick={() => setShowPreview(!showPreview)} className="px-3 py-2 bg-purple-500/20 text-purple-400 border border-purple-500/50 rounded-lg font-medium hover:bg-purple-500/30 transition-all">{showPreview ? 'Hide' : 'Show'} Preview</button>
          <button onClick={savePost} disabled={saving} className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">{saving ? 'Saving...' : user ? 'Save' : 'Login to Save'}</button>
        </div>
      </div>

      <div className={`grid gap-6 ${showPreview ? 'lg:grid-cols-2' : 'grid-cols-1'}`}>
        {/* Blocks */}
        <div className="space-y-4">
          {blocks.map((block, i) => (
            <div key={block.id} className="group bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 shadow-xl hover:border-slate-600 transition-all duration-300">
              <div className="flex items-center justify-between mb-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs font-bold uppercase rounded">{block.type}</span>
                <div className="flex gap-2">
                  <button onClick={() => moveBlock(block.id, -1)} disabled={i === 0} className="w-8 h-8 flex items-center justify-center bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-all disabled:opacity-30">↑</button>
                  <button onClick={() => moveBlock(block.id, 1)} disabled={i === blocks.length - 1} className="w-8 h-8 flex items-center justify-center bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-all disabled:opacity-30">↓</button>
                  <button onClick={() => deleteBlock(block.id)} className="w-8 h-8 flex items-center justify-center bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all">🗑️</button>
                </div>
              </div>
              {block.type === 'heading' ? (
                <input value={block.content} onChange={e => updateBlock(block.id, e.target.value)} placeholder="Enter heading..." className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-2xl font-bold text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all" />
              ) : block.type === 'code' ? (
                <div className="space-y-2">
                  <input value={block.language || ''} onChange={e => setBlocks(b => b.map(x => x.id === block.id ? { ...x, language: e.target.value } : x))} placeholder="Language (e.g., javascript)" className="w-48 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all" />
                  <textarea value={block.content} onChange={e => updateBlock(block.id, e.target.value)} rows={6} placeholder="Enter code..." className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg font-mono text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all resize-y" />
                </div>
              ) : block.type === 'image' ? (
                <input value={block.content} onChange={e => updateBlock(block.id, e.target.value)} placeholder="Enter image URL..." className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all" />
              ) : block.type === 'list' ? (
                <textarea value={block.content} onChange={e => updateBlock(block.id, e.target.value)} rows={4} placeholder="Enter list items (one per line)..." className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all resize-y" />
              ) : (
                <textarea value={block.content} onChange={e => updateBlock(block.id, e.target.value)} rows={4} placeholder="Enter paragraph..." className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all resize-y" />
              )}
            </div>
          ))}
        </div>

        {/* Preview */}
        {showPreview && (
          <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 shadow-xl sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
            <h3 className="text-xl font-bold text-white mb-4 border-b border-slate-700 pb-3">Preview</h3>
            <div className="prose prose-invert prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: renderPreview() }} />
          </div>
        )}
      </div>

      {notif && <Notification message={notif.text} type={notif.type as any} onClose={() => setNotif(null)} />}
    </div>
  )
}
