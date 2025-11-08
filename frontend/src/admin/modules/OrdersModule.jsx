import React, { useState, useEffect } from 'react'
import { showToast } from '../../components/Toast'

// OrdersModule loads protected orders from the backend. It expects a JWT to
// be stored in localStorage under `midway_token`; the module reads that token
// and includes it in the Authorization header when requesting the API. This
// keeps the module simple and avoids prop-drilling auth tokens through many
// components in this demo.
const API_BASE = 'http://localhost:5001/api'

export default function OrdersModule(){
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selected, setSelected] = useState(null)
  const token = typeof window !== 'undefined' ? localStorage.getItem('midway_token') : null

  async function load(){
    setLoading(true); setError(null)
    try{
      const res = await fetch(`${API_BASE}/orders`, { headers: { Authorization: `Bearer ${token}` }})
      if (res.status === 401) {
        localStorage.removeItem('midway_token')
        showToast('Session expired or unauthorized — please log in again', { type: 'error' })
        window.location.reload()
        return
      }
      if (res.ok) {
        const j = await res.json()
        setOrders(j.orders || [])
      } else setError('Failed to load orders')
    }catch(e){ console.error(e); setError(String(e)) }
    setLoading(false)
  }

  useEffect(()=>{ load() },[])

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold text-[#0a2a52]">PanelSeal Orders</h1>
        <div><button onClick={load} className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded">Refresh</button></div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden p-4">
        {loading && <div className="text-gray-600">Loading…</div>}
        {error && <div className="text-red-600">{error}</div>}

        {!loading && !error && orders.length === 0 && (
          <div className="p-8 text-center text-gray-600">No orders found. Click Refresh.</div>
        )}

        {!loading && !error && orders.length > 0 && (
          <table className="w-full">
            <thead className="bg-[#0a2a52] text-white"><tr><th className="px-6 py-3 text-left">Customer</th><th className="px-6 py-3 text-left">Product</th><th className="px-6 py-3 text-left">Qty</th><th className="px-6 py-3 text-left">Date</th><th className="px-6 py-3 text-left">Status</th><th className="px-6 py-3 text-left">Actions</th></tr></thead>
            <tbody>
              {orders.map(o=> (
                <tr key={o.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{o.customer}</td>
                  <td className="px-6 py-4">{o.product}</td>
                  <td className="px-6 py-4">{o.quantity}</td>
                  <td className="px-6 py-4">{o.date}</td>
                  <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-sm ${o.status==='shipped' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{o.status}</span></td>
                  <td className="px-6 py-4">
                    <button onClick={() => setSelected(o)} className="text-[#e84424] mr-3">View</button>
                    <button onClick={() => { if (o.trackingUrl) window.open(o.trackingUrl, '_blank') }} className="text-blue-600">Track</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-bold">Order: {selected.customer}</h3>
              <button onClick={()=>setSelected(null)} className="text-gray-500">Close</button>
            </div>
            <div className="mt-4 text-sm text-gray-700 space-y-2">
              <div><strong>Product:</strong> {selected.product}</div>
              <div><strong>Quantity:</strong> {selected.quantity}</div>
              <div><strong>Date:</strong> {selected.date}</div>
              <div>
                <strong>Status:</strong>
                <button onClick={async ()=>{
                  const next = selected.status === 'shipped' ? 'processing' : 'shipped'
                  const token = localStorage.getItem('midway_token')
                  try{
                      const res = await fetch(`${API_BASE}/orders/${selected.id}/status`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ status: next }) })
                      if (res.ok){ const j = await res.json(); setSelected(j.order); setOrders(prev => prev.map(it => it.id === j.order.id ? j.order : it)); showToast('Status updated', { type: 'success' }) }
                      else { const txt = await res.text(); showToast('Status update failed: ' + txt, { type: 'error' }) }
                    }catch(e){ console.error(e); showToast('Status update error', { type: 'error' }) }
                }} className={`ml-2 px-3 py-1 rounded-full text-sm ${selected.status==='shipped' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{selected.status}</button>
              </div>
            </div>
            <div className="mt-4 text-right"><button onClick={()=>setSelected(null)} className="px-3 py-1 bg-[#e84424] text-white rounded">Close</button></div>
          </div>
        </div>
      )}
    </div>
  )
}
