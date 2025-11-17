import React from 'react'
import BlockEditor from '../BlockEditor'

export default function BlockPage() {
  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">Blocks Editor</h2>
        <p className="text-slate-400">Create and manage content blocks for posts</p>
      </div>
      <BlockEditor />
    </div>
  )
}
