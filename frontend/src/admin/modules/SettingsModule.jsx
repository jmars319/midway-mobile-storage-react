import React, { useState, useEffect } from 'react'
import ConfirmModal from '../../components/ConfirmModal'
import { showToast } from '../../components/Toast'
import { SERVICES_DATA } from '../../components/ServicesSection'
import { API_BASE, BACKEND_ORIGIN } from '../../config'

export default function SettingsModule(){
  const [selectedFile, setSelectedFile] = useState(null)
  const [selectedPreviewUrl, setSelectedPreviewUrl] = useState(null)
  const [selectedTags, setSelectedTags] = useState([])
  const [info, setInfo] = useState({ phone:'', email:'', address:'' })
  const [media, setMedia] = useState([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const token = typeof window !== 'undefined' ? localStorage.getItem('midway_token') : null
  const [filter, setFilter] = useState('all')
  const [brokenImages, setBrokenImages] = useState([])
  const [pendingDelete, setPendingDelete] = useState(null)

  const save = ()=> showToast('Settings saved (demo)', { type: 'success' })

  async function loadMedia(){
    setError(null)
    try{
      const q = filter && filter !== 'all' ? `?tag=${encodeURIComponent(filter)}` : ''
      const res = await fetch(`${API_BASE}/media${q}`, { headers: { Authorization: `Bearer ${token}` }})
      if (res.status === 401) { localStorage.removeItem('midway_token'); window.location.reload(); return }
      if (res.ok){ const j = await res.json(); setMedia(j.media || []) }
      else setError('Failed to load media')
    }catch(e){ if (import.meta.env.DEV) console.error(e); setError(String(e)) }
  }

  useEffect(()=>{ loadMedia() },[])
  useEffect(()=>{ loadMedia() },[filter])

  // revoke preview object URL when selected file changes/unmount
  useEffect(()=>{
    return () => { if (selectedPreviewUrl) URL.revokeObjectURL(selectedPreviewUrl) }
  },[selectedPreviewUrl])

  async function handleUpload(e){
    const file = e.target.files?.[0]
    setSelectedFile(file || null)
    setSelectedPreviewUrl(file ? URL.createObjectURL(file) : null)
  }

  async function performUpload(){
    if (!selectedFile) { showToast('Choose a file first', { type: 'error' }); return }
    setUploading(true); setError(null)
    const fd = new FormData()
    fd.append('file', selectedFile)
    if (selectedTags && selectedTags.length) fd.append('tags', JSON.stringify(selectedTags))
    try{
      const res = await fetch(`${API_BASE}/media`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd })
      if (res.status === 401) { localStorage.removeItem('midway_token'); window.location.reload(); return }
      if (res.ok){
        await loadMedia();
        setSelectedFile(null);
        setSelectedPreviewUrl(null);
        setSelectedTags([]);
      } else { setError('Upload failed') }
    }catch(e){ if (import.meta.env.DEV) console.error(e); setError(String(e)) }
    setUploading(false)
  }

  function toggleTag(tag){
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t=>t!==tag) : [...prev, tag])
  }

  async function setTags(name, tags){
    try{
      const res = await fetch(`${API_BASE}/media/${encodeURIComponent(name)}/tags`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ tags }) })
      if (res.status === 401) { localStorage.removeItem('midway_token'); window.location.reload(); return }
      if (res.ok) await loadMedia(); else setError('Failed to set tags')
    }catch(e){ if (import.meta.env.DEV) console.error(e); setError(String(e)) }
  }

  async function handleDelete(name){
    try{
      const res = await fetch(`${API_BASE}/media/${encodeURIComponent(name)}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` }})
      if (res.status === 401) { localStorage.removeItem('midway_token'); window.location.reload(); return }
      if (res.ok) await loadMedia(); else setError('Delete failed')
    }catch(e){ if (import.meta.env.DEV) console.error(e); setError(String(e)) }
  }

  // helpers to get active logo/hero
  const activeLogo = media.find(m => Array.isArray(m.tags) && m.tags.includes('logo')) || null
  const activeHero = media.find(m => Array.isArray(m.tags) && m.tags.includes('hero')) || null

  const clearActive = async (kind) => {
    const item = kind === 'logo' ? activeLogo : activeHero
    if (!item) return
    const newTags = (item.tags || []).filter(t => t !== kind)
    await setTags(item.name, newTags)
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-[#0a2a52] mb-6">Media Manager</h1>
      <div className="grid gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-[#0a2a52] mb-4">Active Media</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded p-4 text-center">
              <div className="text-sm text-gray-600 mb-2">Active Logo</div>
              {activeLogo ? (
                <div>
                  {!brokenImages.includes(activeLogo.name) ? (
                    <img src={BACKEND_ORIGIN + activeLogo.url} alt={activeLogo.originalName || 'logo'} loading="lazy" className="mx-auto h-28 object-contain mb-2" onError={() => setBrokenImages(prev => prev.includes(activeLogo.name) ? prev : [...prev, activeLogo.name])} />
                  ) : (
                    <div className="h-28 flex items-center justify-center text-sm text-gray-600 mb-2">{activeLogo.originalName || activeLogo.name}</div>
                  )}
                  <div className="text-xs text-gray-600 mb-2">{activeLogo.originalName || activeLogo.name}</div>
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={()=>navigator.clipboard.writeText(BACKEND_ORIGIN + activeLogo.url)} className="text-sm px-2 py-1 bg-gray-200 rounded">Copy URL</button>
                    <button onClick={()=>clearActive('logo')} className="text-sm px-2 py-1 bg-red-100 text-red-700 rounded">Clear</button>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-600">No active logo selected. Mark an uploaded image as logo or upload and mark it now.</div>
              )}
            </div>
            <div className="border rounded p-4 text-center">
              <div className="text-sm text-gray-600 mb-2">Active Hero</div>
              {activeHero ? (
                <div>
                  {!brokenImages.includes(activeHero.name) ? (
                    <img src={BACKEND_ORIGIN + activeHero.url} alt={activeHero.originalName || 'hero'} loading="lazy" className="mx-auto h-40 object-cover mb-2 w-full" onError={() => setBrokenImages(prev => prev.includes(activeHero.name) ? prev : [...prev, activeHero.name])} />
                  ) : (
                    <div className="h-40 flex items-center justify-center text-sm text-gray-600 mb-2">{activeHero.originalName || activeHero.name}</div>
                  )}
                  <div className="text-xs text-gray-600 mb-2">{activeHero.originalName || activeHero.name}</div>
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={()=>navigator.clipboard.writeText(BACKEND_ORIGIN + activeHero.url)} className="text-sm px-2 py-1 bg-gray-200 rounded">Copy URL</button>
                    <button onClick={()=>clearActive('hero')} className="text-sm px-2 py-1 bg-red-100 text-red-700 rounded">Clear</button>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-600">No active hero selected. Mark an uploaded image as hero or upload and mark it now.</div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-[#0a2a52] mb-4">Service Backgrounds</h2>
          <p className="text-sm text-gray-600 mb-3">Choose a gallery image to use as the background for each public service card.</p>
          <div className="grid gap-3">
            {SERVICES_DATA.map(s => {
              const slug = (s.slug || s.title).toString().toLowerCase().replace(/[^a-z0-9]+/g, '-')
              const assigned = media.find(m => Array.isArray(m.tags) && m.tags.includes(`service:${slug}`)) || null
              return (
                <div key={slug} className="border rounded p-3 flex items-center gap-4">
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-[#0a2a52]">{s.title}</div>
                    <div className="text-xs text-gray-600">slug: <code className="text-xs">{slug}</code></div>
                    {assigned ? (
                      <div className="mt-2 flex items-center gap-3">
                        <img src={(BACKEND_ORIGIN + assigned.url)} alt={assigned.originalName || assigned.name} loading="lazy" className="h-16 w-24 object-cover rounded" />
                        <div className="text-sm text-gray-700">{assigned.originalName || assigned.name}</div>
                        <div className="ml-auto flex items-center gap-2">
                          <button onClick={()=> navigator.clipboard.writeText(BACKEND_ORIGIN + assigned.url)} className="text-xs px-2 py-1 bg-gray-200 rounded">Copy URL</button>
                          <button onClick={async ()=>{ await setTags(assigned.name, (assigned.tags||[]).filter(t=>t!==`service:${slug}`)); await loadMedia(); }} className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded">Clear</button>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-2 text-sm text-gray-600">No background assigned.</div>
                    )}
                  </div>
                  <div className="w-56">
                    <div className="text-xs text-gray-500 mb-1">Choose from uploaded media</div>
                    <div className="grid grid-cols-2 gap-2">
                      {(media || []).filter(m => Array.isArray(m.tags) && m.tags.includes('gallery')).length === 0 && (
                        <div className="text-sm text-gray-600 col-span-2">No gallery images available.</div>
                      )}
                      {(media || []).filter(m => Array.isArray(m.tags) && m.tags.includes('gallery')).map(m => (
                        <button key={m.name} onClick={async ()=>{ await setTags(m.name, Array.from(new Set([...(m.tags||[]), `service:${slug}`]))); await loadMedia(); }} className="border rounded overflow-hidden">
                          <img src={BACKEND_ORIGIN + m.url} alt={m.originalName || m.name} loading="lazy" className="h-20 w-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-[#0a2a52] mb-4">Upload & Manage Media</h2>
          <div className="mb-3">
            <label className="block text-sm text-gray-700 mb-1">Upload media (images/videos)</label>
            <input type="file" onChange={handleUpload} accept="image/*,video/*" />
            <div className="mt-2 flex items-center gap-3">
              <button onClick={performUpload} type="button" className="bg-[#e84424] text-white px-3 py-1 rounded" disabled={uploading}>{uploading ? 'Uploading…' : 'Upload'}</button>
              {selectedFile && <div className="text-sm text-gray-700">{selectedFile.name}</div>}
            </div>
            {selectedPreviewUrl && (
              <div className="mt-2">
                <div className="text-sm text-gray-600 mb-1">Preview</div>
                <img src={selectedPreviewUrl} alt="preview" className="h-32 object-contain border rounded" />
              </div>
            )}
            <div className="mt-3 flex items-center gap-2">
              <label className={`px-2 py-1 rounded cursor-pointer ${selectedTags.includes('logo') ? 'bg-[#e84424] text-white' : 'bg-gray-100'}`}><input type="checkbox" checked={selectedTags.includes('logo')} onChange={()=>toggleTag('logo')} className="mr-2" />Logo</label>
              <label className={`px-2 py-1 rounded cursor-pointer ${selectedTags.includes('hero') ? 'bg-[#e84424] text-white' : 'bg-gray-100'}`}><input type="checkbox" checked={selectedTags.includes('hero')} onChange={()=>toggleTag('hero')} className="mr-2" />Hero</label>
              <label className={`px-2 py-1 rounded cursor-pointer ${selectedTags.includes('gallery') ? 'bg-[#e84424] text-white' : 'bg-gray-100'}`}><input type="checkbox" checked={selectedTags.includes('gallery')} onChange={()=>toggleTag('gallery')} className="mr-2" />Gallery</label>
            </div>
            {uploading && <div className="text-sm text-gray-600 mt-2">Uploading…</div>}
            {error && <div className="text-sm text-red-600 mt-2">{error}</div>}
          </div>

          <div>
            <div className="mb-3 flex items-center gap-2">
              <button onClick={()=> setFilter('all') } className={`px-3 py-1 rounded ${filter==='all' ? 'bg-[#e84424] text-white' : 'bg-gray-100'}`}>All</button>
              <button onClick={()=> setFilter('logo') } className={`px-3 py-1 rounded ${filter==='logo' ? 'bg-[#e84424] text-white' : 'bg-gray-100'}`}>Logos</button>
              <button onClick={()=> setFilter('hero') } className={`px-3 py-1 rounded ${filter==='hero' ? 'bg-[#e84424] text-white' : 'bg-gray-100'}`}>Hero</button>
              <button onClick={()=> setFilter('gallery') } className={`px-3 py-1 rounded ${filter==='gallery' ? 'bg-[#e84424] text-white' : 'bg-gray-100'}`}>Gallery</button>
            </div>
            <h3 className="text-sm font-semibold mb-2">Uploaded media</h3>
            {media.length === 0 && <div className="text-sm text-gray-600">No media uploaded yet.</div>}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
              {media.map(m => (
                <div key={m.name} className="border rounded p-2 text-center">
                  {brokenImages.includes(m.name) ? (
                    <div className="h-24 flex items-center justify-center text-sm text-gray-600">{m.originalName || m.name}</div>
                  ) : (
                    <img
                      src={BACKEND_ORIGIN + m.url}
                      alt={m.originalName || m.name}
                      loading="lazy"
                      className="mx-auto h-24 object-contain"
                      onError={() => setBrokenImages(prev => prev.includes(m.name) ? prev : [...prev, m.name])}
                    />
                  )}
                  <div className="mt-2 text-xs text-gray-600 break-words">{m.name}</div>
                  <div className="mt-2 flex items-center justify-center gap-2">
                    <button onClick={()=>navigator.clipboard.writeText(BACKEND_ORIGIN + m.url)} className="text-sm px-2 py-1 bg-gray-200 rounded">Copy URL</button>
                    <button onClick={()=>setPendingDelete(m)} className="text-sm px-2 py-1 bg-red-100 text-red-700 rounded">Delete</button>
                  </div>
                  <div className="mt-2 flex items-center justify-center gap-2">
                    {/* tag badges */}
                    {(m.tags || []).map(t => <span key={t} className="text-xs bg-gray-100 px-2 py-1 rounded">{t}</span>)}
                  </div>
                  <div className="mt-2 flex items-center justify-center gap-2">
                    <button onClick={()=> setTags(m.name, Array.from(new Set([...(m.tags||[]),'logo']))) } className="text-xs px-2 py-1 bg-blue-100 rounded">Mark logo</button>
                    <button onClick={()=> setTags(m.name, Array.from(new Set([...(m.tags||[]),'hero']))) } className="text-xs px-2 py-1 bg-green-100 rounded">Mark hero</button>
                    <button onClick={()=> setTags(m.name, Array.from(new Set([...(m.tags||[]),'gallery']))) } className="text-xs px-2 py-1 bg-yellow-100 rounded">Add to gallery</button>
                  </div>
                </div>
              ))}
            </div>
            {pendingDelete && (
              <ConfirmModal
                title="Delete media"
                message={`Delete "${pendingDelete.originalName || pendingDelete.name}"? This cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                loading={pendingDelete.loading}
                onCancel={()=>setPendingDelete(null)}
                onConfirm={async ()=>{
                  // mark a temporary loading flag on the pendingDelete object so the modal can reflect state
                  setPendingDelete(prev => ({ ...(prev||{}), loading: true }))
                  try{
                    await handleDelete(pendingDelete.name)
                  }catch(e){ if (import.meta.env.DEV) console.error(e); showToast('Delete failed', { type: 'error' }) }
                  setPendingDelete(null)
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
