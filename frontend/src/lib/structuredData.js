import { API_BASE } from '../config'

export async function fetchSiteSettings() {
  try {
    const res = await fetch(`${API_BASE}/public/settings`)
    if (res.ok) {
      const data = await res.json()
      return data.settings
    }
  } catch (e) {
    if (import.meta.env.DEV) console.error('Failed to fetch site settings', e)
  }
  // Fallback defaults
  return {
    businessName: 'Midway Mobile Storage',
    email: 'info@midwaystorage.example',
    phone: '(555) 555-5555',
    address: '123 Storage Ave',
    city: 'Somewhere',
    state: 'State',
    zip: '00000',
    country: 'US',
    hours: 'Mon–Fri 8:00–17:00',
    siteUrl: 'https://midwaymobilestorage.com'
  }
}

export function generateStructuredData(settings) {
  const siteUrl = settings.siteUrl || 'https://midwaymobilestorage.com'
  
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#org`,
        "name": settings.businessName || "Midway Mobile Storage",
        "url": siteUrl,
        "logo": `${siteUrl}/og-image.png`,
        "contactPoint": [{
          "@type": "ContactPoint",
          "telephone": settings.phone || "",
          "contactType": "customer service",
          "email": settings.email || ""
        }]
      },
      {
        "@type": "LocalBusiness",
        "@id": `${siteUrl}/#business`,
        "name": settings.businessName || "Midway Mobile Storage",
        "image": `${siteUrl}/og-image.png`,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": settings.address || "",
          "addressLocality": settings.city || "",
          "addressRegion": settings.state || "",
          "postalCode": settings.zip || "",
          "addressCountry": settings.country || "US"
        },
        "telephone": settings.phone || "",
        "url": siteUrl,
        "openingHours": settings.hours ? [settings.hours] : [],
        "priceRange": "$$",
        "areaServed": [
          {
            "@type": "City",
            "name": "Winston-Salem",
            "containedInPlace": {
              "@type": "State",
              "name": "North Carolina"
            }
          },
          {
            "@type": "City",
            "name": "Greensboro"
          },
          {
            "@type": "City",
            "name": "High Point"
          },
          {
            "@type": "City",
            "name": "Lexington"
          }
        ],
        "description": "Portable storage containers, rentals, and delivery services in Winston-Salem, NC and surrounding areas."
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        "url": siteUrl,
        "name": settings.businessName || "Midway Mobile Storage",
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${siteUrl}/?s={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What sizes of storage containers do you offer?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "We offer 20ft and 40ft storage containers for rent and sale, including standard and high-cube options. All containers are weather-resistant and secure."
            }
          },
          {
            "@type": "Question",
            "name": "Do you deliver containers in Winston-Salem?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, we provide delivery and pickup services throughout Winston-Salem, Greensboro, High Point, Lexington, and surrounding areas in North Carolina."
            }
          },
          {
            "@type": "Question",
            "name": "What is PanelSeal?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "PanelSeal is our premium waterproofing and sealing product designed for shipping containers, trailers, and other structures. It provides superior protection against water damage."
            }
          },
          {
            "@type": "Question",
            "name": "Can I rent containers for short-term use?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, we offer both short-term and long-term rental options for portable storage containers. Contact us for flexible rental terms that fit your needs."
            }
          }
        ]
      }
    ]
  }
}

export function injectStructuredData(structuredData) {
  // Remove existing structured data script if present
  const existing = document.getElementById('structured-data')
  if (existing) {
    existing.remove()
  }
  
  // Create and inject new script
  const script = document.createElement('script')
  script.id = 'structured-data'
  script.type = 'application/ld+json'
  script.textContent = JSON.stringify(structuredData, null, 2)
  document.head.appendChild(script)
}
