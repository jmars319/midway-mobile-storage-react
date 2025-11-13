import React, { useState, useEffect } from 'react'
import { showToast } from '../../components/Toast'

const API_BASE = 'http://localhost:5001/api'

export default function MessagesModule(){
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
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

      <div className="bg-white rounded-lg shadow overflow-hidden p-4">
        {loading && <div className="text-gray-600">Loading…</div>}
        {error && <div className="text-red-600">{error}</div>}

        {!loading && !error && messages.length === 0 && (
          <div className="p-8 text-center text-gray-600">
            <div className="text-xl font-semibold mb-2">No messages yet</div>
            <div className="mb-4">No contact messages have been received. Use the public Contact form to create a test message or click Refresh.</div>
            <div>
              <button onClick={load} className="bg-[#e84424] text-white px-4 py-2 rounded">Refresh</button>
            </div>
          </div>
        )}

        {!loading && !error && messages.length > 0 && (
          <table className="w-full">
            <thead className="bg-[#0a2a52] text-white">
              <tr>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Subject</th>
                <th className="px-6 py-3 text-left">Message</th>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.map(m => (
                <tr key={m.id} className="border-b hover:bg-gray-50 align-top">
                  <td className="px-6 py-4 align-top">{m.name}</td>
                  <td className="px-6 py-4 align-top">{m.email}</td>
                  <td className="px-6 py-4 align-top text-sm text-gray-700">{m.subject || '—'}</td>
                  <td className="px-6 py-4 align-top"><div className="max-w-xl text-sm text-gray-800 whitespace-pre-wrap">{m.message || m.message || (m.serviceType ? `Quote request for ${m.serviceType}` : '—')}</div></td>
                  <td className="px-6 py-4 text-sm text-gray-600 align-top">{m.createdAt ? new Date(m.createdAt).toLocaleString() : '—'}</td>
                  <td className="px-6 py-4 align-top">
                    <button onClick={()=>navigator.clipboard.writeText(JSON.stringify(m))} className="text-sm text-gray-600 hover:text-gray-800 mr-2">Copy JSON</button>
                    <button onClick={async ()=>{
                      // simple "mark responded" toggle stored in-memory only
                      try{
                        const res = await fetch(`${API_BASE}/messages`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ id: m.id, status: 'responded' }) })
                        if (res.ok) { showToast('Marked responded', { type: 'success' }); load() }
                        else showToast('Failed to update', { type: 'error' })
                      }catch(e){ if (import.meta.env.DEV) console.error(e); showToast('Failed', { type: 'error' }) }
                    }} className="text-sm text-[#e84424] hover:text-[#d13918]">Mark Responded</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
