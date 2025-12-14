import React, { useState, useEffect } from 'react'
import { showToast } from '../../components/Toast'
import ConfirmModal from '../../components/ConfirmModal'
import { API_BASE } from '../../config'
import { SubmissionMeta, SubmissionFieldList, SubmissionAttachments, SubmissionRawPayload, ensureSubmissionDisplay } from '../components/SubmissionDisplay'

export default function MessagesModule(){
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [pendingDeleteLoading, setPendingDeleteLoading] = useState(false)
  const [selected, setSelected] = useState(null)
  const token = typeof window !== 'undefined' ? localStorage.getItem('midway_token') : null

  async function load(){
    setLoading(true)
    setError(null)
    try{
      const res = await fetch(`${API_BASE}/messages`, { headers: { Authorization: `Bearer ${token}` }})
      if (res.status === 401) {
        localStorage.removeItem('midway_token')
        showToast('Session expired or unauthorized — please log in again', { type: 'error' })
        window.location.reload()
        return
      }
      if (res.ok) {
        const j = await res.json()
        // messages endpoint returns message rows
        setMessages(j.messages || [])
      } else {
        setError('Failed to load messages')
      }
    }catch(e){ if (import.meta.env.DEV) console.error(e); setError(String(e)) }
    setLoading(false)
  }

  useEffect(()=>{ load() },[])

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold text-[#0a2a52]">Contact Messages</h1>
        <div className="flex items-center gap-3">
          <button onClick={load} className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded">Refresh</button>
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-4">Use “View” to read a message in a clean layout. Raw payload retains the original submission for troubleshooting.</p>

      <div className="bg-white rounded-lg shadow overflow-hidden p-4">
        {loading && <div className="text-gray-600">Loading…</div>}
        {error && <div className="text-red-600">{error}</div>}

        {!loading && !error && messages.length === 0 && (
          <div className="p-8 text-center text-gray-600">
            <div className="text-xl font-semibold mb-2">No messages yet</div>
            <div>No contact messages have been received. Use the public Contact form to create a test message.</div>
          </div>
        )}

        {!loading && !error && messages.length > 0 && (
          <table className="w-full">
            <caption className="sr-only">Contact messages list</caption>
            <thead className="bg-[#0a2a52] text-white">
              <tr>
                <th className="px-6 py-3 text-left">Submission</th>
                <th className="px-6 py-3 text-left">Message</th>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.map(m => (
                <tr key={m.id} className="border-b hover:bg-gray-50 align-top">
                  <td className="px-6 py-4 align-top">
                    <div className="font-semibold text-gray-900">{m.display?.summary?.primary || m.name}</div>
                    <div className="text-xs text-gray-500">{[m.display?.summary?.secondary || m.email, m.display?.summary?.tertiary || m.phone].filter(Boolean).join(' • ') || '—'}</div>
                  </td>
                  <td className="px-6 py-4 align-top"><div className="max-w-xl text-sm text-gray-800 whitespace-pre-wrap">{m.message || (m.display?.fields?.find(f => f.key === 'message')?.value) || '—'}</div></td>
                  <td className="px-6 py-4 text-sm text-gray-600 align-top">{m.display?.meta?.submittedAt ? new Date(m.display.meta.submittedAt).toLocaleString() : (m.createdAt ? new Date(m.createdAt).toLocaleString() : '—')}</td>
                  <td className="px-6 py-4 align-top">
                    <button onClick={()=>setSelected(m)} className="text-sm text-[#0a2a52] hover:text-[#e84424] mr-2">View</button>
                    <button onClick={async ()=>{
                      // simple "mark responded" toggle stored in-memory only
                      try{
                        const res = await fetch(`${API_BASE}/messages`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ id: m.id, status: 'responded' }) })
                        const payload = await res.json().catch(()=>null)
                        if (res.ok) {
                          if (payload?.message) {
                            setMessages(prev => prev.map(msg => msg.id === payload.message.id ? payload.message : msg))
                            if (selected && selected.id === payload.message.id) setSelected(payload.message)
                          } else {
                            load()
                          }
                          showToast('Marked responded', { type: 'success' })
                        }
                        else showToast(payload?.error || 'Failed to update', { type: 'error' })
                      }catch(e){ if (import.meta.env.DEV) console.error(e); showToast('Failed', { type: 'error' }) }
                    }} className="text-sm text-[#e84424] hover:text-[#d13918] mr-2">Mark Responded</button>
                    <button onClick={() => setPendingDelete(m)} className="text-sm text-red-600 hover:text-red-700">Delete</button>
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
          title="Delete message"
          message={`Delete message from "${pendingDelete.name}"? This cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          onCancel={() => setPendingDelete(null)}
          loading={pendingDeleteLoading}
          onConfirm={async () => {
            setPendingDeleteLoading(true)
            try {
              const res = await fetch(`${API_BASE}/messages/${pendingDelete.id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
              })
              if (res.ok) {
                setMessages(prev => prev.filter(m => m.id !== pendingDelete.id))
                setPendingDelete(null)
                showToast('Message deleted', { type: 'success' })
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

      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6">
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-bold">Message Details</h3>
              <button onClick={() => setSelected(null)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            {(() => {
              const display = ensureSubmissionDisplay(selected, { formLabel: 'Contact Message', submittedAtKey: 'createdAt' })
              return (
                <>
                  <SubmissionMeta display={display} />
                  <p className="mt-3 text-sm text-gray-600">All fields submitted by the customer are listed below.</p>
                  <SubmissionFieldList display={display} />
                  <div className="mt-6">
                    <div className="font-semibold text-gray-700">Status</div>
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs ${selected.status === 'responded' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {selected.status || 'new'}
                    </span>
                  </div>
                  <SubmissionAttachments display={display} />
                  <SubmissionRawPayload payload={display?.raw || selected} />
                </>
              )
            })()}
            <div className="mt-6 flex justify-end">
              <button onClick={() => setSelected(null)} className="px-4 py-2 bg-[#e84424] text-white rounded">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
