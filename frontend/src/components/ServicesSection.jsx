import React from 'react'

const SERVICES_DATA = [
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
  return (
    <section id="services" className="py-20 bg-white text-black">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-[#0a2a52]">Our Services</h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {SERVICES_DATA.map(s => (
            <div key={s.title} className="bg-gray-50 p-6 rounded-lg border-t-4 border-[#e84424] hover:shadow-xl transition">
              <h3 className="text-xl font-semibold text-[#0a2a52]">{s.title}</h3>
              <p className="mt-2 text-gray-700">{s.description}</p>
              <ul className="mt-4 space-y-2">
                {s.features.map(f => (
                  <li key={f} className="flex items-start gap-3">
                    <span className="text-[#e84424] font-bold">•</span>
                    <span className="text-gray-700">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
