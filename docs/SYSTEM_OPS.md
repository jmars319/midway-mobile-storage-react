# System Ops

## Hosting
- Frontend: static build (Vite) deployed to Vercel or shared hosting.
- Backend: PHP 8 API hosted on PHP-capable infrastructure (current production uses GoDaddy cPanel).

## Environment Variables
Frontend:
- VITE_API_BASE: base URL for API, ex: http://127.0.0.1:8000/api

PHP Backend (backend/config.php):
- DB_HOST, DB_USER, DB_PASS, DB_NAME
- JWT_SECRET
- ALLOWED_ORIGINS
- DEBUG_MODE
- RATE_LIMIT_REQUESTS, RATE_LIMIT_WINDOW
- SEND_EMAILS and email config

## Security Headers
Set in backend/utils.php:
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection
- Referrer-Policy
- Permissions-Policy

## SEO and Monitoring
- Frontend provides robots.txt and sitemap.xml in frontend/public.
- Structured data is injected at runtime via frontend/src/lib/structuredData.js.
- Health endpoint: /api/health

## Verification Checklist
- /api/health returns status ok.
- Admin login works and protected endpoints return data.
- Public site loads with no console errors.
- Security headers present on API responses.
