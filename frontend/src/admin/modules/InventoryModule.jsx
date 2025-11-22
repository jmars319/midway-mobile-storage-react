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
            <caption className="sr-only">Inventory items list</caption>
            <thead className="bg-[#0a2a52] text-white"><tr><th className="px-6 py-3 text-left">Type</th><th className="px-6 py-3 text-left">Condition</th><th className="px-6 py-3 text-left">Status</th><th className="px-6 py-3 text-left">Total Qty</th><th className="px-6 py-3 text-left">Available</th><th className="px-6 py-3 text-left">Rented</th><th className="px-6 py-3 text-left">Actions</th></tr></thead>
            <tbody>
              {inventory.map(i=> (
                <tr key={i.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{i.type}</td>
                  <td className="px-6 py-4">{i.condition}</td>
                  <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-sm ${i.status==='Available' ? 'bg-green-100 text-green-800' : i.status==='Rented' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>{i.status}</span></td>
                  <td className="px-6 py-4 font-semibold">{i.quantity}</td>
                  <td className="px-6 py-4 text-green-700">{i.status === 'Available' ? i.quantity : 0}</td>
                  <td className="px-6 py-4 text-blue-700">{i.status === 'Rented' ? i.quantity : 0}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => setSelected(i)} className="text-blue-600 mr-3">Manage Units</button>
                    <button onClick={() => { setSelected(i); setEditing(true) }} className="text-[#e84424] mr-3">Edit</button>
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
      {/* Unit Management Modal */}
      {selected && !editing && (
        <UnitManagementModal 
          item={selected} 
          onClose={()=>setSelected(null)} 
          onUpdate={(updatedItem)=>{ 
            setSelected(updatedItem); 
            setInventory(prev => prev.map(it => it.id === updatedItem.id ? updatedItem : it.id === updatedItem.id ? null : it).filter(Boolean)); 
            load(); // Reload to get fresh data
          }} 
        />
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

function UnitManagementModal({ item, onClose, onUpdate }){
  const [unitCount, setUnitCount] = useState({ toRent: 1, toReturn: 1, toSell: 1 })
  const token = localStorage.getItem('midway_token')
  
  const availableUnits = item.status === 'Available' ? item.quantity : 0
  const rentedUnits = item.status === 'Rented' ? item.quantity : 0
  
  async function rentUnits(){
    if (availableUnits < unitCount.toRent) {
      showToast('Not enough available units', { type: 'error' })
      return
    }
    try{
      const res = await fetch(`${API_BASE}/inventory/${item.id}`, { 
        method: 'PUT', 
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, 
        body: JSON.stringify({ status: 'Rented', quantity: item.quantity }) 
      })
      if (res.ok){ 
        const j = await res.json()
        onUpdate(j.item)
        showToast(`${unitCount.toRent} unit(s) marked as rented`, { type: 'success' })
      } else { 
        const txt = await res.text()
        showToast('Update failed: ' + txt, { type: 'error' })
      }
    }catch(e){ 
      if (import.meta.env.DEV) console.error(e)
      showToast('Update error', { type: 'error' })
    }
  }
  
  async function returnUnits(){
    if (rentedUnits < unitCount.toReturn) {
      showToast('Not enough rented units', { type: 'error' })
      return
    }
    try{
      const res = await fetch(`${API_BASE}/inventory/${item.id}`, { 
        method: 'PUT', 
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, 
        body: JSON.stringify({ status: 'Available', quantity: item.quantity }) 
      })
      if (res.ok){ 
        const j = await res.json()
        onUpdate(j.item)
        showToast(`${unitCount.toReturn} unit(s) returned to available`, { type: 'success' })
      } else { 
        const txt = await res.text()
        showToast('Update failed: ' + txt, { type: 'error' })
      }
    }catch(e){ 
      if (import.meta.env.DEV) console.error(e)
      showToast('Update error', { type: 'error' })
    }
  }
  
  async function sellUnits(){
    if (item.quantity < unitCount.toSell) {
      showToast('Not enough units to sell', { type: 'error' })
      return
    }
    const newQuantity = item.quantity - unitCount.toSell
    try{
      const res = await fetch(`${API_BASE}/inventory/${item.id}`, { 
        method: 'PUT', 
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, 
        body: JSON.stringify({ quantity: newQuantity }) 
      })
      if (res.ok){ 
        const j = await res.json()
        if (newQuantity === 0) {
          // Optionally delete the item if quantity reaches 0
          showToast(`All units sold. Item still in inventory with 0 quantity.`, { type: 'success' })
        } else {
          showToast(`${unitCount.toSell} unit(s) removed from inventory`, { type: 'success' })
        }
        onUpdate(j.item)
      } else { 
        const txt = await res.text()
        showToast('Update failed: ' + txt, { type: 'error' })
      }
    }catch(e){ 
      if (import.meta.env.DEV) console.error(e)
      showToast('Update error', { type: 'error' })
    }
  }
  
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-[#0a2a52]">Manage Units</h3>
            <p className="text-sm text-gray-600">{item.type} - {item.condition}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded border">
            <div className="text-sm text-gray-600">Total Units</div>
            <div className="text-3xl font-bold text-[#0a2a52]">{item.quantity}</div>
          </div>
          <div className="bg-green-50 p-4 rounded border border-green-200">
            <div className="text-sm text-green-700">Available</div>
            <div className="text-3xl font-bold text-green-700">{availableUnits}</div>
          </div>
          <div className="bg-blue-50 p-4 rounded border border-blue-200">
            <div className="text-sm text-blue-700">Rented</div>
            <div className="text-3xl font-bold text-blue-700">{rentedUnits}</div>
          </div>
        </div>
        
        <div className="space-y-4">
          {/* Rent Units */}
          {availableUnits > 0 && (
            <div className="border rounded p-4 bg-blue-50">
              <h4 className="font-semibold text-[#0a2a52] mb-2">📦 Rent Units</h4>
              <p className="text-sm text-gray-600 mb-3">Move units from Available to Rented status</p>
              <div className="flex items-center gap-3">
                <input 
                  type="number" 
                  min="1" 
                  max={availableUnits}
                  value={unitCount.toRent} 
                  onChange={e=>setUnitCount({...unitCount, toRent: Math.max(1, Math.min(availableUnits, Number(e.target.value)))})} 
                  className="p-2 border rounded w-24"
                />
                <button onClick={rentUnits} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                  Rent {unitCount.toRent} Unit{unitCount.toRent !== 1 ? 's' : ''}
                </button>
              </div>
            </div>
          )}
          
          {/* Return Units */}
          {rentedUnits > 0 && (
            <div className="border rounded p-4 bg-green-50">
              <h4 className="font-semibold text-[#0a2a52] mb-2">↩️ Return Units</h4>
              <p className="text-sm text-gray-600 mb-3">Move units from Rented back to Available status</p>
              <div className="flex items-center gap-3">
                <input 
                  type="number" 
                  min="1" 
                  max={rentedUnits}
                  value={unitCount.toReturn} 
                  onChange={e=>setUnitCount({...unitCount, toReturn: Math.max(1, Math.min(rentedUnits, Number(e.target.value)))})} 
                  className="p-2 border rounded w-24"
                />
                <button onClick={returnUnits} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
                  Return {unitCount.toReturn} Unit{unitCount.toReturn !== 1 ? 's' : ''}
                </button>
              </div>
            </div>
          )}
          
          {/* Sell/Remove Units */}
          <div className="border rounded p-4 bg-red-50">
            <h4 className="font-semibold text-[#0a2a52] mb-2">🗑️ Sell/Remove Units</h4>
            <p className="text-sm text-gray-600 mb-3">Permanently remove units from inventory (sold, scrapped, etc.)</p>
            <div className="flex items-center gap-3">
              <input 
                type="number" 
                min="1" 
                max={item.quantity}
                value={unitCount.toSell} 
                onChange={e=>setUnitCount({...unitCount, toSell: Math.max(1, Math.min(item.quantity, Number(e.target.value)))})} 
                className="p-2 border rounded w-24"
              />
              <button onClick={sellUnits} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
                Remove {unitCount.toSell} Unit{unitCount.toSell !== 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded">Close</button>
        </div>
      </div>
    </div>
  )
}
