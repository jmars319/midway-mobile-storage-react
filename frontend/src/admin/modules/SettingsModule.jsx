import React, { useState } from 'react'

export default function SettingsModule(){
  const [info, setInfo] = useState({ phone:'', email:'', address:'' })
  const save = ()=> alert('Settings saved (demo)')
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-[#0a2a52] mb-6">Settings</h1>
      <div className="grid gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-[#0a2a52] mb-4">Business Information</h2>
          <div className="grid gap-3">
            <input placeholder="Phone" value={info.phone} onChange={e=>setInfo({...info, phone:e.target.value})} className="p-2 border rounded" />
            <input placeholder="Email" value={info.email} onChange={e=>setInfo({...info, email:e.target.value})} className="p-2 border rounded" />
            <input placeholder="Address" value={info.address} onChange={e=>setInfo({...info, address:e.target.value})} className="p-2 border rounded" />
            <div className="text-right"><button onClick={save} className="bg-[#e84424] text-white px-4 py-2 rounded">Save Changes</button></div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-[#0a2a52] mb-4">Admin Users</h2>
          <button className="bg-blue-600 text-white px-3 py-2 rounded">Add New Admin</button>
        </div>
      </div>
    </div>
  )
}
