# System Overview

## System Map
- Frontend: React 18 + Vite + Tailwind (frontend/)
- Backend (active): PHP 8 REST API with MySQL (backend/)
- Admin UI: Single-page admin inside frontend/ (lazy loaded)

## Runtime Flow
- Public site renders sections from frontend components.
- Frontend reads API base from VITE_API_BASE when present; otherwise uses the production base in frontend/src/config.js.
- Public endpoints fetch site settings and media metadata for hero, services, and logos.
- Admin UI authenticates via JWT from the PHP backend and uses protected endpoints.

## Routes
- Public:
  - / (home sections)
  - /privacy
  - /terms
- Admin SPA views:
  - /admin and /login are not server-rendered routes. They are client-side views selected by state in frontend/src/App.jsx.
  - Direct requests should fall back to the frontend shell; App.jsx only parses /privacy and /terms from window.location.
- API (PHP backend): /api/*

## Canonical Doc Spine
- docs/SYSTEM_OVERVIEW.md
- docs/SYSTEM_PUBLIC.md
- docs/SYSTEM_ADMIN.md
- docs/SYSTEM_OPS.md
- docs/DEVELOPER_GUIDE.md
- docs/DEPLOYMENT_GUIDE.md
- docs/PAGESPEED_TRADEOFFS.md

## Archived Docs
- docs/COPILOT_INSTRUCTIONS_SUMMARY.md (legacy Copilot assumptions only; not implementation guidance)

## Content Guardrails
- Brand voice: clear, local, professional, service-forward.
- Keep service areas and pricing factual; avoid unsupported claims.
- Maintain CTA consistency (quote requests, contact, admin login).
- Preserve accessibility checks already in place (landmarks, labels, contrast).
