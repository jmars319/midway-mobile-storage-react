# Copilot Instructions Summary

## Status
This file is archival and is not part of the current documentation spine.

The old Copilot bundle described an early React + Node/Express build, localhost port `5001`, `/api/login`, demo credentials, and a one-file React implementation plan. Those assumptions are stale.

## Current Sources Of Truth
- System map: `docs/SYSTEM_OVERVIEW.md`
- Public site: `docs/SYSTEM_PUBLIC.md`
- Admin surface: `docs/SYSTEM_ADMIN.md`
- Development workflow: `docs/DEVELOPER_GUIDE.md`
- Deployment: `docs/DEPLOYMENT_GUIDE.md`
- Backend layout: `backend/README.md`

## Current Architecture
- Frontend: React 18 + Vite in `frontend/`
- Backend: flattened PHP 8 API in `backend/`
- Authentication: `POST /api/auth/login`
- API base: `VITE_API_BASE`
- Admin and login screens: client-side SPA views managed by `frontend/src/App.jsx`

## Retired Assumptions
Do not use or regenerate guidance that assumes:
- Node/Express backend
- `server.js`
- Backend port `5001`
- `/api/login`
- `admin` / `admin123` as production credentials
- All React code in a single `App.js` file
