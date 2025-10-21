import React, { useState } from 'react'

export default function CareersSection(){
  const [formData, setFormData] = useState({ name:'', email:'', phone:'', position:'', experience:'', message:'', resume: null })

  const handleChange = (e) => {
    const { name, value, files } = e.target
    if (name === 'resume') return setFormData(prev => ({ ...prev, resume: files?.[0] || null }))
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Apply', formData)
    setFormData({ name:'', email:'', phone:'', position:'', experience:'', message:'', resume: null })
    alert('Application submitted (demo)')
  }

  const openings = [
    'Delivery Driver / Equipment Operator',
    'Fabrication Specialist',
    'Sales Representative',
    'Customer Service Coordinator'
  ]

  return (
    <section id="careers" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-2xl font-semibold text-[#0a2a52]">Careers</h3>
          <p className="mt-2 text-gray-700">Join our team — we value safety, craftsmanship, and service.</p>

          <h4 className="mt-6 font-semibold">Benefits</h4>
          <ul className="mt-3 space-y-2">
            <li className="flex items-start gap-3"><span className="text-[#e84424]">•</span><span>Competitive pay</span></li>
            <li className="flex items-start gap-3"><span className="text-[#e84424]">•</span><span>Health benefits</span></li>
            <li className="flex items-start gap-3"><span className="text-[#e84424]">•</span><span>Career development</span></li>
          </ul>

          <h4 className="mt-6">Openings</h4>
          <ul className="mt-2 list-disc list-inside text-gray-700">
            {openings.map(o => <li key={o}>{o}</li>)}
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-[#0a2a52]">Apply Now</h4>
          <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-1 gap-3">
            <input name="name" value={formData.name} onChange={handleChange} placeholder="Full name" className="p-2 border rounded focus:ring-2 focus:ring-[#e84424]" required />
            <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="p-2 border rounded focus:ring-2 focus:ring-[#e84424]" required />
            <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" className="p-2 border rounded focus:ring-2 focus:ring-[#e84424]" />
            <select name="position" value={formData.position} onChange={handleChange} className="p-2 border rounded focus:ring-2 focus:ring-[#e84424]">
              <option value="">Select position</option>
              <option value="driver">Delivery Driver / Equipment Operator</option>
              <option value="fabrication">Fabrication Specialist</option>
              <option value="sales">Sales Representative</option>
              <option value="customer-service">Customer Service Coordinator</option>
              <option value="other">Other</option>
            </select>
            <textarea name="experience" value={formData.experience} onChange={handleChange} placeholder="Experience summary" className="p-2 border rounded focus:ring-2 focus:ring-[#e84424]" />
            <input type="file" name="resume" onChange={handleChange} className="mt-1" />
            <button className="bg-[#e84424] text-white px-4 py-2 rounded mt-2">Submit Application</button>
          </form>
        </div>
      </div>
    </section>
  )
}
