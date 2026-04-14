import React, { useState, useEffect, useId, useCallback } from 'react'
import { showToast } from '../../components/Toast'
import ConfirmModal from '../../components/ConfirmModal'
import StandardModal from '../../components/StandardModal'
import { API_BASE } from '../../config'
import { decodeHtmlEntities } from '../../utils/htmlEntities'
import { SubmissionMeta, SubmissionFieldList, SubmissionAttachments, SubmissionRawPayload, ensureSubmissionDisplay } from '../components/SubmissionDisplay'

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

const QUOTE_STATUS_META = {
  new: {
    label: 'New',
    badgeClass: 'bg-blue-100 text-blue-800'
  },
  responded: {
    label: 'Responded',
    badgeClass: 'bg-amber-100 text-amber-800'
  },
  handled: {
    label: 'Handled',
    badgeClass: 'bg-green-100 text-green-800'
  },
  dismissed: {
    label: 'Dismissed',
    badgeClass: 'bg-gray-200 text-gray-700'
  }
}

const QUOTE_STATUS_OPTIONS = ['new', 'responded', 'handled', 'dismissed']

const normalizeQuoteStatus = (status) => {
  const normalized = typeof status === 'string' ? status.trim().toLowerCase() : ''
  if (normalized === 'pending') return 'new'
  return QUOTE_STATUS_META[normalized] ? normalized : 'new'
}

const getQuoteStatusMeta = (status) => QUOTE_STATUS_META[normalizeQuoteStatus(status)] || QUOTE_STATUS_META.new

const decodeQuoteFields = (quote) => {
  if (!quote) return quote
  const decoded = { ...quote }
  QUOTE_FIELDS_TO_DECODE.forEach((field) => {
    if (typeof decoded[field] === 'string') {
      decoded[field] = decodeHtmlEntities(decoded[field])
    }
  })
  decoded.status = normalizeQuoteStatus(decoded.status)
  return decoded
}

export default function QuotesModule(){
  const [quotes, setQuotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selected, setSelected] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [pendingDeleteLoading, setPendingDeleteLoading] = useState(false)
  const [statusUpdatingId, setStatusUpdatingId] = useState(null)
  const token = typeof window !== 'undefined' ? localStorage.getItem('midway_token') : null
  const detailTitleId = useId()
  const detailDescriptionId = useId()

  const load = useCallback(async () => {
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
  }, [token])

  useEffect(()=>{ load() },[load])

  const updateQuoteStatus = useCallback(async (quoteId, nextStatus) => {
    setStatusUpdatingId(quoteId)
    try {
      const res = await fetch(`${API_BASE}/quotes`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ id: quoteId, status: nextStatus })
      })
      if (res.status === 401) {
        localStorage.removeItem('midway_token')
        showToast('Session expired or unauthorized — please log in again', { type: 'error' })
        window.location.reload()
        return
      }

      const payload = await res.json().catch(() => null)
      if (!res.ok || !payload?.quote) {
        showToast(payload?.error || 'Status update failed', { type: 'error' })
        return
      }

      const updatedQuote = decodeQuoteFields(payload.quote)
      setQuotes(prev => prev.map((quote) => quote.id === updatedQuote.id ? updatedQuote : quote))
      setSelected(prev => (prev && prev.id === updatedQuote.id ? updatedQuote : prev))
      showToast(`Quote marked ${getQuoteStatusMeta(updatedQuote.status).label.toLowerCase()}`, { type: 'success' })
    } catch (e) {
      if (import.meta.env.DEV) console.error(e)
      showToast('Status update error', { type: 'error' })
    } finally {
      setStatusUpdatingId(null)
    }
  }, [token])

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold text-[#0a2a52]">Quote Requests</h1>
        <div className="flex items-center gap-3">
          <button onClick={load} className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded">Refresh</button>
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-4">Each entry shows the customer summary. Open a record to review every field and attachments.</p>

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
                <th className="px-6 py-3 text-left">Submission</th>
                <th className="px-6 py-3 text-left">Service</th>
                <th className="px-6 py-3 text-left">Submitted</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map(q => {
                const statusMeta = getQuoteStatusMeta(q.status)
                return (
                <tr key={q.id} className="border-b hover:bg-gray-50 align-top">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">{q.display?.summary?.primary || q.name}</div>
                    <div className="text-xs text-gray-500">
                      {[q.display?.summary?.secondary || q.email, q.display?.summary?.tertiary || q.phone]
                        .filter(Boolean)
                        .join(' • ') || '—'}
                    </div>
                  </td>
                  <td className="px-6 py-4">{q.serviceType || '—'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{q.display?.meta?.submittedAt ? new Date(q.display.meta.submittedAt).toLocaleString() : (q.createdAt ? new Date(q.createdAt).toLocaleString() : '—')}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col items-start gap-2">
                      <span className={`inline-flex px-3 py-1 rounded-full text-sm ${statusMeta.badgeClass}`}>{statusMeta.label}</span>
                      <label htmlFor={`quote-status-${q.id}`} className="sr-only">Update status for {q.name || `quote ${q.id}`}</label>
                      <select
                        id={`quote-status-${q.id}`}
                        value={normalizeQuoteStatus(q.status)}
                        onChange={(e) => void updateQuoteStatus(q.id, e.target.value)}
                        disabled={statusUpdatingId === q.id}
                        className="rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 focus:ring-2 focus:ring-[#e84424] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {QUOTE_STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>
                            {QUOTE_STATUS_META[status].label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => setSelected(q)} className="text-[#e84424] hover:text-[#d13918] font-semibold mr-3">View</button>
                    <button onClick={() => setPendingDelete(q)} className="text-red-600 hover:text-red-700 font-semibold">Delete</button>
                  </td>
                </tr>
              )})}
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
        <StandardModal
          panelClassName="max-w-2xl w-full"
          onClose={() => setSelected(null)}
          labelledBy={detailTitleId}
          describedBy={detailDescriptionId}
        >
          <div className="flex items-start justify-between px-6 py-4 border-b">
            <h3 id={detailTitleId} className="text-lg font-bold">Quote Request Details</h3>
            <button onClick={() => setSelected(null)} className="text-gray-500 hover:text-gray-700">✕</button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto [-webkit-overflow-scrolling:touch] px-6 py-4">
            {(() => {
              const display = ensureSubmissionDisplay(selected, { formLabel: 'Quote Request', submittedAtKey: 'createdAt' })
              const statusMeta = getQuoteStatusMeta(selected.status)
              return (
                <>
                  <SubmissionMeta display={display} />
                  <p id={detailDescriptionId} className="mt-3 text-sm text-gray-600">Details below are fully decoded for easy reading.</p>
                  <SubmissionFieldList display={display} />
                  <div className="mt-6">
                    <div className="font-semibold text-gray-700">Status</div>
                    <div className="mt-2 flex flex-wrap items-center gap-3">
                      <span className={`inline-flex px-3 py-1 rounded-full text-sm ${statusMeta.badgeClass}`}>
                        {statusMeta.label}
                      </span>
                      <label htmlFor={`selected-quote-status-${selected.id}`} className="sr-only">Update selected quote status</label>
                      <select
                        id={`selected-quote-status-${selected.id}`}
                        value={normalizeQuoteStatus(selected.status)}
                        onChange={(e) => void updateQuoteStatus(selected.id, e.target.value)}
                        disabled={statusUpdatingId === selected.id}
                        className="rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-[#e84424] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {QUOTE_STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>
                            {QUOTE_STATUS_META[status].label}
                          </option>
                        ))}
                      </select>
                      {statusUpdatingId === selected.id && <span className="text-xs text-gray-500">Updating…</span>}
                    </div>
                    <p className="mt-2 text-xs text-gray-500">Use “Dismissed” for spam or invalid requests. Use “Handled” once the quote is fully closed out.</p>
                  </div>
                  <SubmissionAttachments display={display} />
                  <SubmissionRawPayload payload={display?.raw || selected} />
                </>
              )
            })()}
          </div>
          <div className="px-6 py-4 border-t flex justify-end gap-3">
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
        </StandardModal>
      )}
    </div>
  )
}
