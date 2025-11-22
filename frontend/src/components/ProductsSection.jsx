import React, { useState } from 'react'
import PanelSealOrderModal from './PanelSealOrderModal'

export default function ProductsSection({ scrollTo }){
  const [orderOpen, setOrderOpen] = useState(false)
  return (
    <section id="products" className="py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="p-8 rounded-lg text-white bg-gradient-to-br from-[#e84424] to-[#d13918]">
          <h3 className="text-3xl font-bold">PanelSeal</h3>
          <p className="mt-3 opacity-90">Premium waterproofing and sealing for shipping containers, trailers, and other structures.</p>
          <button onClick={() => setOrderOpen(true)} className="mt-6 bg-white text-[#e84424] px-4 py-2 rounded font-semibold">Order PanelSeal</button>
        </div>

        <div className="p-6">
          <h4 className="text-2xl font-semibold text-[#0a2a52]">Why PanelSeal</h4>
          <ul className="mt-4 space-y-3">
            <li className="flex items-start gap-3"><span className="text-[#e84424] font-bold">✓</span><span className="text-gray-700">Long-lasting waterproof protection</span></li>
            <li className="flex items-start gap-3"><span className="text-[#e84424] font-bold">✓</span><span className="text-gray-700"><strong>Easy DIY application</strong> — no professional needed!</span></li>
            <li className="flex items-start gap-3"><span className="text-[#e84424] font-bold">✓</span><span className="text-gray-700">Professional installation available if preferred</span></li>
            <li className="flex items-start gap-3"><span className="text-[#e84424] font-bold">✓</span><span className="text-gray-700">Compatible with container and trailer panels</span></li>
          </ul>
        </div>
      </div>
      <PanelSealOrderModal open={orderOpen} onClose={()=>setOrderOpen(false)} />
    </section>
  )
}
