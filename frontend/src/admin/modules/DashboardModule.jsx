import React, { useState, useEffect, useCallback } from 'react'
import { showToast } from '../../components/Toast'
import { API_BASE } from '../../config'

export default function DashboardModule(){
  const [stats, setStats] = useState({ 
    quotes: 0, 
    messages: 0,
    applications: 0, 
    orders: 0,
    inventory: { total: 0, available: 0, rented: 0 }
  })
  const [loading, setLoading] = useState(true)
  const token = typeof window !== 'undefined' ? localStorage.getItem('midway_token') : null

  const load = useCallback(async () => {
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
  }, [token])

  useEffect(()=>{
    load()
  },[load])

  const cards = [
    { label: 'Pending Quotes', value: stats.quotes, color: 'bg-blue-500', icon: '📋' },
    { label: 'Unread Messages', value: stats.messages, color: 'bg-purple-500', icon: '💬' },
    { label: 'Active Rentals', value: stats.inventory?.rented || 0, color: 'bg-green-500', icon: '📦' },
    { label: 'Available Units', value: stats.inventory?.available || 0, color: 'bg-[#e84424]', icon: '✓' },
    { label: 'New Applications', value: stats.applications, color: 'bg-indigo-500', icon: '👤' },
    { label: 'Pending Orders', value: stats.orders, color: 'bg-orange-500', icon: '🛒' }
  ]

  const modules = [
    { icon: '📊', name: 'Dashboard', desc: 'Overview of all system metrics and quick stats' },
    { icon: '📋', name: 'Quotes', desc: 'Manage storage rental quote requests from customers' },
    { icon: '💬', name: 'Messages', desc: 'View and respond to customer contact form submissions' },
    { icon: '📦', name: 'Inventory', desc: 'Track storage units, sizes, and availability status' },
    { icon: '👤', name: 'Applications', desc: 'Review job applications and update candidate status' },
    { icon: '🛒', name: 'Orders', desc: 'Process PanelSeal product orders and fulfillment' },
    { icon: 'ℹ️', name: 'Site Info', desc: 'Update company details, hours, and contact information' },
    { icon: '⚙️', name: 'Settings', desc: 'Configure website content, images, and SEO settings' },
    { icon: '🔐', name: 'Account', desc: 'Manage your admin password and security settings' }
  ]

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-[#0a2a52] mb-6">Dashboard</h1>
      {loading ? <div className="text-gray-600">Loading stats…</div> : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {cards.map(s=> (
              <div key={s.label} className="bg-white p-4 rounded shadow flex items-center gap-4">
                <div className={`${s.color} w-12 h-12 rounded-full flex items-center justify-center text-white text-xl`}>{s.icon}</div>
                <div>
                  <div className="text-sm text-gray-500">{s.label}</div>
                  <div className="text-2xl font-bold text-[#0a2a52]">{s.value}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold text-[#0a2a52] mb-4">Admin Panel Guide</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {modules.map(m => (
                <div key={m.name} className="flex items-start gap-3 p-3 border border-gray-200 rounded hover:border-[#e84424] transition-colors">
                  <div className="text-2xl">{m.icon}</div>
                  <div>
                    <div className="font-semibold text-[#0a2a52]">{m.name}</div>
                    <div className="text-sm text-gray-600">{m.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
