import React, { useState } from 'react'

const API_BASE = 'http://localhost:5001/api'

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
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`${API_BASE}/quotes`, {
        method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(formData)
      })
      if (res.ok){
        setSubmitted(true)
        setFormData({ name:'', email:'', phone:'', serviceType:'rental', containerSize:'20ft', quantity:'1', duration:'short-term', deliveryAddress:'', message:'' })
        setTimeout(()=>setSubmitted(false), 5000)
      }
    } catch(err){ console.error(err) }
  }

  return (
    <section id="quote" className="py-12 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="bg-gray-50 border-t-4 border-[#e84424] p-6 rounded-lg">
          <h4 className="text-xl font-semibold text-[#0a2a52]">Request a Quote</h4>
          {submitted && <div className="mt-4 p-3 bg-green-100 text-green-800 rounded">Thanks — your request was submitted.</div>}

          <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              <div className="text-sm text-[#0a2a52]">Name</div>
              <input name="name" value={formData.name} onChange={handleChange} className="mt-1 p-2 border rounded w-full focus:ring-2 focus:ring-[#e84424]" required />
            </label>

            <label className="block">
              <div className="text-sm text-[#0a2a52]">Email</div>
              <input name="email" type="email" value={formData.email} onChange={handleChange} className="mt-1 p-2 border rounded w-full focus:ring-2 focus:ring-[#e84424]" required />
            </label>

            <label className="block">
              <div className="text-sm text-[#0a2a52]">Phone</div>
              <input name="phone" value={formData.phone} onChange={handleChange} className="mt-1 p-2 border rounded w-full focus:ring-2 focus:ring-[#e84424]" />
            </label>

            <label className="block">
              <div className="text-sm text-[#0a2a52]">Service</div>
              <select name="serviceType" value={formData.serviceType} onChange={handleChange} className="mt-1 p-2 border rounded w-full focus:ring-2 focus:ring-[#e84424]">
                <option value="rental">Rental</option>
                <option value="purchase">Purchase</option>
                <option value="trailer">Trailer</option>
                <option value="custom">Custom</option>
              </select>
            </label>

            <label className="block">
              <div className="text-sm text-[#0a2a52]">Container Size</div>
              <select name="containerSize" value={formData.containerSize} onChange={handleChange} className="mt-1 p-2 border rounded w-full focus:ring-2 focus:ring-[#e84424]">
                <option value="20ft">20ft</option>
                <option value="40ft">40ft</option>
                <option value="trailer">Trailer</option>
                <option value="custom">Custom</option>
              </select>
            </label>

            <label className="block">
              <div className="text-sm text-[#0a2a52]">Quantity</div>
              <select name="quantity" value={formData.quantity} onChange={handleChange} className="mt-1 p-2 border rounded w-full focus:ring-2 focus:ring-[#e84424]">
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4+</option>
              </select>
            </label>

            <label className="block">
              <div className="text-sm text-[#0a2a52]">Duration</div>
              <select name="duration" value={formData.duration} onChange={handleChange} className="mt-1 p-2 border rounded w-full focus:ring-2 focus:ring-[#e84424]">
                <option value="short-term">Short-term</option>
                <option value="medium-term">Medium-term</option>
                <option value="long-term">Long-term</option>
                <option value="purchase">Purchase</option>
              </select>
            </label>

            <label className="block md:col-span-2">
              <div className="text-sm text-[#0a2a52]">Delivery Address</div>
              <input name="deliveryAddress" value={formData.deliveryAddress} onChange={handleChange} className="mt-1 p-2 border rounded w-full focus:ring-2 focus:ring-[#e84424]" />
            </label>

            <label className="block md:col-span-2">
              <div className="text-sm text-[#0a2a52]">Additional Notes</div>
              <textarea name="message" value={formData.message} onChange={handleChange} className="mt-1 p-2 border rounded w-full focus:ring-2 focus:ring-[#e84424]" />
            </label>

            <div className="md:col-span-2 text-right">
              <button type="submit" className="bg-[#e84424] text-white px-5 py-2 rounded font-semibold">Submit Quote</button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
