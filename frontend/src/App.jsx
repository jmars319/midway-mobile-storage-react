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

  const submit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({username, password})})
      if (res.ok){
        const json = await res.json();
        onLogin({ username, token: json.token })
      } else {
        alert('Login failed')
      }
    } catch(err){ console.error(err) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full p-6 border">
        <h3 className="text-xl font-semibold">Admin Login</h3>
        <form onSubmit={submit} className="mt-4 grid gap-2">
          <input value={username} onChange={(e)=>setUsername(e.target.value)} placeholder="Username" className="p-2 border" />
          <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" className="p-2 border" />
          <div className="flex gap-2 mt-2">
            <button className="bg-[#e84424] px-3 py-1 rounded">Login</button>
            <button type="button" className="px-3 py-1" onClick={onBack}>Back</button>
          </div>
        </form>
      </div>
    </div>
  )
}

function AdminPanel({ user, onLogout }){
  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl">Admin Panel</h2>
          <div>
            <span className="mr-2">{user?.username}</span>
            <button onClick={onLogout} className="bg-[#e84424] px-2 py-1 rounded">Logout</button>
          </div>
        </div>
        <div className="mt-6">Dashboard & modules go here (placeholders)</div>
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

  const handleLogin = (userData) => { setUser(userData); setCurrentPage('admin') }
  const handleLogout = () => { setUser(null); setCurrentPage('public') }

  const scrollToSection = (id) => {
    const el = document.getElementById(id)
    if (el) {
      const headerHeight = 80
      const targetPosition = el.offsetTop - headerHeight - 20
      window.scrollTo({ top: targetPosition, behavior: 'smooth' })
    }
  }

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
