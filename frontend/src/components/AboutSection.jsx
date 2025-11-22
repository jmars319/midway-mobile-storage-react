import React from 'react'

export default function AboutSection(){
  const commitments = ["Quality Products","Professional Service","Flexible Solutions","Competitive Pricing"]
  return (
    <section id="about" className="py-12 bg-gray-100">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div>
          <h3 className="text-3xl font-bold text-[#0a2a52]">About Midway Mobile Storage</h3>
          <p className="mt-3 text-gray-700 leading-relaxed">
            Since <strong>1989</strong>, Midway Mobile Storage has been at the forefront of the portable storage industry in our region. 
            With over three decades of experience, we've built our reputation on delivering secure, affordable storage solutions 
            backed by unmatched expertise and customer service.
          </p>
          <p className="mt-3 text-gray-700 leading-relaxed">
            As pioneers in our market, we understand what our customers need — whether it's short-term job site storage, 
            long-term container rentals, or premium waterproofing products like PanelSeal. Our commitment to quality and 
            innovation has made us a trusted partner for businesses and individuals throughout the area.
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 border-t-4 border-[#e84424]">
          <h4 className="text-xl font-semibold text-[#0a2a52]">Our Commitments</h4>
          <ul className="mt-4 space-y-3">
            {commitments.map(c => (
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
