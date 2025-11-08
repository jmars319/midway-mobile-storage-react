import React, { useState } from 'react'
import { showToast } from './Toast'
import { BACKEND } from '../lib/media'

export default function ContactModal({ onClose }){
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    if (!name.trim() || !email.trim()) { showToast('Name and email are required', { type: 'error' }); return }
    setLoading(true)
    try {
      const res = await fetch(`${BACKEND}/api/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message })
      })
      if (res.ok) {
        showToast('Message sent — thank you', { type: 'success' })
        onClose && onClose()
      } else {
        const j = await res.json().catch(()=>null)
        showToast((j && j.error) ? j.error : 'Failed to send message', { type: 'error' })
      }
    } catch (e) {
      console.error('contact submit error', e)
      showToast('Failed to send message', { type: 'error' })
    }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-bold">Contact Us</h3>
          <button onClick={onClose} className="text-gray-500" disabled={loading}>✕</button>
        </div>

        <div className="mt-4 grid gap-3">
          <input placeholder="Your name" value={name} onChange={e=>setName(e.target.value)} className="p-2 border rounded w-full text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#e84424]" />
          <input placeholder="Your email" value={email} onChange={e=>setEmail(e.target.value)} className="p-2 border rounded w-full text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#e84424]" />
          <input placeholder="Subject (optional)" value={subject} onChange={e=>setSubject(e.target.value)} className="p-2 border rounded w-full text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#e84424]" />
          <textarea placeholder="Message" value={message} onChange={e=>setMessage(e.target.value)} className="p-2 border rounded h-32 w-full text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#e84424]" />
        </div>

        <div className="mt-4 flex justify-end gap-3">
          <button onClick={onClose} className="px-3 py-1 bg-gray-200 rounded" disabled={loading}>Cancel</button>
          <button onClick={submit} className="px-3 py-1 bg-[#e84424] text-white rounded" disabled={loading}>{loading ? 'Sending…' : 'Send Message'}</button>
        </div>
      </div>
    </div>
  )
}
