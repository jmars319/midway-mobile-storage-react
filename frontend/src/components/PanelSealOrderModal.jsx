import React, { useState, useRef, useId, useCallback } from 'react'
import { showToast } from './Toast'
import { API_BASE } from '../config'
import { useCsrfToken } from '../hooks/useCsrfToken'
import { useFocusTrap } from '../hooks/useFocusTrap'

export default function PanelSealOrderModal({ open, onClose }){
  const [form, setForm] = useState({ name:'', email:'', phone:'', address:'', gallons: '', notes: '' })
  const [submitting, setSubmitting] = useState(false)
  const { token: csrfToken } = useCsrfToken()
  const dialogRef = useRef(null)
  const labelId = useId()
  const descriptionId = useId()

  const handleClose = useCallback((force = false) => {
    if (!force && submitting) return
    onClose && onClose()
  }, [submitting, onClose])

  useFocusTrap({ isActive: Boolean(open), containerRef: dialogRef, onClose: handleClose })

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) handleClose()
  }

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
          csrf_token: csrfToken
        })
      })
      if (res.ok){ 
        showToast('Order submitted — we will follow up shortly', { type: 'success' })
        // Reset form
        setForm({ name:'', email:'', phone:'', address:'', gallons: '', notes: '' })
        handleClose(true) 
      }
      else { const txt = await res.text(); showToast('Order failed: ' + txt, { type: 'error' }) }
    }catch(err){ showToast('Order error', { type: 'error' }) }
    setSubmitting(false)
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onMouseDown={handleOverlayClick} role="presentation">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelId}
        aria-describedby={descriptionId}
        tabIndex="-1"
        className="bg-white rounded-lg shadow-lg max-w-xl w-full p-6 focus:outline-none"
      >
        <div className="flex items-start justify-between">
          <h3 id={labelId} className="text-lg font-bold">Order PanelSeal</h3>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e84424] focus-visible:ring-offset-2 rounded" aria-label="Close order form" disabled={submitting}>✕</button>
        </div>
        <p id={descriptionId} className="sr-only">Place a PanelSeal order request. Required fields are marked with an asterisk.</p>
        <form onSubmit={submit} className="mt-4 grid grid-cols-1 gap-3" aria-label="PanelSeal order form">
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
    </div>
  )
}
