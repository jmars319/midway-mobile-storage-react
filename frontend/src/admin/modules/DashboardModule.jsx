import React, { useState, useEffect } from 'react'
import { showToast } from '../../components/Toast'
import { API_BASE } from '../../config'

export default function DashboardModule(){
  const [stats, setStats] = useState({ quotes: 0, applications: 0, inventory: 0 })
  const [loading, setLoading] = useState(true)
  const token = typeof window !== 'undefined' ? localStorage.getItem('midway_token') : null

  useEffect(()=>{
    async function load(){
      setLoading(true)
      try{
        const res = await fetch(`${API_BASE}/admin/stats`, { headers: { Authorization: `Bearer ${token}` }})
        if (res.status === 401) {
          localStorage.removeItem('midway_token')
          showToast('Session expired or unauthorized — please log in again', { type: 'error' })
          window.location.reload()
          return
        }
        if (res.ok) setStats(await res.json())
      }catch(e){ if (import.meta.env.DEV) console.error(e) }
      setLoading(false)
    }
    load()
  },[])

  const cards = [
    { label: 'Pending Quotes', value: stats.quotes, color: 'bg-blue-500' },
    { label: 'Active Rentals', value: stats.inventory, color: 'bg-green-500' },
    { label: 'Available Units', value: stats.inventory, color: 'bg-[#e84424]' },
    { label: 'New Applications', value: stats.applications, color: 'bg-purple-500' }
  ]

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-[#0a2a52] mb-6">Dashboard</h1>
      {loading ? <div className="text-gray-600">Loading stats…</div> : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {cards.map(s=> (
            <div key={s.label} className="bg-white p-4 rounded shadow flex items-center gap-4">
              <div className={`${s.color} w-12 h-12 rounded-full flex items-center justify-center text-white`}>★</div>
              <div>
                <div className="text-sm text-gray-500">{s.label}</div>
                <div className="text-xl font-bold">{s.value}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
