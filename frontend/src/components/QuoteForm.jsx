import React, { useState } from 'react'
import { API_BASE } from '../config'
import { showToast } from './Toast'
import { useCsrfToken } from '../hooks/useCsrfToken'
import { normalizeTextInput } from '../utils/htmlEntities'

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
  const [spamGuard, setSpamGuard] = useState('')
  const { token: csrfToken } = useCsrfToken()

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
    
    if (!csrfToken) {
      showToast('Security token not available. Please refresh the page.', { type: 'error' })
      return
    }
    
    try {
      const normalizedFormData = Object.entries(formData).reduce((acc, [key, value]) => {
        acc[key] = typeof value === 'string' ? normalizeTextInput(value) : value
        return acc
      }, {})
      const sourcePage = typeof window !== 'undefined' ? window.location.href : ''
      const res = await fetch(`${API_BASE}/quotes`, {
        method: 'POST', 
        headers: {'Content-Type': 'application/json'}, 
        credentials: 'include',
        body: JSON.stringify({ ...normalizedFormData, csrf_token: csrfToken, companyWebsite: spamGuard, sourcePage })
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
    <section id="quote" className="py-12 bg-white" aria-labelledby="quote-heading">
      <div className="max-w-6xl mx-auto px-6">
        <div className="bg-gray-50 border-t-4 border-[#e84424] p-6 rounded-lg">
          <div className="flex flex-col gap-2">
            <h4 id="quote-heading" className="text-2xl font-semibold text-[#0a2a52]">Request a Quote</h4>
            <p className="text-sm text-gray-600" id="quote-description">Answer a few quick questions and our team will confirm pricing within one business day.</p>
          </div>
          {submitted && <div className="mt-4 p-3 bg-green-100 text-green-800 rounded" role="status" aria-live="polite">Thanks — your request was submitted.</div>}

          <form onSubmit={handleSubmit} aria-labelledby="quote-heading" aria-describedby="quote-description" className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="sr-only" aria-hidden="true">
              <label>
                Website
                <input
                  type="text"
                  tabIndex="-1"
                  autoComplete="off"
                  name="companyWebsite"
                  value={spamGuard}
                  onChange={(e) => setSpamGuard(e.target.value)}
                  className="opacity-0 absolute -z-10"
                />
              </label>
            </div>
            {/* Left column - contact info */}
            <div className="space-y-4 bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <h5 className="text-lg font-semibold text-[#0a2a52]">How can we reach you?</h5>
              <label htmlFor="quote-name" className="block">
                <span className="text-sm text-[#0a2a52]">Name</span>
                <input id="quote-name" name="name" value={formData.name} onChange={handleChange} className="mt-1 p-3 border rounded w-full text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#e84424]" required placeholder="Full name" autoComplete="name" />
              </label>

              <label htmlFor="quote-email" className="block">
                <span className="text-sm text-[#0a2a52]">Email</span>
                <input id="quote-email" name="email" type="email" value={formData.email} onChange={handleChange} className="mt-1 p-3 border rounded w-full text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#e84424]" required placeholder="you@example.com" autoComplete="email" />
              </label>

              <label htmlFor="quote-phone" className="block">
                <span className="text-sm text-[#0a2a52]">Phone</span>
                <input id="quote-phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} className="mt-1 p-3 border rounded w-full text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#e84424]" placeholder="Optional" autoComplete="tel" aria-describedby="quote-phone-help" />
                <p id="quote-phone-help" className="text-xs text-gray-500 mt-1">Phone helps us coordinate delivery questions faster.</p>
              </label>

              <label htmlFor="quote-address" className="block">
                <span className="text-sm text-[#0a2a52]">Delivery Address</span>
                <input id="quote-address" name="deliveryAddress" value={formData.deliveryAddress} onChange={handleChange} className="mt-1 p-3 border rounded w-full text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#e84424]" placeholder="Street, city, state" autoComplete="street-address" />
              </label>
            </div>

            {/* Right column - service details */}
            <div className="space-y-4 bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <h5 className="text-lg font-semibold text-[#0a2a52]">What do you need?</h5>
              <label htmlFor="quote-service" className="block">
                <span className="text-sm text-[#0a2a52]">Service</span>
                <select id="quote-service" name="serviceType" value={formData.serviceType} onChange={handleChange} className="mt-1 p-3 border rounded w-full bg-white text-gray-900 focus:ring-2 focus:ring-[#e84424]">
                  <option value="rental">Rental</option>
                  <option value="purchase">Purchase</option>
                  <option value="custom">Custom</option>
                </select>
              </label>

              <label htmlFor="quote-size" className="block">
                <span className="text-sm text-[#0a2a52]">Unit Size</span>
                <select id="quote-size" name="containerSize" value={formData.containerSize} onChange={handleChange} className="mt-1 p-3 border rounded w-full bg-white text-gray-900 focus:ring-2 focus:ring-[#e84424]">
                  <option value="20ft">20ft Container</option>
                  <option value="40ft">40ft Container</option>
                  <option value="trailer">Trailer</option>
                  <option value="custom">Custom</option>
                </select>
              </label>

              <div className="grid grid-cols-2 gap-4">
                <label htmlFor="quote-quantity">
                  <span className="text-sm text-[#0a2a52]">Quantity</span>
                  <select id="quote-quantity" name="quantity" value={formData.quantity} onChange={handleChange} className="mt-1 p-3 border rounded w-full bg-white text-gray-900 focus:ring-2 focus:ring-[#e84424]">
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
                    className={`mt-1 p-3 border rounded w-full bg-white focus:ring-2 focus:ring-[#e84424] ${formData.serviceType === 'purchase' ? 'text-gray-500 cursor-not-allowed' : 'text-gray-900'}`}
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

              

              <label htmlFor="quote-notes" className="block">
                <span className="text-sm text-[#0a2a52]">Additional Notes</span>
                <textarea id="quote-notes" name="message" value={formData.message} onChange={handleChange} className="mt-1 p-3 border rounded w-full h-28 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#e84424]" placeholder="Tell us anything else we should know" />
              </label>

              <div className="flex flex-col md:flex-row items-start md:items-center justify-end gap-3 md:gap-4">
                <p className="text-xs text-gray-500">We respond within one business day.</p>
                <button type="submit" className="ml-auto bg-[#e84424] text-white px-5 py-2 rounded font-semibold hover:bg-[#c93a1f] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e84424]">Submit Quote Request</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
