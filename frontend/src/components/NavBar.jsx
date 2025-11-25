import React, { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { getActiveLogoUrl } from '../lib/media'

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
    { id: 'quote', label: 'Get Quote' },
    { id: 'products', label: 'Products' },
    { id: 'about', label: 'About' },
    { id: 'careers', label: 'Careers' },
    // Contact link moved to footer
  ]

  const [logoUrl, setLogoUrl] = useState(null)

  useEffect(()=>{
    let mounted = true
    getActiveLogoUrl().then(u => { if (mounted) setLogoUrl(u) }).catch(()=>{})
    return ()=>{ mounted = false }
  },[])

  return (
    <>
      {/* Skip to main content link for accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#e84424] focus:text-white focus:rounded focus:outline-none"
      >
        Skip to main content
      </a>
      <nav className="fixed top-0 left-0 right-0 bg-[#0a2a52] text-white shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-3">
            {logoUrl ? (
              <>
                <img src={logoUrl} alt="Midway Mobile Storage company logo" className="h-12 object-contain" />
                <span className="text-2xl font-bold text-[#e84424] hidden sm:inline">Midway Mobile Storage</span>
              </>
            ) : (
              <h1 className="text-2xl font-bold text-[#e84424]">Midway Mobile Storage</h1>
            )}
          </div>

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

            {/* Admin Login moved to footer */}
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

          {/* Admin Login moved to footer; keep mobile menu simple */}
        </div>
      </div>
    </nav>
    </>
  )
}
