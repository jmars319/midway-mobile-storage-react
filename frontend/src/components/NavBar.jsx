import React, { useState } from 'react'
import { Menu, X } from 'lucide-react'

// NavBar receives `onLoginClick` so the parent can decide whether to show the
// login view or navigate straight to the admin panel (based on token presence).
// `scrollTo` is a helper passed from App for internal navigation.
export default function NavBar({ onLoginClick, scrollTo }){
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
          <h1 className="text-2xl font-bold text-[#e84424]">Midway Mobile Storage</h1>

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
