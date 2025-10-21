import React from 'react'

export default function AboutSection(){
  const commitments = ["Quality Products","Professional Service","Flexible Solutions","Competitive Pricing"]
  return (
    <section id="about" className="py-12 bg-gray-100">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div>
          <h3 className="text-3xl font-bold text-[#0a2a52]">About Midway</h3>
          <p className="mt-3 text-gray-700">We provide secure and affordable storage solutions backed by experienced professionals and flexible services to meet your needs.</p>
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
