import React, { useState } from 'react'
import { showToast } from './Toast'
import { API_BASE } from '../config'
import { useCsrfToken } from '../hooks/useCsrfToken'

export default function ContactModal({ onClose }){
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const { token: csrfToken } = useCsrfToken()

  const submit = async (e) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) { showToast('Name and email are required', { type: 'error' }); return }
    
    if (!csrfToken) {
      showToast('Security token not available. Please refresh the page.', { type: 'error' })
      return
    }
    
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, email, subject, message, csrf_token: csrfToken })
      })
      if (res.ok) {
        showToast('Message sent — thank you', { type: 'success' })
        // Reset form
        setName('')
        setEmail('')
        setSubject('')
        setMessage('')
        onClose && onClose()
      } else {
        const j = await res.json().catch(()=>null)
        showToast((j && j.error) ? j.error : 'Failed to send message', { type: 'error' })
      }
    } catch (e) {
      showToast('Failed to send message', { type: 'error' })
    }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-bold">Contact Us</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700" disabled={loading} aria-label="Close contact form">✕</button>
        </div>

        <form onSubmit={submit} className="mt-4 grid gap-3" aria-label="Contact form">
          <label htmlFor="contact-name" className="block">
            <span className="text-sm text-gray-700 font-medium">Name *</span>
            <input id="contact-name" placeholder="Your name" value={name} onChange={e=>setName(e.target.value)} className="mt-1 p-2 border rounded w-full text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#e84424]" required autoComplete="name" />
          </label>
          <label htmlFor="contact-email" className="block">
            <span className="text-sm text-gray-700 font-medium">Email *</span>
            <input id="contact-email" type="email" placeholder="Your email" value={email} onChange={e=>setEmail(e.target.value)} className="mt-1 p-2 border rounded w-full text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#e84424]" required autoComplete="email" />
          </label>
          <label htmlFor="contact-subject" className="block">
            <span className="text-sm text-gray-700 font-medium">Subject</span>
            <input id="contact-subject" placeholder="Subject (optional)" value={subject} onChange={e=>setSubject(e.target.value)} className="mt-1 p-2 border rounded w-full text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#e84424]" />
          </label>
          <label htmlFor="contact-message" className="block">
            <span className="text-sm text-gray-700 font-medium">Message</span>
            <textarea id="contact-message" placeholder="Your message" value={message} onChange={e=>setMessage(e.target.value)} className="mt-1 p-2 border rounded h-32 w-full text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#e84424]" />
          </label>

          <div className="mt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-3 py-1 bg-gray-200 rounded" disabled={loading}>Cancel</button>
            <button type="submit" className="px-3 py-1 bg-[#e84424] text-white rounded" disabled={loading}>{loading ? 'Sending…' : 'Send Message'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
