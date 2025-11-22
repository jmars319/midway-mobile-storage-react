import React, { useState } from 'react'
import { API_BASE } from '../config'
import { showToast } from './Toast'

export default function QuoteForm(){
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceType: 'rental',
    containerSize: '20ft',
    quantity: '1',
    duration: 'short-term',
    deliveryAddress: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    // If switching to Purchase service, clear duration since it's not applicable
    if (name === 'serviceType' && value === 'purchase') {
      setFormData(prev => ({ ...prev, [name]: value, duration: '' }))
      return
    }
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`${API_BASE}/quotes`, {
        method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(formData)
      })
      if (res.ok){
        showToast('Quote request submitted successfully!', { type: 'success' })
        setSubmitted(true)
        setFormData({ name:'', email:'', phone:'', serviceType:'rental', containerSize:'20ft', quantity:'1', duration:'short-term', deliveryAddress:'', message:'' })
        setTimeout(()=>setSubmitted(false), 5000)
      } else {
        const errorData = await res.json().catch(() => null)
        showToast(errorData?.error || 'Failed to submit quote request', { type: 'error' })
      }
    } catch(err){ 
      showToast('Failed to submit quote request', { type: 'error' })
    }
  }

  return (
    <section id="quote" className="py-12 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="bg-gray-50 border-t-4 border-[#e84424] p-6 rounded-lg">
          <h4 className="text-xl font-semibold text-[#0a2a52]">Request a Quote</h4>
          {submitted && <div className="mt-4 p-3 bg-green-100 text-green-800 rounded" role="alert">Thanks — your request was submitted.</div>}

          <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left column - contact info */}
            <div className="space-y-4">
              <label className="block">
                <span className="text-sm text-[#0a2a52]">Name</span>
                <input name="name" value={formData.name} onChange={handleChange} className="mt-1 p-3 border rounded w-full text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#e84424]" required placeholder="Full name" />
              </label>

              <label className="block">
                <span className="text-sm text-[#0a2a52]">Email</span>
                <input name="email" type="email" value={formData.email} onChange={handleChange} className="mt-1 p-3 border rounded w-full text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#e84424]" required placeholder="you@example.com" />
              </label>

              <label className="block">
                <span className="text-sm text-[#0a2a52]">Phone</span>
                <input name="phone" type="tel" value={formData.phone} onChange={handleChange} className="mt-1 p-3 border rounded w-full text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#e84424]" placeholder="Optional" />
              </label>

              <label className="block">
                <span className="text-sm text-[#0a2a52]">Delivery Address</span>
                <input name="deliveryAddress" value={formData.deliveryAddress} onChange={handleChange} className="mt-1 p-3 border rounded w-full text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#e84424]" placeholder="Street, city, state" />
              </label>
            </div>

            {/* Right column - service details */}
            <div className="space-y-4">
              <label className="block">
                <span className="text-sm text-[#0a2a52]">Service</span>
                <select name="serviceType" value={formData.serviceType} onChange={handleChange} className="mt-1 p-3 border rounded w-full text-gray-900 focus:ring-2 focus:ring-[#e84424]">
                  <option value="rental">Rental</option>
                  <option value="purchase">Purchase</option>
                  <option value="custom">Custom</option>
                </select>
              </label>

              <label className="block">
                <span className="text-sm text-[#0a2a52]">Unit Size</span>
                <select name="containerSize" value={formData.containerSize} onChange={handleChange} className="mt-1 p-3 border rounded w-full text-gray-900 focus:ring-2 focus:ring-[#e84424]">
                  <option value="20ft">20ft Container</option>
                  <option value="40ft">40ft Container</option>
                  <option value="trailer">Trailer</option>
                  <option value="custom">Custom</option>
                </select>
              </label>

              <div className="grid grid-cols-2 gap-4">
                <label>
                  <span className="text-sm text-[#0a2a52]">Quantity</span>
                  <select name="quantity" value={formData.quantity} onChange={handleChange} className="mt-1 p-3 border rounded w-full text-gray-900 focus:ring-2 focus:ring-[#e84424]">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4+">4+</option>
                  </select>
                </label>

                <label>
                  <span className="text-sm text-[#0a2a52]">Duration</span>
                  <select
                    id="quote-duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    aria-describedby="duration-help"
                    aria-disabled={formData.serviceType === 'purchase'}
                    className={`mt-1 p-3 border rounded w-full text-gray-900 focus:ring-2 focus:ring-[#e84424] ${formData.serviceType === 'purchase' ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`}
                    disabled={formData.serviceType === 'purchase'}
                  >
                    <option value="short-term">Short-term (1–6 months)</option>
                    <option value="medium-term">Medium-term (6–12 months)</option>
                    <option value="long-term">Long-term (12+ months)</option>
                  </select>
                  <div id="duration-help" className="text-xs text-gray-500 mt-2">
                    {formData.serviceType === 'purchase'
                      ? 'Purchases are permanent; duration not applicable.'
                      : 'Choose a timeframe to help us suggest the best options and pricing.'}
                  </div>
                </label>
              </div>

              

              <label className="block">
                <span className="text-sm text-[#0a2a52]">Additional Notes</span>
                <textarea name="message" value={formData.message} onChange={handleChange} className="mt-1 p-3 border rounded w-full h-28 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#e84424]" placeholder="Tell us anything else we should know" />
              </label>

              <div className="flex items-center justify-end gap-4">
                <button type="submit" className="ml-auto bg-[#e84424] text-white px-5 py-2 rounded font-semibold hover:bg-[#c93a1f] transition">Submit Quote</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
