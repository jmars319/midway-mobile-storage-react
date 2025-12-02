import React, { useState, useEffect } from 'react'
import { fetchSiteSettings } from '../lib/structuredData'

export default function PrivacyPolicy({ onBack }){
  const [settings, setSettings] = useState(null)
  
  useEffect(() => {
    fetchSiteSettings().then(setSettings)
    
    // Add breadcrumb structured data
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.id = 'breadcrumb-privacy'
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://midwaymobilestorage.com/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Privacy Policy",
          "item": "https://midwaymobilestorage.com/privacy"
        }
      ]
    })
    document.head.appendChild(script)
    
    return () => {
      const existing = document.getElementById('breadcrumb-privacy')
      if (existing) existing.remove()
    }
  }, [])
  
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <nav aria-label="Breadcrumb" className="text-sm text-gray-600 mb-4">
        <button onClick={onBack} className="text-[#0a2a52] hover:underline">Home</button>
        <span className="mx-2">/</span>
        <span>Privacy Policy</span>
      </nav>
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="text-gray-700 mb-4">Effective Date: November 8, 2025</p>

      <p className="text-gray-700 mb-4">Midway Mobile Storage (“we”, “us”, “Midway”) respects your privacy and is committed to protecting your personal information. This Privacy Policy explains what information we collect, how we use it, and your rights.</p>

      <h2 className="text-xl font-semibold mt-6">Information We Collect</h2>
      <ul className="list-disc ml-6 mt-2 text-gray-700">
        <li>Contact information you provide (name, email, phone, address) via forms and orders.</li>
        <li>Application materials such as resumes or cover letters submitted for job postings.</li>
        <li>Transactional information related to orders or services.</li>
        <li>Technical data collected automatically (IP address, browser, device information, and analytics).</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6">How We Use Information</h2>
      <p className="text-gray-700 mt-2">We use collected information to:</p>
      <ul className="list-disc ml-6 mt-2 text-gray-700">
        <li>Respond to inquiries and provide requested services or quotes.</li>
        <li>Process orders and communicate order status.</li>
        <li>Evaluate job applications and contact applicants.</li>
        <li>Improve and analyze site usage (using aggregated analytics).</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6">Cookies & Tracking</h2>
      <p className="text-gray-700 mt-2">We may use cookies and similar technologies to improve the user experience and gather analytics. Cookies do not contain personal information unless you provide it in site forms.</p>

      <h2 className="text-xl font-semibold mt-6">Sharing & Third Parties</h2>
      <p className="text-gray-700 mt-2">We do not sell personal information. We may share data with service providers who help operate the site (hosting, analytics, email). We require those providers to protect the data and use it only for permitted purposes.</p>

      <h2 className="text-xl font-semibold mt-6">Data Retention & Security</h2>
      <p className="text-gray-700 mt-2">We retain personal data only as long as necessary to fulfill the purposes described. We implement reasonable technical and administrative safeguards to protect data, but no online transmission is fully secure.</p>

      <h2 className="text-xl font-semibold mt-6">Your Rights</h2>
      <p className="text-gray-700 mt-2">Depending on your jurisdiction, you may have rights to access, correct, or delete your personal information. Contact us to exercise these rights.</p>

      <h2 className="text-xl font-semibold mt-6">Contact</h2>
      <p className="text-gray-700 mt-2">Questions about this policy? Email <a href={`mailto:${settings?.email || 'info@midwaystorage.example'}`} className="text-[#0a2a52] underline">{settings?.email || 'info@midwaystorage.example'}</a>.</p>

      <p className="text-gray-500 mt-8 text-sm">This policy may be updated; the Effective Date above reflects the last revision.</p>
    </div>
  )
}
