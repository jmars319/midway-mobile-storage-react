# System Public

## Public Routes
- /: main marketing site and sections
- /privacy: Privacy policy page
- /terms: Terms of service page

## Layout Components
- NavBar (primary navigation + admin login entry)
- HeroSection
- ServicesSection
- QuoteForm
- ProductsSection
- AboutSection
- LocationMap
- CareersSection
- Footer
- BackToTop

## Typography
- Defaults to system font stack defined in frontend/src/index.css.
- Keep headings consistent with the existing hierarchy in components.

## Content Sources
- frontend/src/lib/structuredData.js fetches public settings and injects structured data.
- Public settings API endpoints:
  - /api/public/logo
  - /api/public/hero
  - /api/public/services-media
  - /api/public/settings

## Public Guardrails
- Preserve section ordering in frontend/src/App.jsx unless product direction changes.
- Keep CTA copy aligned with quote request workflows.
- Avoid introducing heavy assets without updating performance guidance.
