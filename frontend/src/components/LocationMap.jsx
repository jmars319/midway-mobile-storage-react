import React from 'react'
import { REVIEW_URL, PRIVATE_FEEDBACK_LINK } from '../config'

const ADDRESS = '212 Fred Sink Road, Winston-Salem, NC 27107'
const MAP_QUERY = encodeURIComponent(ADDRESS)
const MAP_EMBED_URL = `https://www.google.com/maps?q=${MAP_QUERY}&output=embed`
const MAP_LINK = `https://www.google.com/maps/dir/?api=1&destination=${MAP_QUERY}`

export default function LocationMap(){
  return (
    <section aria-labelledby="location-heading" className="py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 id="location-heading" className="text-2xl font-semibold text-[#0a2a52]">Visit Our Yard</h2>
            <p className="mt-3 text-gray-700">
              We stage containers and PanelSeal inventory at{' '}
              <span className="font-semibold">{ADDRESS}</span>. Use the map for driving directions or tap
              the button below to open Google Maps in a new tab.
            </p>
            <div className="flex flex-col gap-3 mt-4">
              <a
                href={MAP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-4 py-2 bg-[#e84424] text-white rounded font-semibold hover:bg-[#c93a1f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a2a52]"
              >
                Open in Google Maps
              </a>
              <div className="bg-white rounded-md border border-gray-200 p-4 shadow-sm">
                <p className="text-sm text-gray-600">Reviews help a local business. Please leave honest feedback.</p>
                <div className="mt-3 flex flex-wrap gap-3">
                  <a
                    href={REVIEW_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-4 py-2 bg-[#0a2a52] text-white rounded font-semibold hover:bg-[#082449] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a2a52]"
                    aria-label="Leave a review for Midway Mobile Storage (opens in new tab)"
                  >
                    Leave a Review
                  </a>
                  <a
                    href={PRIVATE_FEEDBACK_LINK}
                    className="inline-flex items-center text-sm text-[#0a2a52] underline font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a2a52]"
                    aria-label="Open the private feedback form"
                  >
                    Send private feedback
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="relative w-full overflow-hidden rounded-lg shadow bg-gray-100" style={{ paddingTop: '56.25%' }}>
            <iframe
              title="Midway Mobile Storage location map"
              src={MAP_EMBED_URL}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              aria-label="Google Maps embed showing the Midway Mobile Storage yard"
              className="absolute inset-0 h-full w-full border-0"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
