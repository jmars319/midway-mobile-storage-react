import React, { useState } from 'react'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'
import ContactModal from './ContactModal'

export default function Footer({ onLoginClick, onNavigate }){
  const [contactOpen, setContactOpen] = useState(false)
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
  <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-5 gap-6">
        <div>
          <div className="text-2xl font-bold text-[#e84424]">Midway Mobile Storage</div>
          <p className="mt-2 text-gray-200">Secure storage solutions across the region.</p>
          {onLoginClick && (
            <div className="mt-4">
              <button onClick={onLoginClick} className="text-sm text-gray-200 hover:text-white underline focus:outline-none">Admin Login</button>
            </div>
          )}
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
          <h4 className="font-semibold">Legal</h4>
          <ul className="mt-3 space-y-2">
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
          <div className="mt-4 pt-4 border-t border-[#1a4d7a]">
            <button
              onClick={(e)=>{ e.preventDefault(); setContactOpen(true); }}
              className="text-gray-200 hover:text-[#e84424] block text-left"
            >Contact Us</button>
          </div>
          {contactOpen && <ContactModal onClose={()=>setContactOpen(false)} />}
        </div>

        <div>
          <h4 className="font-semibold">Container Dimensions</h4>
          <table className="mt-2 text-gray-200 w-full text-sm table-auto">
            <tbody>
              {containerDimensions.map(c => (
                <tr key={c.size} className="border-b border-[#1a4d7a]">
                  <td className="py-2 font-medium text-sm whitespace-nowrap">{c.size}</td>
                  <td className="py-2 text-xs max-w-[20rem] whitespace-nowrap truncate">{c.dimensions} — {c.capacity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </footer>
  )
}
