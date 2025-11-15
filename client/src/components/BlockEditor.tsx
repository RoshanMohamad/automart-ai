import { useState, useEffect } from 'react'
import { marked } from 'marked'
import { useAuth } from '../hooks/useAuth'
import './BlockEditor.css'

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
  const [message, setMessage] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)

  // Autosave to localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!user) {
        localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(blocks))
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
      setMessage('Please login to save posts to the server. Your draft is saved locally.')
      return
    }

    setSaving(true)
    setMessage(null)
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
        setMessage(`Save failed: ${res.status} ${text}`)
      } else {
        setMessage('Saved successfully to server')
        localStorage.removeItem(AUTOSAVE_KEY) // Clear draft after successful save
      }
    } catch (err: unknown) {
      const error = err as Error
      setMessage(`Save error: ${error?.message || err}`)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="block-editor">
      <div className="editor-toolbar">
        <button onClick={() => addBlock('heading')}>+ Heading</button>
        <button onClick={() => addBlock('paragraph')}>+ Paragraph</button>
        <button onClick={() => addBlock('code')}>+ Code</button>
        <button onClick={() => addBlock('image')}>+ Image</button>
        <button onClick={() => addBlock('list')}>+ List</button>
        <div style={{ flex: 1 }} />
        {!user && <span className="auth-hint">💾 Auto-saving locally</span>}
        <button onClick={() => setShowPreview(!showPreview)}>
          {showPreview ? 'Hide' : 'Show'} Preview
        </button>
        <button onClick={savePost} disabled={saving}>
          {saving ? 'Saving...' : user ? 'Save' : 'Login to Save'}
        </button>
        <button onClick={() => { navigator.clipboard?.writeText(exportAsMarkdown()) }}>Copy MD</button>
        {!user && <button onClick={clearDraft}>Clear Draft</button>}
      </div>

      <div className={`editor-container ${showPreview ? 'with-preview' : ''}`}>
        <div className="blocks">
          {blocks.map((block, i) => (
            <div className="block" key={block.id}>
              <div className="block-controls">
                <button onClick={() => moveBlock(block.id, -1)} disabled={i === 0}>↑</button>
                <button onClick={() => moveBlock(block.id, 1)} disabled={i === blocks.length - 1}>↓</button>
                <button onClick={() => deleteBlock(block.id)}>🗑️</button>
                <span className="block-type-label">{block.type}</span>
              </div>
              <div className="block-body">
                {block.type === 'heading' ? (
                  <input
                    className="block-heading"
                    value={block.content}
                    onChange={e => updateBlock(block.id, e.target.value)}
                    placeholder="Enter heading..."
                  />
                ) : block.type === 'code' ? (
                  <div className="block-code-wrapper">
                    <input
                      className="code-language"
                      value={block.language || ''}
                      onChange={e => setBlocks(b => b.map(x => x.id === block.id ? { ...x, language: e.target.value } : x))}
                      placeholder="Language (e.g., javascript)"
                    />
                    <textarea
                      className="block-code"
                      value={block.content}
                      onChange={e => updateBlock(block.id, e.target.value)}
                      rows={6}
                      placeholder="Enter code..."
                    />
                  </div>
                ) : block.type === 'image' ? (
                  <input
                    className="block-image"
                    value={block.content}
                    onChange={e => updateBlock(block.id, e.target.value)}
                    placeholder="Enter image URL..."
                  />
                ) : block.type === 'list' ? (
                  <textarea
                    className="block-list"
                    value={block.content}
                    onChange={e => updateBlock(block.id, e.target.value)}
                    rows={4}
                    placeholder="Enter list items (one per line)..."
                  />
                ) : (
                  <textarea
                    className="block-paragraph"
                    value={block.content}
                    onChange={e => updateBlock(block.id, e.target.value)}
                    rows={4}
                    placeholder="Enter paragraph..."
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        {showPreview && (
          <div className="preview-pane">
            <h3>Preview</h3>
            <div 
              className="preview-content"
              dangerouslySetInnerHTML={{ __html: renderPreview() }}
            />
          </div>
        )}
      </div>

      {message && <div className="editor-message">{message}</div>}
    </div>
  )
}
