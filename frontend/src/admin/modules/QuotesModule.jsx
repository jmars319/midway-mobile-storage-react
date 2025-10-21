import React, { useState, useEffect } from 'react'

const API_BASE = 'http://localhost:5001/api'

export default function QuotesModule(){
  const [quotes, setQuotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const token = typeof window !== 'undefined' ? localStorage.getItem('midway_token') : null

  async function load(){
    setLoading(true)
    setError(null)
    try{
      const res = await fetch(`${API_BASE}/quotes`, { headers: { Authorization: `Bearer ${token}` }})
      if (res.ok) {
        const j = await res.json()
        setQuotes(j.quotes || [])
      } else {
        setError('Failed to load quotes')
      }
    }catch(e){ console.error(e); setError(String(e)) }
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
            <div className="mb-4">No customers have submitted quote requests. Use the public quote form to create a test quote or click Refresh.</div>
            <div>
              <button onClick={load} className="bg-[#e84424] text-white px-4 py-2 rounded">Refresh</button>
            </div>
          </div>
        )}

        {!loading && !error && quotes.length > 0 && (
          <table className="w-full">
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
                    <button className="text-[#e84424] hover:text-[#d13918] font-semibold mr-3">View</button>
                    <button className="text-blue-600 hover:text-blue-700 font-semibold">Details</button>
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
