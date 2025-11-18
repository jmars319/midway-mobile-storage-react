import React, { useEffect, useState } from 'react'

// showToast(message, { type: 'info'|'success'|'error', duration: ms })
export function showToast(message, opts = {}){
  const ev = new CustomEvent('midway-toast', { detail: { message, ...opts } })
  window.dispatchEvent(ev)
}

export default function ToastContainer(){
  const [toasts, setToasts] = useState([])

  useEffect(()=>{
    function onToast(e){
      const id = Date.now() + Math.random()
      const t = { id, message: e.detail.message, type: e.detail.type || 'info', duration: e.detail.duration || 5000 }
      setToasts(prev => [...prev, t])
      // auto remove
      setTimeout(()=>{ setToasts(prev => prev.filter(x => x.id !== id)) }, t.duration)
    }
    window.addEventListener('midway-toast', onToast)
    return ()=> window.removeEventListener('midway-toast', onToast)
  },[])

  const dismissToast = (id) => {
    setToasts(prev => prev.filter(x => x.id !== id))
  }

  if (!toasts.length) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3" role="region" aria-label="Notifications">
      {toasts.map(t => (
        <div key={t.id} role="alert" aria-live="polite" className={`max-w-sm w-full px-4 py-3 rounded shadow-lg text-sm text-white flex items-start justify-between gap-3 ${t.type==='error' ? 'bg-red-600' : t.type==='success' ? 'bg-green-600' : 'bg-gray-800'}`}>
          <span>{t.message}</span>
          <button 
            onClick={() => dismissToast(t.id)} 
            className="flex-shrink-0 text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded"
            aria-label="Dismiss notification"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}
