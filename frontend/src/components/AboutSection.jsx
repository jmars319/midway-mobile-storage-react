import React, { useState, useEffect } from 'react'
import { API_BASE } from '../config'

export default function AboutSection(){
  const [aboutData, setAboutData] = useState({
    title: 'About Midway Mobile Storage',
    subtitle: 'Serving Winston-Salem and the Triad Area',
    sinceYear: '1989',
    text1: 'Since 1989, Midway Mobile Storage has been at the forefront of the portable storage industry in Winston-Salem, NC. With over three decades of experience, we\'ve built our reputation on delivering secure, affordable mobile storage solutions backed by unmatched expertise and customer service throughout North Carolina.',
    text2: 'As pioneers in our market, we understand what our customers need — whether it\'s short-term job site storage, long-term container rentals, or premium waterproofing products like PanelSeal. Our commitment to quality and innovation has made us a trusted partner for businesses and individuals throughout Winston-Salem, Greensboro, High Point, and surrounding areas.',
    commitments: ['Quality Products', 'Professional Service', 'Flexible Solutions', 'Competitive Pricing']
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAboutData()
  }, [])

  const fetchAboutData = async () => {
    try {
      const res = await fetch(`${API_BASE}/public/settings`)
      if (res.ok) {
        const data = await res.json()
        if (data.settings) {
          setAboutData({
            title: data.settings.aboutTitle || 'About Midway Mobile Storage',
            subtitle: data.settings.aboutSubtitle || 'Serving Winston-Salem and the Triad Area',
            sinceYear: data.settings.aboutSinceYear || '1989',
            text1: data.settings.aboutText1 || 'Since 1989, Midway Mobile Storage has been at the forefront of the portable storage industry in Winston-Salem, NC. With over three decades of experience, we\'ve built our reputation on delivering secure, affordable mobile storage solutions backed by unmatched expertise and customer service throughout North Carolina.',
            text2: data.settings.aboutText2 || 'As pioneers in our market, we understand what our customers need — whether it\'s short-term job site storage, long-term container rentals, or premium waterproofing products like PanelSeal. Our commitment to quality and innovation has made us a trusted partner for businesses and individuals throughout Winston-Salem, Greensboro, High Point, and surrounding areas.',
            commitments: data.settings.aboutCommitments 
              ? data.settings.aboutCommitments.split(',').map(c => c.trim())
              : ['Quality Products', 'Professional Service', 'Flexible Solutions', 'Competitive Pricing']
          })
        }
      }
    } catch (e) {
      if (import.meta.env.DEV) console.error('Failed to fetch about data', e)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section id="about" className="py-12 bg-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-gray-600">Loading...</div>
        </div>
      </section>
    )
  }

  return (
    <section id="about" className="py-12 bg-gray-100">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div>
          <h2 className="text-3xl font-bold text-[#0a2a52]">{aboutData.title}</h2>
          <h3 className="text-xl font-semibold text-[#e84424] mt-2">{aboutData.subtitle}</h3>
          <p className="mt-3 text-gray-700 leading-relaxed">
            Since <strong>{aboutData.sinceYear}</strong>, {aboutData.text1.replace(`Since ${aboutData.sinceYear}, `, '')}
          </p>
          <p className="mt-3 text-gray-700 leading-relaxed">
            {aboutData.text2}
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 border-t-4 border-[#e84424]">
          <h4 className="text-xl font-semibold text-[#0a2a52]">Our Commitments</h4>
          <ul className="mt-4 space-y-3">
            {aboutData.commitments.map(c => (
              <li key={c} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#e84424] text-white flex items-center justify-center">✓</div>
                <div className="text-[#0a2a52] font-semibold">{c}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
