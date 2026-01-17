# System Admin

## Admin Surface
- No standalone admin service; admin UI is bundled inside the frontend SPA.
- Entry is from the footer "Admin Login" action.
- Routes are handled client-side in frontend/src/App.jsx.

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
- Media Manager controls active logo/hero assets used in public pages.

## Authentication
- JWT tokens stored in localStorage under the midway_token key.
- Admin login endpoint: /api/auth/login

## Future Admin Notes
- If a standalone admin route is introduced, update App.jsx routing logic and docs/SYSTEM_OVERVIEW.md.
- Any new admin modules should be documented here with API endpoints and data sources.
