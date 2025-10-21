import React from 'react'

export default function HeroSection(){
  return (
    <section id="hero" className="bg-gradient-to-br from-[#0a2a52] via-[#0d3464] to-[#0a2a52] pt-32 pb-20 text-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center px-6">
        <div className="space-y-6">
          <h1 className="text-5xl font-extrabold">Storage Solutions <span className="text-[#e84424]">Delivered</span></h1>
          <p className="text-gray-200 max-w-xl">Reliable container rentals, sales, and custom solutions — fast delivery and professional installation. Get a quote or explore our services.</p>

          <div className="flex flex-wrap gap-3 mt-4">
            <a href="#quote" className="inline-block bg-[#e84424] text-white px-5 py-3 rounded-md font-semibold">Get Free Quote</a>
            <a href="#services" className="inline-block border border-white text-white px-5 py-3 rounded-md">View Services</a>
          </div>
        </div>

        <div className="relative">
          <div className="bg-white/5 p-6 rounded-lg">
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
