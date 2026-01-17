import { describe, it, expect, beforeEach } from 'vitest'
import { generateStructuredData, injectStructuredData } from '../lib/structuredData'

describe('structured data', () => {
  beforeEach(() => {
    document.head.innerHTML = ''
  })

  it('generates expected graph nodes and injects JSON-LD', () => {
    const data = generateStructuredData({
      businessName: 'Midway Mobile Storage',
      email: 'midwaymobilestorage@gmail.com',
      phone: '(336) 764-4208',
      address: '212 Fred Sink Road',
      city: 'Winston-Salem',
      state: 'NC',
      zip: '27107',
      country: 'US',
      hours: 'Mon–Fri 10:00–15:00',
      siteUrl: 'https://midwaymobilestorage.com'
    })

    injectStructuredData(data)

    const script = document.getElementById('structured-data')
    expect(script).toBeTruthy()
    const parsed = JSON.parse(script.textContent)
    const types = parsed['@graph'].map(node => node['@type'])
    expect(types).toContain('Organization')
    expect(types).toContain('LocalBusiness')
    expect(types).toContain('WebSite')
    expect(types).toContain('WebPage')
    expect(types).toContain('FAQPage')
  })
})
