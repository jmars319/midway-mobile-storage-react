import React, { useState, useEffect } from 'react'

const API_BASE = 'http://localhost:5001/api'

export default function InventoryModule(){
  const [inventory, setInventory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const token = typeof window !== 'undefined' ? localStorage.getItem('midway_token') : null

  async function load(){
    setLoading(true); setError(null)
    try{
      const res = await fetch(`${API_BASE}/inventory`, { headers: { Authorization: `Bearer ${token}` }})
      if (res.ok) {
        const j = await res.json()
        setInventory(j.inventory || [])
      } else setError('Failed to load inventory')
    }catch(e){ console.error(e); setError(String(e)) }
    setLoading(false)
  }

  useEffect(()=>{ load() },[])

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold text-[#0a2a52]">Inventory</h1>
        <div><button onClick={load} className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded">Refresh</button></div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden p-4">
        {loading && <div className="text-gray-600">Loading…</div>}
        {error && <div className="text-red-600">{error}</div>}

        {!loading && !error && inventory.length === 0 && (
          <div className="p-8 text-center text-gray-600">No inventory items found. Click Refresh.</div>
        )}

        {!loading && !error && inventory.length > 0 && (
          <table className="w-full">
            <thead className="bg-[#0a2a52] text-white"><tr><th className="px-6 py-3 text-left">Type</th><th className="px-6 py-3 text-left">Condition</th><th className="px-6 py-3 text-left">Status</th><th className="px-6 py-3 text-left">Qty</th><th className="px-6 py-3 text-left">Actions</th></tr></thead>
            <tbody>
              {inventory.map(i=> (
                <tr key={i.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{i.type}</td>
                  <td className="px-6 py-4">{i.condition}</td>
                  <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-sm ${i.status==='Available' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{i.status}</span></td>
                  <td className="px-6 py-4">{i.quantity}</td>
                  <td className="px-6 py-4"><button className="text-[#e84424] mr-3">Edit</button><button className="text-blue-600">Details</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
