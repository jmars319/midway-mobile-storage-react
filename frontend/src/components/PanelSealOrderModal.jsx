import React, { useState } from 'react'
import { showToast } from './Toast'
import { API_BASE } from '../config'

export default function PanelSealOrderModal({ open, onClose }){
  const [form, setForm] = useState({ name:'', email:'', phone:'', address:'', gallons: '', notes: '' })
  const [submitting, setSubmitting] = useState(false)

  if (!open) return null

  function change(e){
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function submit(e){
    e.preventDefault()
    setSubmitting(true)
    try{
      const res = await fetch(`${API_BASE}/orders`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
        customer: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
        product: 'PanelSeal',
        quantity: form.gallons,
        notes: form.notes
      })})
      if (res.ok){ showToast('Order submitted — we will follow up shortly', { type: 'success' }); onClose() }
      else { const txt = await res.text(); showToast('Order failed: ' + txt, { type: 'error' }) }
    }catch(err){ showToast('Order error', { type: 'error' }) }
    setSubmitting(false)
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-xl w-full p-6">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-bold">Order PanelSeal</h3>
          <button onClick={onClose} className="text-gray-500">✕</button>
        </div>
        <form onSubmit={submit} className="mt-4 grid grid-cols-1 gap-3">
          <div className="grid md:grid-cols-2 gap-3">
            <input name="name" value={form.name} onChange={change} placeholder="Full name" className="p-2 border rounded w-full text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#e84424]" required />
            <input name="email" value={form.email} onChange={change} placeholder="Email" type="email" className="p-2 border rounded w-full text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#e84424]" required />
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <input name="phone" value={form.phone} onChange={change} placeholder="Phone" className="p-2 border rounded w-full text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#e84424]" />
            <input name="address" value={form.address} onChange={change} placeholder="Delivery address" className="p-2 border rounded w-full text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#e84424]" />
          </div>
          <div className="grid md:grid-cols-2 gap-3 items-end">
            <label className="text-sm">
              <div className="text-xs text-gray-600">Estimated gallons</div>
              <input name="gallons" value={form.gallons} onChange={change} placeholder="e.g. 5" type="number" min="0" step="1" className="mt-1 p-2 border rounded w-full text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#e84424]" required />
            </label>
            <label>
              <div className="text-sm text-gray-600">Notes (optional)</div>
              <input name="notes" value={form.notes} onChange={change} placeholder="Any special instructions" className="mt-1 p-2 border rounded w-full text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#e84424]" />
            </label>
          </div>
          <div className="mt-4 text-right flex items-center justify-between">
            <div className="text-xs text-gray-500">We will contact you to confirm pricing and availability.</div>
            <div className="flex items-center gap-3">
              <button type="button" onClick={onClose} className="px-3 py-2 bg-gray-200 rounded">Cancel</button>
              <button type="submit" disabled={submitting} className="px-4 py-2 bg-[#e84424] text-white rounded">{submitting ? 'Submitting…' : 'Place Order'}</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
