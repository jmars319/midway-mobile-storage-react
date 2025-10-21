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
    <section id="hero" className="pt-24 min-h-[60vh] flex items-center justify-center text-center">
      <div>
        <h1 className="text-5xl font-bold">Secure, Affordable Storage</h1>
        <p className="mt-4 text-lg">Rent or buy shipping containers and trailers. Fast delivery.</p>
      </div>
    </section>
  )
}

function ServicesSection(){
  return (
    <section id="services" className="py-20 bg-white text-black">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold">Services</h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
          <div className="p-4 border">Container Rentals</div>
          <div className="p-4 border">Container Sales</div>
          <div className="p-4 border">Trailers</div>
          <div className="p-4 border">Custom Builds</div>
        </div>
      </div>
    </section>
  )
}

function ProductsSection(){
  return (
    <section id="products" className="py-16">
      <div className="max-w-6xl mx-auto text-center">
        <h3 className="text-2xl font-semibold">PanelSeal</h3>
        <p className="mt-2">Waterproofing solutions for containers.</p>
      </div>
    </section>
  )
}

/* Quote form with example state and submit handler */
function QuoteForm(){
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', serviceType: 'rental', containerSize: '20ft', quantity: '1', duration: 'short-term', deliveryAddress: '', message: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value})

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`${API_BASE}/quotes`, {
        method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(formData)
      })
      if (res.ok) setSubmitted(true)
    } catch(err){ console.error(err) }
  }

  return (
    <section id="quote" className="py-12 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <h4 className="text-xl font-semibold">Request a Quote</h4>
        {!submitted ? (
          <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-1 gap-2">
            <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} className="p-2 border" required />
            <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="p-2 border" required />
            <textarea name="message" placeholder="Notes" value={formData.message} onChange={handleChange} className="p-2 border" />
            <button type="submit" className="mt-2 bg-[#e84424] px-4 py-2 rounded">Submit</button>
          </form>
        ) : (
          <div className="mt-4 text-green-600">Thanks — your request was submitted.</div>
        )}
      </div>
    </section>
  )
}

function AboutSection(){
  return (
    <section id="about" className="py-12">
      <div className="max-w-4xl mx-auto text-center">
        <h4 className="text-2xl font-semibold">About Midway</h4>
        <p className="mt-2">We provide secure and affordable storage solutions.</p>
      </div>
    </section>
  )
}

function CareersSection(){
  return (
    <section id="careers" className="py-12 bg-gray-100">
      <div className="max-w-4xl mx-auto text-center">
        <h4 className="text-2xl font-semibold">Careers</h4>
        <p className="mt-2">Check back for openings.</p>
      </div>
    </section>
  )
}

function Footer(){
  return (
    <footer className="py-8 bg-[#0a2a52] text-white mt-8">
      <div className="max-w-6xl mx-auto text-center">
        <div>Contact <Phone size={16}/> (555) 555-5555</div>
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
