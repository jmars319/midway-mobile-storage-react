import React, { useState, useId, useCallback } from 'react'
import { showToast } from './Toast'
import { API_BASE } from '../config'
import { useCsrfToken } from '../hooks/useCsrfToken'
import StandardModal from './StandardModal'

export default function ContactModal({ onClose, id = 'contact-modal' }){
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [spamGuard, setSpamGuard] = useState('')
  const { token: csrfToken } = useCsrfToken()
  const labelId = useId()
  const descriptionId = useId()

  const handleClose = useCallback((force = false) => {
    if (!force && loading) return
    onClose && onClose()
  }, [loading, onClose])

  const submit = async (e) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) { showToast('Name and email are required', { type: 'error' }); return }
    
    if (!csrfToken) {
      showToast('Security token not available. Please refresh the page.', { type: 'error' })
      return
    }
    
    setLoading(true)
    try {
      const sourcePage = typeof window !== 'undefined' ? window.location.href : ''
      const res = await fetch(`${API_BASE}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, email, subject, message, csrf_token: csrfToken, companyWebsite: spamGuard, sourcePage })
      })
      if (res.ok) {
        showToast('Message sent — thank you', { type: 'success' })
        // Reset form
        setName('')
        setEmail('')
        setSubject('')
        setMessage('')
        setSpamGuard('')
        handleClose(true)
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
    <StandardModal
      onClose={handleClose}
      labelledBy={labelId}
      describedBy={descriptionId}
      panelProps={{ id }}
      panelClassName="max-w-lg w-full focus:outline-none"
    >
      <div className="flex items-start justify-between px-6 py-4 border-b">
        <div>
          <h3 id={labelId} className="text-lg font-bold">Contact Us</h3>
          <p className="text-sm text-gray-500 mt-1">We typically respond within one business day.</p>
        </div>
        <button onClick={handleClose} className="text-gray-500 hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e84424] focus-visible:ring-offset-2 rounded" disabled={loading} aria-label="Close contact form">✕</button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto [-webkit-overflow-scrolling:touch] px-6 py-4">
        <p id={descriptionId} className="sr-only">Use this form to contact Midway Mobile Storage. Required fields are marked with an asterisk.</p>
        <form onSubmit={submit} className="grid gap-3" aria-label="Contact form">
          <div className="sr-only" aria-hidden="true">
            <label>
              Website
              <input
                type="text"
                name="companyWebsite"
                value={spamGuard}
                onChange={(e) => setSpamGuard(e.target.value)}
                tabIndex="-1"
                autoComplete="off"
                className="opacity-0 absolute -z-10"
              />
            </label>
          </div>
          <label htmlFor="contact-name" className="block">
            <span className="text-sm text-gray-700 font-medium">Name *</span>
            <input id="contact-name" placeholder="Your name" value={name} onChange={e=>setName(e.target.value)} className="mt-1 p-2 border rounded w-full text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#e84424]" required autoComplete="name" data-autofocus="true" />
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

          <div className="mt-4 flex flex-col md:flex-row justify-between gap-3 text-sm text-gray-600">
            <span>Prefer a phone call? Dial <a className="font-semibold underline" href="tel:13367644208">(336) 764-4208</a>.</span>
            <div className="flex gap-3 justify-end">
              <button type="button" onClick={() => handleClose()} className="px-3 py-1 bg-gray-200 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e84424]" disabled={loading}>Cancel</button>
              <button type="submit" className="px-3 py-1 bg-[#e84424] text-white rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e84424]" disabled={loading}>{loading ? 'Sending…' : 'Send Message'}</button>
            </div>
          </div>
        </form>
      </div>
    </StandardModal>
  )
}
