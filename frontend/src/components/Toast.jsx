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
      const t = { id, message: e.detail.message, type: e.detail.type || 'info', duration: e.detail.duration || 4000 }
      setToasts(prev => [...prev, t])
      // auto remove
      setTimeout(()=>{ setToasts(prev => prev.filter(x => x.id !== id)) }, t.duration)
    }
    window.addEventListener('midway-toast', onToast)
    return ()=> window.removeEventListener('midway-toast', onToast)
  },[])

  if (!toasts.length) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {toasts.map(t => (
        <div key={t.id} className={`max-w-sm w-full px-4 py-2 rounded shadow-md text-sm text-white ${t.type==='error' ? 'bg-red-600' : t.type==='success' ? 'bg-green-600' : 'bg-gray-800'}`}>
          {t.message}
        </div>
      ))}
    </div>
  )
}
