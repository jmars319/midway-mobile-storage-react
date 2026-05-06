# PHP Backend

Midway Mobile Storage uses a flattened PHP 8 REST API for shared hosting. The active backend lives directly under `backend/`; there is no nested `backend/api/` source tree.

## Runtime Model
- Apache serves the deployed backend from the production `/api` path.
- `backend/.htaccess` rewrites API requests to `backend/router.php` when a request does not map directly to a PHP file.
- `backend/router.php` maps friendly paths such as `/api/quotes` and `/api/public/settings` to the flattened PHP endpoint files.
- MySQL access is handled through `backend/database.php`.
- Shared helpers, CORS, CSRF, auth, rate limiting, and response utilities live in `backend/utils.php`.

## Important Files
```text
backend/
├── .htaccess
├── router.php
├── config.example.php
├── config.php                  # local/production secret config, ignored
├── database.php
├── utils.php
├── health.php
├── csrf-token.php
├── quotes.php
├── messages.php
├── applications.php
├── orders.php
├── inventory.php
├── media.php
├── settings.php
├── stats.php
├── change-password.php
├── auth/login.php
├── admin/stats.php
├── media/tags.php
├── public/hero.php
├── public/logo.php
├── public/services-media.php
├── public/settings.php
├── migrations/*.sql
├── storage/.htaccess
└── storage/.gitkeep
```

## Deployment Layout
Deploy the contents of `backend/` to the server directory that is exposed as `/api`.

Example cPanel layout:
```text
public_html/
└── api/
    ├── .htaccess
    ├── router.php
    ├── config.php
    ├── database.php
    ├── utils.php
    ├── quotes.php
    ├── messages.php
    ├── inventory.php
    ├── auth/
    │   └── login.php
    ├── admin/
    │   └── stats.php
    ├── public/
    │   ├── hero.php
    │   ├── logo.php
    │   ├── services-media.php
    │   └── settings.php
    └── media/
        └── tags.php
```

Do not deploy a nested `api/` directory inside the API root.

## Configuration
1. Copy `config.example.php` to `config.php`.
2. Set database credentials, JWT secret, CORS origins, and debug mode.
3. Keep `config.php` out of git.
4. For production, set `DEBUG_MODE` to false and create a real admin user.

## Endpoints

### Public
- `GET /api/health`
- `GET /api/csrf-token`
- `GET /api/public/logo`
- `GET /api/public/hero`
- `GET /api/public/services-media`
- `GET /api/public/settings`
- `POST /api/quotes`
- `POST /api/messages`
- `POST /api/applications`
- `POST /api/orders`

### Authenticated Admin
- `POST /api/auth/login`
- `POST /api/auth/change-password`
- `GET /api/admin/stats`
- `GET /api/quotes`
- `PUT /api/quotes`
- `DELETE /api/quotes/{id}`
- `GET /api/messages`
- `PUT /api/messages`
- `DELETE /api/messages/{id}`
- `GET /api/applications`
- `DELETE /api/applications/{id}`
- `GET /api/orders`
- `DELETE /api/orders/{id}`
- `GET /api/inventory`
- `POST /api/inventory`
- `PUT /api/inventory/{id}`
- `DELETE /api/inventory/{id}`
- `GET /api/media`
- `POST /api/media`
- `DELETE /api/media/{filename}`
- `GET /api/media/{filename}/tags`
- `PUT /api/media/{filename}/tags`
- `GET /api/settings`
- `PUT /api/settings`

## Frontend API Base
Set the frontend API base with Vite:

```bash
VITE_API_BASE=https://midwaymobilestorage.com/api
```

Local dev scripts default this when possible; see `docs/DEVELOPER_GUIDE.md`.

## Validation
Syntax check the backend before deployment:

```bash
find backend -name '*.php' -print0 | xargs -0 -n1 php -l
```

Also run the frontend checks from the repo root:

```bash
scripts/dev-lint.sh
scripts/dev-test.sh
scripts/dev-build.sh
```

## Admin Credentials
Fallback `admin` / `admin123` credentials are only accepted when `DEBUG_MODE` is true and the database lookup fails. Do not rely on fallback credentials in production.

Create or update real admin users through the deployed database/admin workflow before go-live.

## Troubleshooting
- `500` responses: check PHP error logs, file permissions, `config.php`, and `.htaccess`.
- Database connection failures: verify DB host, database name, username, password, and privileges.
- CORS failures: verify the allowed origins in `config.php`.
- `404` API responses: confirm `router.php` and `.htaccess` are deployed at the API root.
