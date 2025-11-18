import React, { useState, useEffect } from 'react'
import { BACKEND } from '../../lib/media'
import { showToast } from '../../components/Toast'
import ConfirmModal from '../../components/ConfirmModal'

const API_BASE = 'http://localhost:5001/api'

export default function ApplicationsModule(){
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selected, setSelected] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [pendingDeleteLoading, setPendingDeleteLoading] = useState(false)
  const token = typeof window !== 'undefined' ? localStorage.getItem('midway_token') : null

  async function load(){
    setLoading(true); setError(null)
    try{
      const res = await fetch(`${API_BASE}/applications`, { headers: { Authorization: `Bearer ${token}` }})
      if (res.status === 401) {
        localStorage.removeItem('midway_token')
        showToast('Session expired or unauthorized — please log in again', { type: 'error' })
        window.location.reload()
        return
      }
      if (res.ok) {
        const j = await res.json()
        setApplications(j.applications || [])
      } else setError('Failed to load applications')
    }catch(e){ if (import.meta.env.DEV) console.error(e); setError(String(e)) }
    setLoading(false)
  }

  useEffect(()=>{ load() },[])

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold text-[#0a2a52]">Job Applications</h1>
        <div><button onClick={load} className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded">Refresh</button></div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden p-4">
        {loading && <div className="text-gray-600">Loading…</div>}
        {error && <div className="text-red-600">{error}</div>}

        {!loading && !error && applications.length === 0 && (
          <div className="p-8 text-center text-gray-600">
            <div className="text-xl font-semibold mb-2">No applications yet</div>
            <div>No job applications have been submitted.</div>
          </div>
        )}

        {!loading && !error && applications.length > 0 && (
          <table className="w-full">
            <thead className="bg-[#0a2a52] text-white"><tr><th className="px-6 py-3 text-left">Name</th><th className="px-6 py-3 text-left">Position</th><th className="px-6 py-3 text-left">Date</th><th className="px-6 py-3 text-left">Status</th><th className="px-6 py-3 text-left">Actions</th></tr></thead>
            <tbody>
              {applications.map(a=> (
                <tr key={a.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{a.name}</td>
                  <td className="px-6 py-4">{a.position}</td>
                  <td className="px-6 py-4">{a.date}</td>
                  <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-sm ${a.status==='new' ? 'bg-blue-100 text-blue-800' : a.status==='reviewing' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{a.status}</span></td>
                  <td className="px-6 py-4">
                    <button onClick={() => setSelected(a)} className="text-[#e84424] mr-3">View</button>
                    <button onClick={() => {
                      if (a.resume){
                        // open resume — it may be a full url or a backend uploads path/name
                        const url = a.resume.startsWith('/') ? `${BACKEND}${a.resume}` : (a.resume.startsWith('http') ? a.resume : `${BACKEND}/uploads/${a.resume}`)
                        window.open(url, '_blank')
                      } else {
                        showToast('No resume available', { type: 'info' })
                      }
                    }} className="text-blue-600 mr-3">Resume</button>
                    <button onClick={() => setPendingDelete(a)} className="text-red-600">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Delete confirmation modal */}
      {pendingDelete && (
        <ConfirmModal
          title="Delete application"
          message={`Delete application from "${pendingDelete.name}"? This cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          onCancel={() => setPendingDelete(null)}
          loading={pendingDeleteLoading}
          onConfirm={async () => {
            setPendingDeleteLoading(true)
            try {
              const res = await fetch(`${API_BASE}/applications/${pendingDelete.id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
              })
              if (res.ok) {
                setApplications(prev => prev.filter(a => a.id !== pendingDelete.id))
                if (selected && selected.id === pendingDelete.id) setSelected(null)
                setPendingDelete(null)
                showToast('Application deleted', { type: 'success' })
              } else {
                const txt = await res.text()
                showToast('Delete failed: ' + txt, { type: 'error' })
                setPendingDelete(null)
              }
            } catch (e) {
              if (import.meta.env.DEV) console.error(e)
              showToast('Delete error', { type: 'error' })
              setPendingDelete(null)
            } finally {
              setPendingDeleteLoading(false)
            }
          }}
        />
      )}

      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-bold">Application: {selected.name}</h3>
              <button onClick={()=>setSelected(null)} className="text-gray-500">Close</button>
            </div>
            <div className="mt-4 text-sm text-gray-700 space-y-2">
              <div><strong>Position:</strong> {selected.position}</div>
              <div><strong>Email:</strong> {selected.email}</div>
              <div><strong>Phone:</strong> {selected.phone || '—'}</div>
              <div><strong>Experience:</strong> {selected.experience || '—'}</div>
              <div>
                <strong>Status:</strong>
                <button onClick={async ()=>{
                  // cycle status: new -> reviewing -> accepted -> rejected
                  const order = ['new','reviewing','accepted','rejected']
                  const cur = selected.status || 'new'
                  const next = order[(order.indexOf(cur) + 1) % order.length]
                  const token = localStorage.getItem('midway_token')
                  try{
                    const res = await fetch(`${API_BASE}/applications/${selected.id}/status`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ status: next }) })
                    if (res.ok){ const j = await res.json(); setSelected(j.application); setApplications(prev => prev.map(it => it.id === j.application.id ? j.application : it)); showToast('Status updated', { type: 'success' }) }
                    else { const txt = await res.text(); showToast('Status update failed: ' + txt, { type: 'error' }) }
                  }catch(e){ if (import.meta.env.DEV) console.error(e); showToast('Status update error', { type: 'error' }) }
                }} className={`ml-2 px-3 py-1 rounded-full text-sm ${selected.status==='new' ? 'bg-blue-100 text-blue-800' : selected.status==='reviewing' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{selected.status}</button>
              </div>
            </div>
            <div className="mt-4 text-right"><button onClick={()=>setSelected(null)} className="px-3 py-1 bg-[#e84424] text-white rounded">Close</button></div>
          </div>
        </div>
      )}
    </div>
  )
}
