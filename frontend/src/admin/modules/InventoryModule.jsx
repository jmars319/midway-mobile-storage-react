import React, { useState, useEffect } from 'react'
import ConfirmModal from '../../components/ConfirmModal'
import { showToast } from '../../components/Toast'
import { API_BASE } from '../../config'

export default function InventoryModule(){
  const [inventory, setInventory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selected, setSelected] = useState(null)
  const [editing, setEditing] = useState(false)
  const [creating, setCreating] = useState(false)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [pendingDeleteLoading, setPendingDeleteLoading] = useState(false)
  const token = typeof window !== 'undefined' ? localStorage.getItem('midway_token') : null

  async function load(){
    setLoading(true); setError(null)
    try{
      const res = await fetch(`${API_BASE}/inventory`, { headers: { Authorization: `Bearer ${token}` }})
      if (res.status === 401) {
        localStorage.removeItem('midway_token')
        showToast('Session expired or unauthorized — please log in again', { type: 'error' })
        window.location.reload()
        return
      }
      if (res.ok) {
        const j = await res.json()
        setInventory(j.inventory || [])
      } else setError('Failed to load inventory')
    }catch(e){ if (import.meta.env.DEV) console.error(e); setError(String(e)) }
    setLoading(false)
  }

  useEffect(()=>{ load() },[])

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold text-[#0a2a52]">Inventory</h1>
        <div className="flex items-center gap-2">
          <button onClick={()=>setCreating(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded">Add Item</button>
          <button onClick={load} className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded">Refresh</button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden p-4">
        {loading && <div className="text-gray-600">Loading…</div>}
        {error && <div className="text-red-600">{error}</div>}

        {!loading && !error && inventory.length === 0 && (
          <div className="p-8 text-center text-gray-600">
            <div className="text-xl font-semibold mb-2">No inventory items</div>
            <div>No containers in inventory. Click "Add Item" to create one.</div>
          </div>
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
                  <td className="px-6 py-4">
                    <button onClick={() => { setSelected(i); setEditing(true) }} className="text-[#e84424] mr-3">Edit</button>
                    <button onClick={() => setSelected(i)} className="text-blue-600 mr-3">Details</button>
                    <button onClick={()=>setPendingDelete(i)} className="text-red-600">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {pendingDelete && (
        <ConfirmModal
          title="Delete inventory item"
          message={`Delete "${pendingDelete.type}"? This cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          onCancel={()=>setPendingDelete(null)}
          loading={pendingDeleteLoading}
          onConfirm={async ()=>{
            setPendingDeleteLoading(true)
            try{
              const token = localStorage.getItem('midway_token')
              const res = await fetch(`${API_BASE}/inventory/${pendingDelete.id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
              if (res.ok){ setInventory(prev => prev.filter(it => it.id !== pendingDelete.id)); if (selected && selected.id === pendingDelete.id) setSelected(null); setPendingDelete(null); showToast('Item deleted', { type: 'success' }) }
              else { const txt = await res.text(); showToast('Delete failed: ' + txt, { type: 'error' }); setPendingDelete(null) }
            }catch(e){ if (import.meta.env.DEV) console.error(e); showToast('Delete error', { type: 'error' }); setPendingDelete(null) }
            finally{ setPendingDeleteLoading(false) }
          }}
        />
      )}
      {/* Detail modal */}
      {selected && !editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6">
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-bold">Inventory item</h3>
              <button onClick={()=>setSelected(null)} className="text-gray-500">Close</button>
            </div>
            <div className="mt-4 space-y-2 text-sm text-gray-700">
              <div><strong>Type:</strong> {selected.type}</div>
              <div><strong>Condition:</strong> {selected.condition}</div>
              <div>
                <strong>Status:</strong>
                <button onClick={async ()=>{
                  // toggle status between Available and Unavailable
                  const newStatus = selected.status === 'Available' ? 'Unavailable' : 'Available'
                  const token = localStorage.getItem('midway_token')
                  try{
                    const res = await fetch(`${API_BASE}/inventory/${selected.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ status: newStatus }) })
                    if (res.ok){ const j = await res.json(); setSelected(j.item); setInventory(prev => prev.map(it => it.id === j.item.id ? j.item : it)); showToast('Status updated', { type: 'success' }) }
                    else { const txt = await res.text(); showToast('Status update failed: ' + txt, { type: 'error' }) }
                  }catch(e){ if (import.meta.env.DEV) console.error(e); showToast('Status update error', { type: 'error' }) }
                }} className={`ml-2 px-3 py-1 rounded-full text-sm ${selected.status==='Available' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{selected.status}</button>
              </div>
              <div><strong>Quantity:</strong> {selected.quantity}</div>
            </div>
            <div className="mt-4 text-right">
              <button onClick={()=>{ setEditing(true) }} className="px-3 py-1 bg-blue-600 text-white rounded mr-2">Edit</button>
              <button onClick={()=>setSelected(null)} className="px-3 py-1 bg-[#e84424] text-white rounded">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {selected && editing && (
        <EditInventoryModal item={selected} onClose={()=>{ setEditing(false); setSelected(null) }} onSaved={(item)=>{ setEditing(false); setSelected(null); setInventory(prev => prev.map(it => it.id === item.id ? item : it)) }} />
      )}

      {creating && (
        <CreateInventoryModal onClose={()=>setCreating(false)} onCreated={(item)=>{ setCreating(false); setInventory(prev => [item, ...prev]) }} />
      )}
    </div>
  )
}

function EditInventoryModal({ item, onClose, onSaved }){
  const [form, setForm] = useState({ type: item.type, condition: item.condition, status: item.status, quantity: item.quantity })
  const token = localStorage.getItem('midway_token')
  async function save(){
    try{
      const res = await fetch(`${API_BASE}/inventory/${item.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(form) })
      if (res.ok){ const j = await res.json(); onSaved(j.item); showToast('Saved', { type: 'success' }) }
      else { const txt = await res.text(); showToast('Save failed: ' + txt, { type: 'error' }) }
    }catch(e){ if (import.meta.env.DEV) console.error(e); showToast('Save error', { type: 'error' }) }
  }
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-bold">Edit Inventory</h3>
          <button onClick={onClose} className="text-gray-500">Close</button>
        </div>
        <div className="mt-4 grid gap-3">
          <label className="text-sm">Type</label>
          <input value={form.type} onChange={e=>setForm({...form, type: e.target.value})} className="p-2 border rounded w-full text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#e84424]" />
          <label className="text-sm">Condition</label>
          <input value={form.condition} onChange={e=>setForm({...form, condition: e.target.value})} className="p-2 border rounded w-full text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#e84424]" />
          <label className="text-sm">Status</label>
          <select value={form.status} onChange={e=>setForm({...form, status: e.target.value})} className="p-2 border rounded w-full text-gray-900 focus:ring-2 focus:ring-[#e84424]">
            <option>Available</option>
            <option>Unavailable</option>
          </select>
          <label className="text-sm">Quantity</label>
          <input type="number" value={form.quantity} onChange={e=>setForm({...form, quantity: Number(e.target.value)})} className="p-2 border rounded w-full text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#e84424]" />
        </div>
        <div className="mt-4 text-right"><button onClick={save} className="px-3 py-1 bg-[#e84424] text-white rounded">Save</button></div>
      </div>
    </div>
  )
}

function CreateInventoryModal({ onClose, onCreated }){
  const [form, setForm] = useState({ type: '', condition: '', status: 'Available', quantity: 1 })
  const token = localStorage.getItem('midway_token')
  async function create(){
    try{
      const res = await fetch(`${API_BASE}/inventory`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(form) })
      if (res.ok){ const j = await res.json(); onCreated(j.item); showToast('Created', { type: 'success' }) }
      else { const txt = await res.text(); showToast('Create failed: ' + txt, { type: 'error' }) }
    }catch(e){ if (import.meta.env.DEV) console.error(e); showToast('Create error', { type: 'error' }) }
  }
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-bold">Add Inventory Item</h3>
          <button onClick={onClose} className="text-gray-500">Close</button>
        </div>
        <div className="mt-4 grid gap-3">
          <label className="text-sm">Type</label>
          <input value={form.type} onChange={e=>setForm({...form, type: e.target.value})} className="p-2 border rounded w-full text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#e84424]" />
          <label className="text-sm">Condition</label>
          <input value={form.condition} onChange={e=>setForm({...form, condition: e.target.value})} className="p-2 border rounded w-full text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#e84424]" />
          <label className="text-sm">Status</label>
          <select value={form.status} onChange={e=>setForm({...form, status: e.target.value})} className="p-2 border rounded w-full text-gray-900 focus:ring-2 focus:ring-[#e84424]">
            <option>Available</option>
            <option>Unavailable</option>
          </select>
          <label className="text-sm">Quantity</label>
          <input type="number" value={form.quantity} onChange={e=>setForm({...form, quantity: Number(e.target.value)})} className="p-2 border rounded w-full text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#e84424]" />
        </div>
        <div className="mt-4 text-right"><button onClick={create} className="px-3 py-1 bg-[#e84424] text-white rounded">Create</button></div>
      </div>
    </div>
  )
}
