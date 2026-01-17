# PageSpeed Tradeoffs

## Goals
- Keep Lighthouse Performance >= 90 on mobile.
- Maintain Accessibility and SEO at 95+.
- Avoid regression in bundle size and render-blocking assets.

## Current Tradeoffs
- Admin UI is lazy-loaded to keep public bundle light.
- Structured data is injected at runtime after settings fetch.
- Media assets stay compressed to reduce initial payload.

## Acceptable Costs
- Small runtime fetch for public settings.
- Minimal client-side rendering overhead for admin routes.

## Verification Steps
- Lighthouse run in an incognito window.
- Inspect bundle output from npm run build.
- Confirm no new large assets added to frontend/public.
- Validate /api/health latency and uptime.
