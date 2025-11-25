# Midway Mobile Storage

Production-ready website and admin panel for Midway Mobile Storage, a portable storage container rental company.

## Overview

**Stack**: React 18 + Vite + Tailwind CSS (frontend), PHP 8.4 + MySQL (backend)  
**Status**: ✅ Production Ready (Grade A+, see [PRODUCTION-REVIEW-2024-11-24.md](./PRODUCTION-REVIEW-2024-11-24.md))  
**Domain**: midwaymobilestorage.com

### Features
- 🏠 Public marketing site with services, products, quote form
- 👔 Careers section with job application submissions
- 📧 Contact forms with CSRF protection
- 🔐 Secure admin panel (JWT authentication, bcrypt passwords)
- 📦 Inventory, quotes, messages, orders, job applications management
- 🎨 Fully responsive, WCAG 2.1 AA accessible
- ⚡ Optimized performance (code splitting, 13 database indexes)

### Project Structure
- `frontend/` — React + Vite frontend (public site + admin UI)
- `php-backend/` — PHP 8 REST API with MySQL database
- `backend/` — Legacy Express server (deprecated, use `php-backend/`)

## Quick Start (Development)

### Prerequisites
- PHP 8.4+ with PDO MySQL extension
- MySQL 5.7+ or MariaDB 10.3+
- Node.js 18+ and npm

### 1. Database Setup
```bash
# Create database and user
mysql -u root -p
CREATE DATABASE midway_storage;
CREATE USER 'midway'@'localhost' IDENTIFIED BY 'midway2025';
GRANT ALL ON midway_storage.* TO 'midway'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Import schema
mysql -u midway -p midway_storage < php-backend/schema.sql
```

### 2. Backend Configuration
```bash
cd php-backend
# Copy config and update if needed (defaults work for local dev)
cp config.example.php config.php
```

### 3. Start Servers
```bash
# Terminal 1: PHP backend (port 8000)
cd php-backend
php -S localhost:8000 api/router.php

# Terminal 2: React frontend (port 5173)
cd frontend
npm install
npm run dev
```

### 4. Access Application
- **Public site**: http://localhost:5173
- **Admin panel**: Click "Admin Login" in footer
  - Username: `admin`
  - Password: `admin123` (DEBUG_MODE only)

## Security Features

- ✅ **JWT Authentication** - HS256 with 2-hour expiration
- ✅ **CSRF Protection** - All state-changing endpoints protected
- ✅ **SQL Injection Prevention** - 100% prepared statements
- ✅ **XSS Prevention** - Input sanitization with htmlspecialchars()
- ✅ **Rate Limiting** - 50 requests per 15 minutes
- ✅ **Security Headers** - X-Frame-Options, CSP, etc.
- ✅ **Password Hashing** - bcrypt with cost factor 12

## Deployment

See [DEPLOYMENT-SECURITY-CHECKLIST.md](./DEPLOYMENT-SECURITY-CHECKLIST.md) for complete GoDaddy cPanel + Cloudflare SSL deployment instructions.

**Pre-deployment checklist**:
1. Set `DEBUG_MODE = false` in `php-backend/config.php`
2. Update `ALLOWED_ORIGINS` to production domain only
3. Generate new `JWT_SECRET` (use environment variable)
4. Build frontend: `cd frontend && npm run build`
5. Export database with current data
6. Follow deployment guide step-by-step

## Documentation

- **[Production Review](./PRODUCTION-REVIEW-2024-11-24.md)** - Latest comprehensive audit (Grade A+)
- **[Deployment Guide](./DEPLOYMENT-SECURITY-CHECKLIST.md)** - Step-by-step GoDaddy + Cloudflare setup
- **[Contributing](./CONTRIBUTING.md)** - Development guidelines

## Key Files

**Backend**:
- `php-backend/api/router.php` - Request routing
- `php-backend/utils.php` - Security functions (CSRF, JWT, sanitization)
- `php-backend/config.php` - Configuration (database, CORS, rate limits)
- `php-backend/schema.sql` - Complete database schema

**Frontend**:
- `frontend/src/App.jsx` - Main application component
- `frontend/src/admin/AdminPanel.jsx` - Admin dashboard
- `frontend/src/components/` - All UI components
- `frontend/src/config.js` - API endpoint configuration

If you want me to add a DB seed endpoint, test scripts, or CI steps, tell me and I will add them.
