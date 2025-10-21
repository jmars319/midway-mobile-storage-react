# Midway Mobile Storage — React + Express Demo

This repository contains a small demo website and admin panel for Midway Mobile Storage.

Purpose
- Provide a minimal public marketing site (React + Vite + Tailwind) with a quote form.
- Provide a small admin panel to review quotes, inventory, applications, and orders (React).
- Provide a lightweight Express backend with optional MySQL persistence and in-memory demo stores.

Contents
- `frontend/` — Vite + React frontend (public site + admin UI)
- `backend/` — Express server with demo endpoints, optional MySQL persistence

Quick start (development)

1. Start the backend

```bash
cd backend
npm install
# create a .env (see backend/.env.example) or ensure credentials in project root
npm run dev
```

2. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

3. Visit the public site at http://localhost:5173 (Vite default). The backend listens on port 5001 by default.

Admin login (demo)
- Username: `admin`
- Password: `admin123`

Notes
- Backend will try to connect to MySQL using the values in `backend/.env` or `./.env`.
- If MySQL is not available the server falls back to in-memory demo stores for quotes/inventory/applications/orders.
- Tokens are stored in `localStorage` under `midway_token` for demo authentication.

Files of interest
- `backend/server.js` — API server, demo stores, protected endpoints
- `frontend/src/App.jsx` — app entry; handles auth state and page switching
- `frontend/src/admin/*` — admin UI and modules

If you want me to add a DB seed endpoint, test scripts, or CI steps, tell me and I will add them.
