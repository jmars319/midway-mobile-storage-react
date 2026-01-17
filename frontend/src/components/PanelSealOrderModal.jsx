import React, { useState, useId, useCallback } from 'react'
import { showToast } from './Toast'
import { API_BASE } from '../config'
import { useCsrfToken } from '../hooks/useCsrfToken'
import StandardModal from './StandardModal'

export default function PanelSealOrderModal({ open, onClose }){
  const [form, setForm] = useState({ name:'', email:'', phone:'', address:'', gallons: '', notes: '' })
  const [submitting, setSubmitting] = useState(false)
  const [spamGuard, setSpamGuard] = useState('')
  const { token: csrfToken } = useCsrfToken()
  const labelId = useId()
  const descriptionId = useId()

  const handleClose = useCallback((force = false) => {
    if (!force && submitting) return
    onClose && onClose()
  }, [submitting, onClose])

  if (!open) return null

  function change(e){
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function submit(e){
    e.preventDefault()
    
    if (!csrfToken) {
      showToast('Security token not available. Please refresh the page.', { type: 'error' })
      return
    }
    
    setSubmitting(true)
    try{
      const sourcePage = typeof window !== 'undefined' ? window.location.href : ''
      const res = await fetch(`${API_BASE}/orders`, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        credentials: 'include',
        body: JSON.stringify({
          customer: form.name,
          email: form.email,
          phone: form.phone,
          address: form.address,
          product: 'PanelSeal',
          quantity: form.gallons,
          notes: form.notes,
          csrf_token: csrfToken,
          companyWebsite: spamGuard,
          sourcePage
        })
      })
      if (res.ok){ 
        showToast('Order submitted — we will follow up shortly', { type: 'success' })
        // Reset form
        setForm({ name:'', email:'', phone:'', address:'', gallons: '', notes: '' })
        setSpamGuard('')
        handleClose(true) 
      }
      else { const txt = await res.text(); showToast('Order failed: ' + txt, { type: 'error' }) }
    }catch(err){ showToast('Order error', { type: 'error' }) }
    setSubmitting(false)
  }

  return (
    <StandardModal
      onClose={handleClose}
      labelledBy={labelId}
      describedBy={descriptionId}
      panelClassName="max-w-xl w-full focus:outline-none"
    >
      <div className="flex items-start justify-between px-6 py-4 border-b">
        <h3 id={labelId} className="text-lg font-bold">Order PanelSeal</h3>
        <button onClick={handleClose} className="text-gray-500 hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e84424] focus-visible:ring-offset-2 rounded" aria-label="Close order form" disabled={submitting}>✕</button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto [-webkit-overflow-scrolling:touch] px-6 py-4">
        <p id={descriptionId} className="sr-only">Place a PanelSeal order request. Required fields are marked with an asterisk.</p>
        <form onSubmit={submit} className="grid grid-cols-1 gap-3" aria-label="PanelSeal order form">
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
          <div className="grid md:grid-cols-2 gap-3">
            <label htmlFor="order-name" className="block">
              <span className="text-sm text-gray-700 font-medium">Full Name *</span>
              <input id="order-name" name="name" value={form.name} onChange={change} placeholder="Name" className="mt-1 p-2 border rounded w-full text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#e84424]" required autoComplete="name" data-autofocus="true" />
            </label>
            <label htmlFor="order-email" className="block">
              <span className="text-sm text-gray-700 font-medium">Email</span>
              <input id="order-email" name="email" value={form.email} onChange={change} placeholder="Email" type="email" className="mt-1 p-2 border rounded w-full text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#e84424]" required autoComplete="email" />
            </label>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <label htmlFor="order-phone" className="block">
              <span className="text-sm text-gray-700 font-medium">Phone</span>
              <input id="order-phone" name="phone" value={form.phone} onChange={change} placeholder="Phone" type="tel" className="mt-1 p-2 border rounded w-full text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#e84424]" />
            </label>
            <label htmlFor="order-address" className="block">
              <span className="text-sm text-gray-700 font-medium">Delivery Address</span>
              <input id="order-address" name="address" value={form.address} onChange={change} placeholder="Street, city, state" className="mt-1 p-2 border rounded w-full text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#e84424]" />
            </label>
          </div>
          <div className="grid md:grid-cols-2 gap-3 items-end">
            <label htmlFor="order-gallons" className="text-sm">
              <div className="text-xs text-gray-600">Estimated gallons</div>
              <input id="order-gallons" name="gallons" value={form.gallons} onChange={change} placeholder="e.g. 5" type="number" min="0" step="1" className="mt-1 p-2 border rounded w-full text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#e84424]" required />
            </label>
            <label htmlFor="order-notes">
              <div className="text-sm text-gray-600">Notes (optional)</div>
              <input id="order-notes" name="notes" value={form.notes} onChange={change} placeholder="Any special instructions" className="mt-1 p-2 border rounded w-full text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#e84424]" />
            </label>
          </div>
          <div className="mt-4 text-right flex items-center justify-between">
            <div className="text-xs text-gray-500">We will contact you to confirm pricing and availability.</div>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => handleClose()} className="px-3 py-2 bg-gray-200 rounded">Cancel</button>
              <button type="submit" disabled={submitting} className="px-4 py-2 bg-[#e84424] text-white rounded">{submitting ? 'Submitting…' : 'Place Order'}</button>
            </div>
          </div>
        </form>
      </div>
    </StandardModal>
  )
}
