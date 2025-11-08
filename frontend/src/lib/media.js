const API_BASE = 'http://localhost:5001/api'
const BACKEND_ORIGIN = API_BASE.replace(/\/api\/?.*$/, '')

export async function getActiveLogoUrl(){
  try{
    // public endpoint that returns the active logo (no auth required)
    const res = await fetch(`${API_BASE}/public/logo`)
    if (!res.ok) return null
    const j = await res.json()
    if (!j || !j.url) return null
    return BACKEND_ORIGIN + j.url
  }catch(e){
    console.error('getActiveLogoUrl error', e)
    return null
  }
}

export const BACKEND = BACKEND_ORIGIN

export async function getActiveHeroUrl(){
  try{
    const res = await fetch(`${API_BASE}/public/hero`)
    if (!res.ok) return null
    const j = await res.json()
    if (!j || !j.url) return null
    return BACKEND_ORIGIN + j.url
  }catch(e){
    console.error('getActiveHeroUrl error', e)
    return null
  }
}
