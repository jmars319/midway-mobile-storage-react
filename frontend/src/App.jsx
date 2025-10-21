import React, { useState, useEffect } from 'react'
import { Menu, X, Phone, Mail, MapPin, Clock } from 'lucide-react'

const API_BASE = 'http://localhost:5001/api'

/* ---------- Public site components (simple placeholders) ---------- */
function NavBar({ onLoginClick, scrollTo }){
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleNavClick = (id) => {
    scrollTo(id)
    setMobileMenuOpen(false)
  }

  const links = [
    { id: 'services', label: 'Services' },
    { id: 'products', label: 'Products' },
    { id: 'quote', label: 'Get Quote' },
    { id: 'about', label: 'About' },
    { id: 'careers', label: 'Careers' },
    { id: 'contact', label: 'Contact' }
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 bg-[#0a2a52] text-white shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <h1 className="text-2xl font-bold text-[#e84424]">Midway Mobile Storage</h1>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {links.map(l => (
              <button
                key={l.id}
                onClick={() => handleNavClick(l.id)}
                className="text-white hover:text-[#e84424] transition focus:outline-none focus:ring-2 focus:ring-[#e84424]"
              >
                {l.label}
              </button>
            ))}

            <button
              onClick={onLoginClick}
              className="bg-[#e84424] hover:bg-[#d13918] text-white px-4 py-2 rounded font-semibold transition focus:outline-none focus:ring-2 focus:ring-[#d13918]"
            >
              Admin Login
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#e84424]"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu (slides down) */}
      <div
        className={`md:hidden transform transition-max-h duration-300 overflow-hidden ${mobileMenuOpen ? 'max-h-96' : 'max-h-0'}`}
        style={{ borderTop: '1px solid rgba(26,77,122,0.6)' }}
      >
        <div className="bg-[#0d3464] px-4 pt-4 pb-6">
          {links.map(l => (
            <button
              key={l.id}
              onClick={() => handleNavClick(l.id)}
              className="block w-full text-left text-white py-3 border-b border-[#1a4d7a] hover:text-[#e84424] transition focus:outline-none"
            >
              {l.label}
            </button>
          ))}

          <div className="mt-3">
            <button
              onClick={() => { onLoginClick(); setMobileMenuOpen(false) }}
              className="w-full bg-[#e84424] hover:bg-[#d13918] text-white py-3 rounded font-semibold transition focus:outline-none"
            >
              Admin Login
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

function HeroSection(){
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

function ServicesSection(){
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

function ProductsSection({ scrollTo }){
  return (
    <section id="products" className="py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="p-8 rounded-lg text-white bg-gradient-to-br from-[#e84424] to-[#d13918]">
          <h3 className="text-3xl font-bold">PanelSeal</h3>
          <p className="mt-3 opacity-90">Premium waterproofing and sealing for shipping containers and structures.</p>
          <button onClick={() => scrollTo('contact')} className="mt-6 bg-white text-[#e84424] px-4 py-2 rounded font-semibold">Order PanelSeal</button>
        </div>

        <div className="p-6">
          <h4 className="text-2xl font-semibold text-[#0a2a52]">Why PanelSeal</h4>
          <ul className="mt-4 space-y-3">
            <li className="flex items-start gap-3"><span className="text-[#e84424] font-bold">✓</span><span className="text-gray-700">Long-lasting waterproof protection</span></li>
            <li className="flex items-start gap-3"><span className="text-[#e84424] font-bold">✓</span><span className="text-gray-700">Easy professional application</span></li>
            <li className="flex items-start gap-3"><span className="text-[#e84424] font-bold">✓</span><span className="text-gray-700">Compatible with container panels</span></li>
          </ul>
        </div>
      </div>
    </section>
  )
}

/* Quote form with example state and submit handler */
function QuoteForm(){
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

function AboutSection(){
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

function CareersSection(){
  const [formData, setFormData] = useState({ name:'', email:'', phone:'', position:'', experience:'', message:'', resume: null })

  const handleChange = (e) => {
    const { name, value, files } = e.target
    if (name === 'resume') return setFormData(prev => ({ ...prev, resume: files?.[0] || null }))
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // for now just log — backend endpoint not implemented yet
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

function Footer(){
  const containerDimensions = [
    { size: "20ft Standard", dimensions: "20' L × 8' W × 8'6\" H", capacity: "1,172 cu ft" },
    { size: "40ft Standard", dimensions: "40' L × 8' W × 8'6\" H", capacity: "2,390 cu ft" },
    { size: "40ft High Cube", dimensions: "40' L × 8' W × 9'6\" H", capacity: "2,694 cu ft" }
  ]

  const quickLinks = [
    {label:'Services', href:'#services'},
    {label:'Products', href:'#products'},
    {label:'Get Quote', href:'#quote'},
    {label:'Careers', href:'#careers'}
  ]

  return (
    <footer id="contact" className="py-10 bg-[#0a2a52] text-white mt-12 border-t border-[#1a4d7a]">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <div className="text-2xl font-bold text-[#e84424]">Midway Mobile Storage</div>
          <p className="mt-2 text-gray-200">Secure storage solutions across the region.</p>
        </div>

        <div>
          <h4 className="font-semibold">Contact</h4>
          <ul className="mt-3 space-y-2 text-gray-200">
            <li className="flex items-center gap-2"><Phone size={16}/> (555) 555-5555</li>
            <li className="flex items-center gap-2"><Mail size={16}/> info@midwaystorage.example</li>
            <li className="flex items-center gap-2"><MapPin size={16}/> 123 Storage Ave, Somewhere</li>
            <li className="flex items-center gap-2"><Clock size={16}/> Mon–Fri 8:00–17:00</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold">Quick Links</h4>
          <ul className="mt-3 space-y-2">
            {quickLinks.map(l => (
              <li key={l.href}><a className="text-gray-200 hover:text-[#e84424]" href={l.href}>{l.label}</a></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold">Container Dimensions</h4>
          <table className="mt-3 text-gray-200 w-full">
            <tbody>
              {containerDimensions.map(c => (
                <tr key={c.size} className="border-b border-[#1a4d7a]">
                  <td className="py-2 font-semibold">{c.size}</td>
                  <td className="py-2 text-sm">{c.dimensions} — {c.capacity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </footer>
  )
}

/* ---------- Authentication & Admin placeholders ---------- */
function LoginPage({ onLogin, onBack }){
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const submit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/auth/login`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ username, password }) })
      const payload = await res.json()
      if (res.ok && payload.token) {
        onLogin({ username, token: payload.token })
      } else {
        setError(payload.error || 'Invalid credentials')
      }
    } catch (err) {
      console.error(err)
      setError('Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a2a52] via-[#0d3464] to-[#0a2a52]">
      <div className="max-w-md w-full p-6 bg-white rounded shadow">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-[#0a2a52]">Midway Admin</h2>
          <div className="text-sm text-gray-500">Sign in to manage orders, quotes, inventory and applications</div>
        </div>

        {error && <div className="mb-3 text-red-600">{error}</div>}

        <form onSubmit={submit} className="grid gap-3">
          <label className="text-sm text-[#0a2a52]">Username</label>
          <input value={username} onChange={(e)=>setUsername(e.target.value)} placeholder="Username" className="p-2 border rounded" />

          <label className="text-sm text-[#0a2a52]">Password</label>
          <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" className="p-2 border rounded" />

          <div className="flex items-center justify-between mt-2">
            <button type="submit" disabled={loading} className="bg-[#e84424] text-white px-4 py-2 rounded font-semibold disabled:opacity-60">{loading? 'Signing in...' : 'Sign In'}</button>
            <button type="button" onClick={onBack} className="text-sm">Back</button>
          </div>
        </form>

        <div className="mt-4 text-sm text-gray-600">
          Demo credentials: <div className="mt-1 font-mono text-sm">admin / admin123</div>
        </div>
      </div>
    </div>
  )
}

function AdminPanel({ user, onLogout }){
  const modules = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'quotes', name: 'Quote Requests', icon: '💬' },
    { id: 'inventory', name: 'Inventory', icon: '📦' },
    { id: 'applications', name: 'Job Applications', icon: '👥' },
    { id: 'orders', name: 'PanelSeal Orders', icon: '🛒' },
    { id: 'settings', name: 'Settings', icon: '⚙️' }
  ]

  const [activeModule, setActiveModule] = useState('dashboard')

  // token stored in localStorage by App on login; read here
  const token = typeof window !== 'undefined' ? localStorage.getItem('midway_token') : null

  function Sidebar(){
    return (
      <div className="w-64 bg-[#0a2a52] text-white h-screen flex flex-col">
        <div className="p-6 text-[#e84424] font-bold text-xl">Midway Admin</div>
        <nav className="flex-1 px-2">
          {modules.map(m => (
            <button key={m.id} onClick={()=>setActiveModule(m.id)} className={`w-full text-left px-4 py-3 rounded mb-1 ${activeModule===m.id? 'bg-[#e84424] text-white': 'hover:bg-[#0d3464]'}`}>
              <span className="mr-2">{m.icon}</span>{m.name}
            </button>
          ))}
        </nav>

        <div className="p-4">
          <button onClick={() => { localStorage.removeItem('midway_token'); onLogout(); }} className="w-full bg-red-600 text-white px-3 py-2 rounded">Logout</button>
        </div>
      </div>
    )
  }

  /* ---------- Modules ---------- */
  function DashboardModule(){
    const stats = [
      { label: 'Pending Quotes', value: '12', color: 'bg-blue-500' },
      { label: 'Active Rentals', value: '38', color: 'bg-green-500' },
      { label: 'Available Units', value: '15', color: 'bg-[#e84424]' },
      { label: 'New Applications', value: '5', color: 'bg-purple-500' }
    ]
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold text-[#0a2a52] mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {stats.map(s=> (
            <div key={s.label} className="bg-white p-4 rounded shadow flex items-center gap-4">
              <div className={`${s.color} w-12 h-12 rounded-full flex items-center justify-center text-white`}>★</div>
              <div>
                <div className="text-sm text-gray-500">{s.label}</div>
                <div className="text-xl font-bold">{s.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  function QuotesModule(){
    const [quotes, setQuotes] = useState([])

    useEffect(()=>{
      async function load(){
        try{
          const res = await fetch(`${API_BASE}/quotes`, { headers: { Authorization: `Bearer ${token}` }})
          if (res.ok) setQuotes(await res.json().then(j=>j.quotes||[]))
        }catch(e){ console.error(e) }
      }
      load()
    },[])

    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold text-[#0a2a52] mb-4">Quote Requests</h1>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#0a2a52] text-white">
              <tr>
                <th className="px-6 py-3 text-left">Customer</th>
                <th className="px-6 py-3 text-left">Service</th>
                <th className="px-6 py-3 text-left">Size</th>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map(q => (
                <tr key={q.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{q.name}</td>
                  <td className="px-6 py-4">{q.serviceType || '—'}</td>
                  <td className="px-6 py-4">{q.containerSize || '—'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{new Date(q.createdAt).toLocaleString()}</td>
                  <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-sm ${q.status==='responded' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{q.status||'pending'}</span></td>
                  <td className="px-6 py-4">
                    <button className="text-[#e84424] hover:text-[#d13918] font-semibold mr-3">View</button>
                    <button className="text-blue-600 hover:text-blue-700 font-semibold">Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  function InventoryModule(){
    const inventory = [
      { id: 1, type: '20ft Container', condition: 'New', status: 'Available', quantity: 8 },
      { id: 2, type: '40ft Container', condition: 'Used - Good', status: 'Available', quantity: 12 },
      { id: 3, type: '40ft High Cube', condition: 'New', status: 'Available', quantity: 5 },
      { id: 4, type: 'Full-Size Trailer', condition: 'Excellent', status: 'Rented', quantity: 3 }
    ]

    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold text-[#0a2a52] mb-4">Inventory</h1>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#0a2a52] text-white"><tr><th className="px-6 py-3 text-left">Type</th><th className="px-6 py-3 text-left">Condition</th><th className="px-6 py-3 text-left">Status</th><th className="px-6 py-3 text-left">Qty</th><th className="px-6 py-3 text-left">Actions</th></tr></thead>
            <tbody>
              {inventory.map(i=> (
                <tr key={i.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{i.type}</td>
                  <td className="px-6 py-4">{i.condition}</td>
                  <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-sm ${i.status==='Available' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{i.status}</span></td>
                  <td className="px-6 py-4">{i.quantity}</td>
                  <td className="px-6 py-4"><button className="text-[#e84424] mr-3">Edit</button><button className="text-blue-600">Details</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  function ApplicationsModule(){
    const applications = [
      { id: 1, name: 'Mike Johnson', position: 'Delivery Driver', date: '2025-10-19', status: 'new' },
      { id: 2, name: 'Sarah Williams', position: 'Sales Rep', date: '2025-10-18', status: 'reviewing' }
    ]

    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold text-[#0a2a52] mb-4">Job Applications</h1>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#0a2a52] text-white"><tr><th className="px-6 py-3 text-left">Name</th><th className="px-6 py-3 text-left">Position</th><th className="px-6 py-3 text-left">Date</th><th className="px-6 py-3 text-left">Status</th><th className="px-6 py-3 text-left">Actions</th></tr></thead>
            <tbody>
              {applications.map(a=> (
                <tr key={a.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{a.name}</td>
                  <td className="px-6 py-4">{a.position}</td>
                  <td className="px-6 py-4">{a.date}</td>
                  <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-sm ${a.status==='new' ? 'bg-blue-100 text-blue-800' : a.status==='reviewing' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{a.status}</span></td>
                  <td className="px-6 py-4"><button className="text-[#e84424] mr-3">View</button><button className="text-blue-600">Resume</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  function OrdersModule(){
    const orders = [
      { id: 1, customer: 'HomeDepot Supply', product: 'PanelSeal (5 gal)', quantity: 10, date: '2025-10-19', status: 'shipped' },
      { id: 2, customer: "Bob's Roofing", product: 'PanelSeal (1 gal)', quantity: 25, date: '2025-10-18', status: 'processing' }
    ]

    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold text-[#0a2a52] mb-4">PanelSeal Orders</h1>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#0a2a52] text-white"><tr><th className="px-6 py-3 text-left">Customer</th><th className="px-6 py-3 text-left">Product</th><th className="px-6 py-3 text-left">Qty</th><th className="px-6 py-3 text-left">Date</th><th className="px-6 py-3 text-left">Status</th><th className="px-6 py-3 text-left">Actions</th></tr></thead>
            <tbody>
              {orders.map(o=> (
                <tr key={o.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">{o.customer}</td>
                  <td className="px-6 py-4">{o.product}</td>
                  <td className="px-6 py-4">{o.quantity}</td>
                  <td className="px-6 py-4">{o.date}</td>
                  <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-sm ${o.status==='shipped' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{o.status}</span></td>
                  <td className="px-6 py-4"><button className="text-[#e84424] mr-3">View</button><button className="text-blue-600">Track</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  function SettingsModule(){
    const [info, setInfo] = useState({ phone:'', email:'', address:'' })
    const save = ()=> alert('Settings saved (demo)')
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold text-[#0a2a52] mb-6">Settings</h1>
        <div className="grid gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-[#0a2a52] mb-4">Business Information</h2>
            <div className="grid gap-3">
              <input placeholder="Phone" value={info.phone} onChange={e=>setInfo({...info, phone:e.target.value})} className="p-2 border rounded" />
              <input placeholder="Email" value={info.email} onChange={e=>setInfo({...info, email:e.target.value})} className="p-2 border rounded" />
              <input placeholder="Address" value={info.address} onChange={e=>setInfo({...info, address:e.target.value})} className="p-2 border rounded" />
              <div className="text-right"><button onClick={save} className="bg-[#e84424] text-white px-4 py-2 rounded">Save Changes</button></div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-[#0a2a52] mb-4">Admin Users</h2>
            <button className="bg-blue-600 text-white px-3 py-2 rounded">Add New Admin</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        {activeModule === 'dashboard' && <DashboardModule />}
        {activeModule === 'quotes' && <QuotesModule />}
        {activeModule === 'inventory' && <InventoryModule />}
        {activeModule === 'applications' && <ApplicationsModule />}
        {activeModule === 'orders' && <OrdersModule />}
        {activeModule === 'settings' && <SettingsModule />}
      </div>
    </div>
  )
}

/* ---------- Main App ---------- */
export default function App(){
  const [currentPage, setCurrentPage] = useState('public')
  const [user, setUser] = useState(null)

  useEffect(()=>{
    // set document padding to avoid header overlap
    document.documentElement.style.scrollPaddingTop = '100px'
  },[])

  const handleLogin = (userData) => { 
    setUser(userData); 
    if (userData?.token) localStorage.setItem('midway_token', userData.token)
    setCurrentPage('admin') 
  }
  const handleLogout = () => { localStorage.removeItem('midway_token'); setUser(null); setCurrentPage('public') }

  const scrollToSection = (id) => {
    const el = document.getElementById(id)
    if (el) {
      const headerHeight = 80
      const targetPosition = el.offsetTop - headerHeight - 20
      window.scrollTo({ top: targetPosition, behavior: 'smooth' })
    }
  }

  // restore token on mount
  useEffect(()=>{
    const t = localStorage.getItem('midway_token')
    if (t && !user) {
      setUser({ username: 'admin', token: t })
      setCurrentPage('admin')
    }
  },[])

  if (currentPage === 'login') return <LoginPage onLogin={handleLogin} onBack={()=>setCurrentPage('public')} />
  if (currentPage === 'admin' && user) return <AdminPanel user={user} onLogout={handleLogout} />

  return (
    <div className="min-h-screen">
      <NavBar onLoginClick={()=>setCurrentPage('login')} scrollTo={scrollToSection} />
      <main className="pt-24">
        <HeroSection />
        <ServicesSection />
        <ProductsSection />
        <QuoteForm />
        <AboutSection />
        <CareersSection />
        <Footer />
      </main>
    </div>
  )
}
