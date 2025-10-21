# Backend — Midway Mobile Storage

The backend is a small Express server that provides demo endpoints for a public quote form and protected admin APIs.

Features
- Public: POST `/api/quotes` — accepts quote form submissions and stores in memory (and attempts DB insert if configured)
- Admin: Protected endpoints (JWT) for `/api/quotes`, `/api/inventory`, `/api/applications`, `/api/orders`, and `/api/admin/stats`
- Optional MySQL persistence: server will attempt to connect if `DB_*` vars are provided.

Running locally

1. Copy or create `.env` (see `.env.example`)
2. Install dependencies: `npm install`
3. Start dev server: `npm run dev`

Notes
- JWT secret: `JWT_SECRET` in `.env`; defaults to `dev-secret` for convenience in local dev.
- The server will fallback to demo store arrays if DB connection fails.
