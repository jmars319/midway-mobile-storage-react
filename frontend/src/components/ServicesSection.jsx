import React from 'react'
import { API_BASE, BACKEND_ORIGIN } from '../config'

export const SERVICES_DATA = [
  {
    title: "Container Rentals",
    description: "Short-term and long-term shipping container rentals...",
    features: ["20ft & 40ft options", "Weather-resistant", "Secure locking systems"]
  },
  {
    title: "Container Sales",
    description: "Purchase new or used shipping containers...",
    features: ["New & used inventory", "Certified quality", "Delivery included"]
  },
  {
    title: "Trailer Rentals",
    description: "Full-size enclosed trailers...",
    features: ["Various sizes", "Enclosed protection", "Flexible terms"]
  },
  {
    title: "Custom Builds",
    description: "Transform containers into custom solutions...",
    features: ["Custom modifications", "Professional installation", "Design consultation"]
  }
]

export default function ServicesSection(){
  const [bgMap, setBgMap] = React.useState({})

  React.useEffect(()=>{
    // fetch public mapping of service background images from the backend
    fetch(`${API_BASE}/public/services-media`).then(r=>r.ok? r.json() : null).then(j=>{
      if (!j) return
      // prefix backend origin so images load correctly when backend is on a different origin
      const prefixed = {}
      Object.keys(j).forEach(k => { prefixed[k] = j[k] ? (BACKEND_ORIGIN + j[k]) : null })
      setBgMap(prefixed)
    }).catch(()=>{})
  },[])

  return (
    <section id="services" className="py-20 bg-white text-black">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-[#0a2a52]">Our Services</h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {SERVICES_DATA.map(s => {
            // compute slug (should match admin usage)
            const slug = (s.slug || s.title).toString().toLowerCase().replace(/[^a-z0-9]+/g, '-')
            const bgUrl = bgMap[slug] || null
            const style = bgUrl ? { backgroundImage: `url(${bgUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}
            return (
              <div key={s.title} style={style} className="relative bg-gray-50 p-6 rounded-lg border-t-4 border-[#e84424] hover:shadow-xl transition overflow-hidden" role="article" aria-label={`${s.title} service details`}>
                {bgUrl && <div className="absolute inset-0 bg-black/40 pointer-events-none" aria-hidden="true"></div>}
                <div className="relative z-10">
                  <div className={bgUrl ? 'bg-[rgba(0,0,0,0.15)] p-2 rounded-md backdrop-blur-sm block md:inline-block w-full md:w-auto' : ''}>
                    <h3 className={`text-xl font-semibold ${bgUrl ? 'text-white' : 'text-[#0a2a52]'}`}>{s.title}</h3>
                    <p className={`mt-2 ${bgUrl ? 'text-gray-200' : 'text-gray-700'}`}>{s.description}</p>
                    <ul className="mt-4 space-y-2">
                      {s.features.map(f => (
                        <li key={f} className="flex items-start gap-3">
                          <span className="text-[#e84424] font-bold">•</span>
                          <span className={`${bgUrl ? 'text-gray-200' : 'text-gray-700'}`}>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
