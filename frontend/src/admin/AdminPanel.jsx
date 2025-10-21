import React, { useState } from 'react'
import DashboardModule from './modules/DashboardModule'
import QuotesModule from './modules/QuotesModule'
import InventoryModule from './modules/InventoryModule'
import ApplicationsModule from './modules/ApplicationsModule'
import OrdersModule from './modules/OrdersModule'
import SettingsModule from './modules/SettingsModule'

export default function AdminPanel({ user, onLogout, onBackToSite }){
  const modules = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'quotes', name: 'Quote Requests', icon: '💬' },
    { id: 'inventory', name: 'Inventory', icon: '📦' },
    { id: 'applications', name: 'Job Applications', icon: '👥' },
    { id: 'orders', name: 'PanelSeal Orders', icon: '🛒' },
    { id: 'settings', name: 'Settings', icon: '⚙️' }
  ]

  const [activeModule, setActiveModule] = useState('dashboard')

  function Sidebar(){
    return (
      <div className="w-64 bg-[#0a2a52] text-white h-screen flex flex-col">
        <div className="p-6 text-[#e84424] font-bold text-xl">Midway Admin</div>
        <nav className="flex-1 px-2">
          {modules.map(m => (
            <button key={m.id} onClick={()=>setActiveModule(m.id)} className={`w-full text-left px-4 py-3 rounded mb-1 ${activeModule===m.id? 'bg-[#e84424] text-white': 'hover:bg-[#0d3464]'}`}>
              <span className="mr-2">{m.icon}</span>{m.name}
            </button>
          ))}
        </nav>

        <div className="p-4 space-y-2">
          <button onClick={() => { if (onBackToSite) onBackToSite(); }} className="w-full bg-gray-200 text-[#0a2a52] px-3 py-2 rounded">Back to site</button>
          <button onClick={() => { localStorage.removeItem('midway_token'); onLogout(); }} className="w-full bg-red-600 text-white px-3 py-2 rounded">Logout</button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        {activeModule === 'dashboard' && <DashboardModule />}
        {activeModule === 'quotes' && <QuotesModule />}
        {activeModule === 'inventory' && <InventoryModule />}
        {activeModule === 'applications' && <ApplicationsModule />}
        {activeModule === 'orders' && <OrdersModule />}
        {activeModule === 'settings' && <SettingsModule />}
      </div>
    </div>
  )
}
