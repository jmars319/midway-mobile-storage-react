import React, { useState, useEffect } from 'react'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'
import ContactModal from './ContactModal'
import { fetchSiteSettings } from '../lib/structuredData'

export default function Footer({ onLoginClick, onNavigate }){
  const [contactOpen, setContactOpen] = useState(false)
  const [settings, setSettings] = useState(null)
  const [hoveredContainer, setHoveredContainer] = useState(null)
  
  useEffect(() => {
    fetchSiteSettings().then(setSettings)
  }, [])
  const containerDimensions = [
    { 
      size: "20ft Standard", 
      dimensions: "20' L × 8' W × 8'6\" H", 
      squareFootage: "160 sq ft",
      capacity: "1,172 cu ft",
      doorWidth: "7'8\"",
      doorHeight: "7'5\""
    },
    { 
      size: "40ft Standard", 
      dimensions: "40' L × 8' W × 8'6\" H", 
      squareFootage: "320 sq ft",
      capacity: "2,390 cu ft",
      doorWidth: "7'8\"",
      doorHeight: "7'5\""
    },
    { 
      size: "40ft High Cube", 
      dimensions: "40' L × 8' W × 9'6\" H", 
      squareFootage: "320 sq ft",
      capacity: "2,694 cu ft",
      doorWidth: "7'8\"",
      doorHeight: "8'5\""
    }
  ]

  const quickLinks = [
    {label:'Services', href:'#services'},
    {label:'Get Quote', href:'#quote'},
    {label:'Products', href:'#products'},
    {label:'Careers', href:'#careers'}
  ]

  const contactModalId = 'contact-modal'

  return (
    <footer id="contact" className="py-10 bg-[#0a2a52] text-white mt-12 border-t border-[#1a4d7a]">
  <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-5 gap-6 items-start">
        <div>
          <div className="text-xl font-bold text-[#e84424]">Midway Mobile Storage</div>
          <p className="mt-2 text-sm text-gray-200">Based in Winston-Salem, NC — serving customers across the eastern United States.</p>
          {onLoginClick && (
            <div className="mt-4">
              <button type="button" onClick={(e) => { e.preventDefault(); onLoginClick(); }} className="text-xs text-gray-200 hover:text-white underline focus:outline-none">Admin Login</button>
            </div>
          )}
        </div>

        <div>
          <h4 className="text-sm font-semibold">Contact</h4>
          <ul className="mt-2 space-y-1.5 text-xs text-gray-200">
            <li className="flex items-start gap-2"><Phone size={14} className="mt-0.5 flex-shrink-0" /> <a href={`tel:${(settings?.phone || '(336) 764-4208').replace(/[^\d+]/g, '')}`} className="break-words hover:text-[#e84424]">{settings?.phone || '(336) 764-4208'}</a></li>
            <li className="flex items-start gap-2"><Mail size={14} className="mt-0.5 flex-shrink-0" /> <a href={`mailto:${settings?.email || 'midwaymobilestorage@gmail.com'}`} className="break-all hover:text-[#e84424]">{settings?.email || 'midwaymobilestorage@gmail.com'}</a></li>
            <li className="flex items-start gap-2"><MapPin size={14} className="mt-0.5 flex-shrink-0" /> <span className="break-words">{settings?.address ? `${settings.address}, ${settings.city}` : '212 Fred Sink Road, Winston-Salem'}</span></li>
            <li className="flex items-start gap-2"><Clock size={14} className="mt-0.5 flex-shrink-0" /> <span className="break-words">{settings?.hours || 'Mon–Fri 10:00 AM - 03:00 PM'}</span></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Quick Links</h4>
          <ul className="mt-2 space-y-1.5 text-xs">
            {quickLinks.map(l => (
              <li key={l.href}><a className="text-gray-200 hover:text-[#e84424]" href={l.href}>{l.label}</a></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Legal</h4>
          <ul className="mt-2 space-y-1.5 text-xs">
            <li>
              <a
                className="text-gray-200 hover:text-[#e84424]"
                href="/privacy"
                onClick={(e)=>{ if(onNavigate){ e.preventDefault(); onNavigate('privacy') } }}
              >Privacy Policy</a>
            </li>
            <li>
              <a
                className="text-gray-200 hover:text-[#e84424]"
                href="/terms"
                onClick={(e)=>{ if(onNavigate){ e.preventDefault(); onNavigate('terms') } }}
              >Terms of Service</a>
            </li>
          </ul>
          {/* Contact link moved here from the navbar; visually separated */}
          <div className="mt-3 pt-3 border-t border-[#1a4d7a]">
            <button
              onClick={(e)=>{ e.preventDefault(); setContactOpen(true); }}
              className="text-xs text-gray-200 hover:text-[#e84424] block text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e84424] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a2a52] rounded"
              aria-haspopup="dialog"
              aria-controls={contactModalId}
              aria-expanded={contactOpen}
            >Contact Us</button>
          </div>
          {contactOpen && <ContactModal id={contactModalId} onClose={()=>setContactOpen(false)} />}
        </div>

        <div>
          <h4 className="text-sm font-semibold">Container Dimensions</h4>
          <div className="mt-2 space-y-1.5">
            {containerDimensions.map((c, idx) => {
              const tooltipId = `container-tooltip-${idx}`
              const isActive = hoveredContainer === c.size
              return (
                <div 
                  key={c.size} 
                  className="relative group cursor-help py-1.5 px-2 rounded hover:bg-[#1a4d7a] transition-colors"
                >
                  <button
                    type="button"
                    className="text-xs font-medium text-gray-100 w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e84424] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a2a52] rounded"
                    onMouseEnter={() => setHoveredContainer(c.size)}
                    onMouseLeave={() => setHoveredContainer(null)}
                    onFocus={() => setHoveredContainer(c.size)}
                    onBlur={() => setHoveredContainer(null)}
                    aria-describedby={tooltipId}
                  >
                    {c.size}
                  </button>
                  {isActive && (
                    <div id={tooltipId} role="tooltip" className="absolute left-0 bottom-full mb-2 bg-[#0a2a52] border border-[#1a4d7a] rounded p-2 shadow-lg z-10 w-56 text-xs text-gray-200">
                      <div className="font-semibold text-[#e84424] mb-1">Specifications</div>
                      <div className="space-y-0.5">
                        <div><span className="text-gray-400">Exterior:</span> {c.dimensions}</div>
                        <div><span className="text-gray-400">Floor Space:</span> {c.squareFootage}</div>
                        <div><span className="text-gray-400">Capacity:</span> {c.capacity}</div>
                        <div><span className="text-gray-400">Door:</span> {c.doorWidth} W × {c.doorHeight} H</div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
            <div className="text-[10px] text-gray-400 italic mt-2">Hover or focus for details</div>
          </div>
        </div>
      </div>
      
      {/* Copyright and Credits */}
      <div className="max-w-7xl mx-auto px-6 mt-8 pt-6 border-t border-[#1a4d7a] text-center">
        <p className="text-xs text-gray-400">
          © {new Date().getFullYear()} Midway Mobile Storage. All rights reserved.
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Powered by <a href="https://jamarq.digital" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#e84424] underline">JAMARQ</a>
        </p>
        <p className="text-xs text-gray-400 mt-2">
          Subsidiary of ZM Motors LLC
        </p>
      </div>
    </footer>
  )
}
