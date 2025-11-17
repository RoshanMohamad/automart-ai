import React from 'react'

export default function ConfirmModal({ open, title, message, onCancel, onConfirm }: { open: boolean, title?: string, message: string, onCancel: () => void, onConfirm: () => void }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn" onClick={onCancel}>
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl animate-slideUp" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
        {title && <h3 className="text-xl font-bold text-white mb-3">{title}</h3>}
        <p className="text-slate-300 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button className="px-5 py-2.5 bg-slate-700 text-slate-200 border border-slate-600 rounded-lg font-medium hover:bg-slate-600 transition-all" onClick={onCancel}>Cancel</button>
          <button className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all" onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  )
}
