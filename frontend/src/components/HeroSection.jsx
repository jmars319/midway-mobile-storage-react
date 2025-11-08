import React, { useEffect, useState } from 'react'
import { getActiveHeroUrl } from '../lib/media'

export default function HeroSection(){
  const [heroUrl, setHeroUrl] = useState(null)

  useEffect(()=>{
    let mounted = true
    getActiveHeroUrl().then(u => { if (mounted) setHeroUrl(u) }).catch(()=>{})
    return ()=>{ mounted = false }
  },[])

  const sectionStyle = heroUrl ? { backgroundImage: `url(${heroUrl})` } : undefined

  return (
    <section id="hero" style={sectionStyle} className={`relative pt-32 pb-20 text-white bg-center bg-cover ${heroUrl ? '' : 'bg-gradient-to-br from-[#0a2a52] via-[#0d3464] to-[#0a2a52]'}`}>
      {/* overlay to keep text readable when using a photo (lighter since blocks have backdrops) */}
      {heroUrl && <div className="absolute inset-0 bg-black/30 pointer-events-none" aria-hidden="true"></div>}
      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center px-6">
        <div className="space-y-6">
          <div className="bg-black/50 p-6 rounded-md backdrop-blur-sm">
            <h1 className="text-5xl font-extrabold">Storage Solutions <span className="text-[#e84424]">Delivered</span></h1>
            <p className="text-gray-200 max-w-xl">Reliable container rentals, sales, and custom solutions — fast delivery and professional installation. Get a quote or explore our services.</p>

            <div className="flex flex-wrap gap-3 mt-4">
              <a href="#quote" className="inline-block bg-[#e84424] text-white px-5 py-3 rounded-md font-semibold">Get Free Quote</a>
              <a href="#services" className="inline-block border border-white text-white px-5 py-3 rounded-md">View Services</a>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="bg-black/50 p-6 rounded-lg backdrop-blur-sm">
            <h3 className="text-xl font-semibold text-white">Why customers choose us</h3>
            <ul className="mt-4 space-y-3 text-gray-200">
              <li className="flex items-start gap-3"><span className="text-[#e84424] font-bold">✓</span> Secure, weatherproof containers</li>
              <li className="flex items-start gap-3"><span className="text-[#e84424] font-bold">✓</span> Fast local delivery</li>
              <li className="flex items-start gap-3"><span className="text-[#e84424] font-bold">✓</span> Competitive pricing</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
