import React, { useEffect } from 'react'

export type NotificationType = 'success' | 'error' | 'info'

export default function Notification({ message, type = 'info', onClose }: { message: string, type?: NotificationType, onClose?: () => void }) {
  useEffect(() => {
    if (!message) return
    const t = setTimeout(() => onClose && onClose(), 4500)
    return () => clearTimeout(t)
  }, [message, onClose])

  if (!message) return null

  const bgColor = type === 'success' ? 'from-green-500/90 to-emerald-600/90' : type === 'error' ? 'from-red-500/90 to-rose-600/90' : 'from-blue-500/90 to-cyan-600/90'
  const borderColor = type === 'success' ? 'border-green-400' : type === 'error' ? 'border-red-400' : 'border-blue-400'

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slideUp" role="status">
      <div className={`flex items-center gap-3 px-5 py-4 bg-gradient-to-r ${bgColor} backdrop-blur-lg border ${borderColor} rounded-xl shadow-2xl min-w-[280px] max-w-md`}>
        <div className="flex-1 text-white font-medium">{message}</div>
        <button className="w-8 h-8 flex items-center justify-center hover:bg-white/20 rounded-lg transition-all text-white text-xl font-bold" onClick={() => onClose && onClose()} aria-label="Close">×</button>
      </div>
    </div>
  )
}
