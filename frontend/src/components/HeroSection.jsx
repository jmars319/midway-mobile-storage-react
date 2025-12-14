import React, { useEffect, useState } from 'react'
import { getActiveHeroUrl } from '../lib/media'
import { REVIEW_URL, PRIVATE_FEEDBACK_LINK } from '../config'

export default function HeroSection(){
  const [heroUrl, setHeroUrl] = useState(null)

  useEffect(()=>{
    let mounted = true
    getActiveHeroUrl().then(u => { if (mounted) setHeroUrl(u) }).catch(()=>{})
    return ()=>{ mounted = false }
  },[])

  // Use an actual <img> element for the hero so browsers treat it as an image
  // LCP candidate (allows width/height, loading attributes and modern formats).
  // We keep a gradient fallback when no hero is available.
  const hasHero = Boolean(heroUrl)

  return (
    <section id="hero" className={`relative pt-32 pb-20 text-white bg-center ${hasHero ? '' : 'bg-gradient-to-br from-[#0a2a52] via-[#0d3464] to-[#0a2a52]'}`}>
      {/* hero image as an absolutely-positioned <img> so it's counted as an LCP element */}
      {heroUrl && (
        <img
          src={heroUrl}
          alt="Row of storage containers at Midway Mobile Storage"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          fetchpriority="high"
          decoding="sync"
          width="1200"
          height="630"
          sizes="100vw"
          aria-hidden="true"
        />
      )}

      {/* overlay to keep text readable when using a photo (lighter since blocks have backdrops) */}
      {hasHero && <div className="absolute inset-0 bg-black/30 pointer-events-none" aria-hidden="true"></div>}
      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center px-6">
        <div className="space-y-6">
          <div className="bg-black/50 p-6 rounded-md backdrop-blur-sm">
            <h1 className="text-5xl font-extrabold">Storage Solutions <span className="text-[#e84424]">Delivered</span></h1>
            <p className="text-gray-200 max-w-xl">Reliable container rentals, sales, and custom solutions — fast delivery and professional installation. Get a quote or explore our services.</p>

            <div className="flex flex-wrap gap-3 mt-4">
              <a href="#quote" className="inline-block bg-[#e84424] text-white px-5 py-3 rounded-md font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white" aria-label="Navigate to quote request form">Get Free Quote</a>
              <a href="#services" className="inline-block border border-white text-white px-5 py-3 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white" aria-label="Navigate to services section">View Services</a>
              <a
                href={REVIEW_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white/90 text-[#0a2a52] px-5 py-3 rounded-md font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                aria-label="Leave an honest review for Midway Mobile Storage (opens in new tab)"
              >
                Leave a Review
                <span aria-hidden="true" className="text-xs font-normal text-[#0a2a52]/70">(opens new tab)</span>
              </a>
            </div>
            <p className="text-sm text-gray-200 mt-2">Reviews help a local business. Prefer to chat? <a href={PRIVATE_FEEDBACK_LINK} className="underline font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white" aria-label="Open the contact form to send private feedback">Send private feedback</a>.</p>
          </div>
        </div>

        <div className="relative">
          <div className="bg-black/50 p-6 rounded-lg backdrop-blur-sm">
            <h2 className="text-xl font-semibold text-white">Why customers choose us</h2>
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
