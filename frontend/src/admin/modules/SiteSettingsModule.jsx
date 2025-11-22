import React, { useState, useEffect } from 'react'
import { showToast } from '../../components/Toast'
import { API_BASE } from '../../config'

export default function SiteSettingsModule() {
  const [settings, setSettings] = useState({
    businessName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
    hours: '',
    siteUrl: ''
  })
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const token = typeof window !== 'undefined' ? localStorage.getItem('midway_token') : null

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    setFetchLoading(true)
    try {
      const res = await fetch(`${API_BASE}/settings`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        if (data.settings) {
          // Merge with defaults to ensure all fields exist
          setSettings({
            businessName: data.settings.businessName || '',
            email: data.settings.email || '',
            phone: data.settings.phone || '',
            address: data.settings.address || '',
            city: data.settings.city || '',
            state: data.settings.state || '',
            zip: data.settings.zip || '',
            country: data.settings.country || 'US',
            hours: data.settings.hours || '',
            siteUrl: data.settings.siteUrl || ''
          })
        }
      }
    } catch (e) {
      if (import.meta.env.DEV) console.error('Failed to fetch settings', e)
    } finally {
      setFetchLoading(false)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      })
      if (res.ok) {
        showToast('Settings saved successfully')
      } else {
        showToast('Failed to save settings', { type: 'error' })
      }
    } catch (e) {
      showToast('Error saving settings', { type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Site Information</h2>
      <p className="text-gray-600 mb-6">
        Configure business information used in structured data, contact forms, and site metadata.
      </p>

      {fetchLoading ? (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-gray-600">Loading settings...</div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Business Name</label>
          <input
            type="text"
            value={settings.businessName}
            onChange={(e) => handleChange('businessName', e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="tel"
              value={settings.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Street Address</label>
          <input
            type="text"
            value={settings.address}
            onChange={(e) => handleChange('address', e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">City</label>
            <input
              type="text"
              value={settings.city}
              onChange={(e) => handleChange('city', e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">State</label>
            <input
              type="text"
              value={settings.state}
              onChange={(e) => handleChange('state', e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">ZIP Code</label>
            <input
              type="text"
              value={settings.zip}
              onChange={(e) => handleChange('zip', e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Country Code</label>
            <input
              type="text"
              value={settings.country}
              onChange={(e) => handleChange('country', e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="US"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Business Hours</label>
            <input
              type="text"
              value={settings.hours}
              onChange={(e) => handleChange('hours', e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Mon–Fri 8:00–17:00"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Site URL</label>
          <input
            type="url"
            value={settings.siteUrl}
            onChange={(e) => handleChange('siteUrl', e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="https://midwaymobilestorage.com"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-[#e84424] text-white px-6 py-2 rounded-md hover:bg-[#c93a1f] disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 rounded-md">
        <p className="text-sm text-gray-700">
          <strong>Note:</strong> These settings are used in:
        </p>
        <ul className="list-disc ml-6 mt-2 text-sm text-gray-700">
          <li>Structured data (schema.org JSON-LD) for search engines</li>
          <li>Contact information in footer and contact forms</li>
          <li>Meta tags and Open Graph data</li>
        </ul>
      </div>
    </div>
  )
}
