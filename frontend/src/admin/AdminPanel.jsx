import React, { useState, useEffect, lazy, Suspense } from 'react'
import { getActiveLogoUrl } from '../lib/media'

// Lazy load admin modules for better code splitting
const DashboardModule = lazy(() => import('./modules/DashboardModule'))
const QuotesModule = lazy(() => import('./modules/QuotesModule'))
const InventoryModule = lazy(() => import('./modules/InventoryModule'))
const ApplicationsModule = lazy(() => import('./modules/ApplicationsModule'))
const OrdersModule = lazy(() => import('./modules/OrdersModule'))
const SettingsModule = lazy(() => import('./modules/SettingsModule'))
const SiteSettingsModule = lazy(() => import('./modules/SiteSettingsModule'))
const MessagesModule = lazy(() => import('./modules/MessagesModule'))
const AccountModule = lazy(() => import('./modules/AccountModule'))

// AdminPanel is a simple single-file admin shell for the demo. It keeps local
// module selection state and renders each module component. The component
// expects:
// - `user` (object) - lightweight authenticated user info
// - `onLogout` (fn) - callback to clear auth and switch to public view
// - `onBackToSite` (fn) - callback to switch to public view but keep token
export default function AdminPanel({ user, onLogout, onBackToSite }){
  const modules = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'quotes', name: 'Quote Requests', icon: '💬' },
    { id: 'messages', name: 'Messages', icon: '✉️' },
    { id: 'inventory', name: 'Inventory', icon: '📦' },
    { id: 'applications', name: 'Job Applications', icon: '👥' },
    { id: 'orders', name: 'PanelSeal Orders', icon: '🛒' },
    { id: 'siteinfo', name: 'Site Info', icon: '🏢' },
    { id: 'settings', name: 'Media & Settings', icon: '⚙️' },
    { id: 'account', name: 'Account Security', icon: '🔐' }
  ]

  const [activeModule, setActiveModule] = useState('dashboard')

  function Sidebar(){
    const [logoUrl, setLogoUrl] = useState(null)
    useEffect(()=>{
      let mounted = true
      getActiveLogoUrl().then(u => { if (mounted) setLogoUrl(u) }).catch(()=>{})
      return ()=>{ mounted = false }
    },[])
    return (
      <div className="w-64 bg-[#0a2a52] text-white h-screen flex flex-col">
        <div className="p-6 text-[#e84424] font-bold text-xl flex items-center gap-3">
          {logoUrl ? (
            <>
              <img src={logoUrl} alt="logo" className="h-10 object-contain" />
              <div className="hidden md:block text-[#e84424] font-bold text-xl">Midway Admin</div>
            </>
          ) : (
            <div className="text-[#e84424] font-bold text-xl">Midway Admin</div>
          )}
        </div>
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
        <Suspense fallback={
          <div className="flex items-center justify-center h-full">
            <div className="text-xl text-gray-600">Loading module...</div>
          </div>
        }>
          {activeModule === 'dashboard' && <DashboardModule />}
          {activeModule === 'quotes' && <QuotesModule />}
          {activeModule === 'messages' && <MessagesModule />}
          {activeModule === 'inventory' && <InventoryModule />}
          {activeModule === 'applications' && <ApplicationsModule />}
          {activeModule === 'orders' && <OrdersModule />}
          {activeModule === 'siteinfo' && <SiteSettingsModule token={user?.token} />}
          {activeModule === 'settings' && <SettingsModule />}
          {activeModule === 'account' && <AccountModule user={user} />}
        </Suspense>
      </div>
    </div>
  )
}
