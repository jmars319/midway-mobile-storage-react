# Developer Guide

## Prerequisites
- Node.js 18+
- npm 9+
- PHP 8.4+
- MySQL 5.7+ or MariaDB 10.3+

## Local Setup
1) Install frontend dependencies:
   - scripts/dev-setup.sh
2) Create php-backend/config.php (if not created):
   - scripts/dev-setup.sh copies config.example.php when missing
3) Set VITE_API_BASE for local dev:
   - export VITE_API_BASE=http://127.0.0.1:8000/api

## Core Dev Scripts
- scripts/dev-start.sh
- scripts/dev-stop.sh
- scripts/dev-restart.sh
- scripts/dev-status.sh
- scripts/dev-verify.sh
- scripts/dev-backend-start.sh
- scripts/dev-backend-stop.sh
- scripts/dev-frontend-start.sh
- scripts/dev-frontend-stop.sh

## Script Configuration
- scripts/dev-config.example.sh (copy to scripts/dev-config.sh)

## Lint/Test/Build
- scripts/dev-lint.sh
- scripts/dev-test.sh
- scripts/dev-build.sh
  - frontend tests run via Vitest (see frontend/vite.config.js)

## Repo Structure
- frontend/: React + Vite client and admin UI
- php-backend/: PHP REST API and MySQL integration
- backend/: legacy Express server (deprecated)
- scripts/: dev and deployment scripts
- docs/: current documentation

## Conventions
- Keep UI changes consistent with existing components.
- Use VITE_API_BASE instead of hard-coding API hosts.
- Prefer minimal, focused changes.

## Admin API Verification
- scripts/dev-verify-admin-api.sh (requires ADMIN_USERNAME and ADMIN_PASSWORD)
