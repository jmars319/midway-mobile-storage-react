# System Admin

## Admin Surface
- No standalone admin service; admin UI is bundled inside the frontend SPA.
- Entry is from the footer "Admin Login" action.
- `/admin` and `/login` are client-side SPA views handled by state in `frontend/src/App.jsx`, not independent server routes.
- `App.jsx` only deep-links `/privacy` and `/terms`; admin/login visibility comes from the admin login action, local storage token check, and in-memory `currentPage` state.

## Admin Modules
- Dashboard
- Quotes
- Messages
- Inventory
- Applications
- Orders
- Site Settings
- Account and Settings

## SEO and Content Controls
- Site Settings drives structured data fields (business name, address, hours, site URL).
- Site Settings controls the Google Maps embed URL and whether the map auto-loads.
- Media Manager controls active logo/hero assets used in public pages.

## Authentication
- JWT tokens stored in localStorage under the midway_token key.
- Admin login endpoint: /api/auth/login

## Future Admin Notes
- If a standalone admin route is introduced, update App.jsx routing logic and docs/SYSTEM_OVERVIEW.md.
- Any new admin modules should be documented here with API endpoints and data sources.
