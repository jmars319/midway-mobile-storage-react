import { API_BASE, BACKEND_ORIGIN } from '../config'

export async function getActiveLogoUrl(){
  try{
    // public endpoint that returns the active logo (no auth required)
    const res = await fetch(`${API_BASE}/public/logo`)
    if (!res.ok) return null
    const j = await res.json()
    if (!j || !j.url) return null
    return BACKEND_ORIGIN + j.url
  }catch(e){
    if (import.meta.env.DEV) console.error('getActiveLogoUrl error', e)
    return null
  }
}

export { BACKEND_ORIGIN as BACKEND }

export async function getActiveHeroUrl(){
  try{
    const res = await fetch(`${API_BASE}/public/hero`)
    if (!res.ok) return null
    const j = await res.json()
    if (!j || !j.url) return null
    // Backend now automatically optimizes all uploads to WebP
    // No frontend mapping needed - just use the URL directly
    return BACKEND_ORIGIN + j.url
  }catch(e){
    if (import.meta.env.DEV) console.error('getActiveHeroUrl error', e)
    return null
  }
}
