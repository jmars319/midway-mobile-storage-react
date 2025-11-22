import React, { useState } from 'react'
import { showToast } from './Toast'
import { API_BASE } from '../config'
import { useCsrfToken } from '../hooks/useCsrfToken'

export default function CareersSection(){
  const [formData, setFormData] = useState({ name:'', email:'', phone:'', position:'', experience:'', message:'', resume: null })
  const [submitted, setSubmitted] = useState(false)
  const { token: csrfToken } = useCsrfToken()

  const handleChange = (e) => {
    const { name, value, files } = e.target
    if (name === 'resume') return setFormData(prev => ({ ...prev, resume: files?.[0] || null }))
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!csrfToken) {
      showToast('Security token not available. Please refresh the page.', { type: 'error' })
      return
    }
    
    // send to backend (simple JSON; resume upload is represented by filename)
    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      position: formData.position,
      experience: formData.experience,
      message: formData.message,
      resumeName: formData.resume ? formData.resume.name : null,
      csrf_token: csrfToken
    }

    fetch(`${API_BASE}/applications`, {
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      credentials: 'include',
      body: JSON.stringify(payload)
    }).then(r => {
      if (r.ok) {
        showToast('Application submitted successfully!', { type: 'success' })
        setSubmitted(true)
        setFormData({ name:'', email:'', phone:'', position:'', experience:'', message:'', resume: null })
        // Reset file input
        const fileInput = document.querySelector('input[type="file"]')
        if (fileInput) fileInput.value = ''
        setTimeout(()=>setSubmitted(false), 5000)
      } else {
        showToast('Failed to submit application', { type: 'error' })
      }
    }).catch(err => {
      showToast('Failed to submit application', { type: 'error' })
    })
  }

  const openings = [
    { title: 'Delivery Driver / Equipment Operator', desc: 'Operate delivery vehicles, load/unload equipment, and ensure safe transport to customers.' },
    { title: 'Independent Contractor Driver', desc: 'Work as a contracted driver to fulfill delivery routes using your own vehicle and equipment as needed.' },
    { title: 'Fabrication Specialist', desc: 'Cut, assemble, and finish metal or composite parts used in our products and custom builds.' },
    { title: 'Sales Representative', desc: 'Manage customer relationships, provide quotes, and drive local business development.' },
    { title: 'Customer Service Coordinator', desc: 'Handle inbound customer inquiries, scheduling, and coordination between teams.' }
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
            <li className="flex items-start gap-3"><span className="text-[#e84424]">•</span><span>On-the-job training & mentorship</span></li>
            <li className="flex items-start gap-3"><span className="text-[#e84424]">•</span><span>Career development</span></li>
          </ul>

          <h4 className="mt-6">Positions</h4>
          <ul className="mt-2 list-inside text-gray-700 space-y-2">
            {openings.map(o => {
              const id = `pos-${o.title.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`
              return (
                <li key={o.title} className="relative">
                  <div className="group inline-block">
                    <button aria-describedby={id} className="list-disc list-inside ml-2 text-left focus:outline-none focus:ring-2 focus:ring-[#e84424] px-1" type="button">
                      {o.title}
                    </button>
                    <div id={id} role="tooltip" className="absolute left-0 top-full mt-2 hidden group-hover:block group-focus-within:block w-72 bg-gray-800 text-white text-xs p-2 rounded shadow-lg z-10">
                      {o.desc}
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-[#0a2a52]">Apply Now</h4>
          <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-1 gap-3" aria-label="Job application form">
            {submitted && <div className="mt-2 p-3 bg-green-100 text-green-800 rounded" role="alert">Thanks — your application was submitted.</div>}
            <label htmlFor="app-name" className="block">
              <span className="text-sm text-gray-700 font-medium">Full Name *</span>
              <input id="app-name" name="name" value={formData.name} onChange={handleChange} placeholder="Full name" className="mt-1 p-2 border rounded w-full focus:ring-2 focus:ring-[#e84424]" required />
            </label>
            <label htmlFor="app-email" className="block">
              <span className="text-sm text-gray-700 font-medium">Email *</span>
              <input id="app-email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" type="email" className="mt-1 p-2 border rounded w-full focus:ring-2 focus:ring-[#e84424]" required />
            </label>
            <label htmlFor="app-phone" className="block">
              <span className="text-sm text-gray-700 font-medium">Phone</span>
              <input id="app-phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" type="tel" className="mt-1 p-2 border rounded w-full focus:ring-2 focus:ring-[#e84424]" />
            </label>
            <label htmlFor="app-position" className="block">
              <span className="text-sm text-gray-700 font-medium">Position</span>
              <select id="app-position" name="position" value={formData.position} onChange={handleChange} className="mt-1 p-2 border rounded w-full focus:ring-2 focus:ring-[#e84424]">
                <option value="">Select position</option>
              <option value="driver">Delivery Driver / Equipment Operator</option>
              <option value="contractor-driver">Independent Contractor Driver</option>
              <option value="fabrication">Fabrication Specialist</option>
              <option value="sales">Sales Representative</option>
              <option value="customer-service">Customer Service Coordinator</option>
              <option value="other">Other</option>
              </select>
            </label>
            <label htmlFor="app-experience" className="block">
              <span className="text-sm text-gray-700 font-medium">Experience Summary</span>
              <textarea id="app-experience" name="experience" value={formData.experience} onChange={handleChange} placeholder="Briefly describe your relevant experience" className="mt-1 p-2 border rounded w-full h-24 focus:ring-2 focus:ring-[#e84424]" />
            </label>
            <label htmlFor="app-message" className="block">
              <span className="text-sm text-gray-700 font-medium">Additional Message</span>
              <textarea id="app-message" name="message" value={formData.message} onChange={handleChange} placeholder="Any additional information you'd like to share" className="mt-1 p-2 border rounded w-full h-24 focus:ring-2 focus:ring-[#e84424]" />
            </label>
            <button type="submit" className="bg-[#e84424] text-white px-4 py-2 rounded mt-2 hover:bg-[#c93a1f] transition">Submit Application</button>
          </form>
        </div>
      </div>
    </section>
  )
}
