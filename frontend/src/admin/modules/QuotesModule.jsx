import React, { useState, useEffect } from 'react'
import { showToast } from '../../components/Toast'
import ConfirmModal from '../../components/ConfirmModal'
import { API_BASE } from '../../config'
import { decodeHtmlEntities } from '../../utils/htmlEntities'

const QUOTE_FIELDS_TO_DECODE = [
  'name',
  'email',
  'phone',
  'serviceType',
  'containerSize',
  'quantity',
  'duration',
  'deliveryAddress',
  'message',
  'status'
]

const decodeQuoteFields = (quote) => {
  if (!quote) return quote
  const decoded = { ...quote }
  QUOTE_FIELDS_TO_DECODE.forEach((field) => {
    if (typeof decoded[field] === 'string') {
      decoded[field] = decodeHtmlEntities(decoded[field])
    }
  })
  return decoded
}

export default function QuotesModule(){
  const [quotes, setQuotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selected, setSelected] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [pendingDeleteLoading, setPendingDeleteLoading] = useState(false)
  const token = typeof window !== 'undefined' ? localStorage.getItem('midway_token') : null

  async function load(){
    setLoading(true)
    setError(null)
    try{
      const res = await fetch(`${API_BASE}/quotes`, { headers: { Authorization: `Bearer ${token}` }})
      if (res.status === 401) {
        // token invalid or expired — clear and force a reload so the app shows the login
        localStorage.removeItem('midway_token')
        showToast('Session expired or unauthorized — please log in again', { type: 'error' })
        window.location.reload()
        return
      }
      if (res.ok) {
        const j = await res.json()
        const decodedQuotes = (j.quotes || []).map(decodeQuoteFields)
        setQuotes(decodedQuotes)
      } else {
        setError('Failed to load quotes')
      }
    }catch(e){ if (import.meta.env.DEV) console.error(e); setError(String(e)) }
    setLoading(false)
  }

  useEffect(()=>{ load() },[])

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold text-[#0a2a52]">Quote Requests</h1>
        <div className="flex items-center gap-3">
          <button onClick={load} className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded">Refresh</button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden p-4">
        {loading && <div className="text-gray-600">Loading…</div>}
        {error && <div className="text-red-600">{error}</div>}

        {!loading && !error && quotes.length === 0 && (
          <div className="p-8 text-center text-gray-600">
            <div className="text-xl font-semibold mb-2">No quote requests yet</div>
            <div>No customers have submitted quote requests. Use the public quote form to create a test quote.</div>
          </div>
        )}

        {!loading && !error && quotes.length > 0 && (
          <table className="w-full">
            <caption className="sr-only">Quote requests list</caption>
            <thead className="bg-[#0a2a52] text-white">
              <tr>
                <th className="px-6 py-3 text-left">Customer</th>
                <th className="px-6 py-3 text-left">Service</th>
                <th className="px-6 py-3 text-left">Size</th>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map(q => (
                <tr key={q.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{q.name}</td>
                  <td className="px-6 py-4">{q.serviceType || '—'}</td>
                  <td className="px-6 py-4">{q.containerSize || '—'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{new Date(q.createdAt).toLocaleString()}</td>
                  <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-sm ${q.status==='responded' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{q.status||'pending'}</span></td>
                  <td className="px-6 py-4">
                    <button onClick={() => setSelected(q)} className="text-[#e84424] hover:text-[#d13918] font-semibold mr-3">View</button>
                    <button onClick={() => setPendingDelete(q)} className="text-red-600 hover:text-red-700 font-semibold">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Delete confirmation modal */}
      {pendingDelete && (
        <ConfirmModal
          title="Delete quote request"
          message={`Delete quote from "${pendingDelete.name}"? This cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          onCancel={() => setPendingDelete(null)}
          loading={pendingDeleteLoading}
          onConfirm={async () => {
            setPendingDeleteLoading(true)
            try {
              const res = await fetch(`${API_BASE}/quotes/${pendingDelete.id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
              })
              if (res.ok) {
                setQuotes(prev => prev.filter(q => q.id !== pendingDelete.id))
                if (selected && selected.id === pendingDelete.id) setSelected(null)
                setPendingDelete(null)
                showToast('Quote deleted', { type: 'success' })
              } else {
                const txt = await res.text()
                showToast('Delete failed: ' + txt, { type: 'error' })
                setPendingDelete(null)
              }
            } catch (e) {
              if (import.meta.env.DEV) console.error(e)
              showToast('Delete error', { type: 'error' })
              setPendingDelete(null)
            } finally {
              setPendingDeleteLoading(false)
            }
          }}
        />
      )}

      {/* Detail view modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6">
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-bold">Quote Request Details</h3>
              <button onClick={() => setSelected(null)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-semibold text-gray-700">Customer</div>
                <div className="text-gray-900">{selected.name}</div>
              </div>
              <div>
                <div className="font-semibold text-gray-700">Email</div>
                <div className="text-gray-900">{selected.email}</div>
              </div>
              <div>
                <div className="font-semibold text-gray-700">Phone</div>
                <div className="text-gray-900">{selected.phone || '—'}</div>
              </div>
              <div>
                <div className="font-semibold text-gray-700">Service Type</div>
                <div className="text-gray-900">{selected.serviceType || '—'}</div>
              </div>
              <div>
                <div className="font-semibold text-gray-700">Unit Size</div>
                <div className="text-gray-900">{selected.containerSize || '—'}</div>
              </div>
              <div>
                <div className="font-semibold text-gray-700">Quantity</div>
                <div className="text-gray-900">{selected.quantity || '—'}</div>
              </div>
              <div>
                <div className="font-semibold text-gray-700">Duration</div>
                <div className="text-gray-900">{selected.duration || '—'}</div>
              </div>
              <div>
                <div className="font-semibold text-gray-700">Delivery Address</div>
                <div className="text-gray-900">{selected.deliveryAddress || '—'}</div>
              </div>
              <div className="col-span-2">
                <div className="font-semibold text-gray-700">Message</div>
                <div className="text-gray-900 whitespace-pre-wrap">{selected.message || '—'}</div>
              </div>
              <div>
                <div className="font-semibold text-gray-700">Status</div>
                <button
                  onClick={async () => {
                    const newStatus = selected.status === 'responded' ? 'pending' : 'responded'
                    try {
                      const res = await fetch(`${API_BASE}/quotes`, {
                        method: 'PUT',
                        headers: {
                          'Content-Type': 'application/json',
                          Authorization: `Bearer ${token}`
                        },
                        body: JSON.stringify({ id: selected.id, status: newStatus })
                      })
                      if (res.ok) {
                        const j = await res.json()
                        const updatedQuote = decodeQuoteFields(j.quote)
                        setSelected(updatedQuote)
                        setQuotes(prev => prev.map(q => q.id === updatedQuote.id ? updatedQuote : q))
                        showToast('Status updated', { type: 'success' })
                      } else {
                        showToast('Status update failed', { type: 'error' })
                      }
                    } catch (e) {
                      if (import.meta.env.DEV) console.error(e)
                      showToast('Status update error', { type: 'error' })
                    }
                  }}
                  className={`px-3 py-1 rounded-full text-sm ${selected.status === 'responded' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                >
                  {selected.status || 'pending'}
                </button>
              </div>
              <div>
                <div className="font-semibold text-gray-700">Submitted</div>
                <div className="text-gray-900">{new Date(selected.createdAt).toLocaleString()}</div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => navigator.clipboard.writeText(JSON.stringify(selected, null, 2))}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
              >
                Copy JSON
              </button>
              <button
                onClick={() => setSelected(null)}
                className="px-4 py-2 bg-[#e84424] text-white rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
