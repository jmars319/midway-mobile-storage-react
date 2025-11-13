import React, { useState, useEffect } from 'react'
import { fetchSiteSettings } from '../lib/structuredData'

export default function TermsOfService({ onBack }){
  const [settings, setSettings] = useState(null)
  
  useEffect(() => {
    fetchSiteSettings().then(setSettings)
  }, [])
  
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <button onClick={onBack} className="text-sm text-[#0a2a52] underline mb-4">← Back to site</button>
      <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
      <p className="text-gray-700 mb-4">Effective Date: November 8, 2025</p>

      <p className="text-gray-700 mb-4">These Terms of Service ("Terms") govern your use of Midway Mobile Storage's website and any services offered through the site. By accessing or using the site you agree to these Terms.</p>

      <h2 className="text-xl font-semibold mt-6">1. Using Our Services</h2>
      <p className="text-gray-700 mt-2">You agree to provide accurate information when placing orders, requesting quotes, or applying for positions. We may refuse or cancel orders or applications at our discretion.</p>

      <h2 className="text-xl font-semibold mt-6">2. Orders, Pricing & Payment</h2>
      <p className="text-gray-700 mt-2">Orders placed through the site will be processed in accordance with our confirmation and payment terms. Prices are subject to change; applicable prices will be confirmed during order processing.</p>

      <h2 className="text-xl font-semibold mt-6">3. Cancellation & Refunds</h2>
      <p className="text-gray-700 mt-2">Cancellation and refund policies vary by service or product. Contact us for details related to your order.</p>

      <h2 className="text-xl font-semibold mt-6">4. User Conduct & Obligations</h2>
      <p className="text-gray-700 mt-2">You must not misuse the site or engage in unlawful behavior. You are responsible for maintaining accurate contact details and for the security of your communications with us.</p>

      <h2 className="text-xl font-semibold mt-6">5. Limitation of Liability</h2>
      <p className="text-gray-700 mt-2">To the maximum extent permitted by law, Midway Mobile Storage is not liable for incidental or consequential damages arising from use of the site or services.</p>

      <h2 className="text-xl font-semibold mt-6">6. Changes to These Terms</h2>
      <p className="text-gray-700 mt-2">We may update these Terms occasionally; the Effective Date above indicates the last revision. Continued use of the site constitutes acceptance of changes.</p>

      <h2 className="text-xl font-semibold mt-6">Contact</h2>
      <p className="text-gray-700 mt-2">Questions about these terms? Email <a href={`mailto:${settings?.email || 'info@midwaystorage.example'}`} className="text-[#0a2a52] underline">{settings?.email || 'info@midwaystorage.example'}</a>.</p>
    </div>
  )
}
