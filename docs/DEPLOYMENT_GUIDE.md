# Deployment Guide

## Primary Target: Vercel (Frontend)

Use Vercel for the React/Vite frontend. The PHP API must be hosted on a PHP-capable server (see legacy appendix).

### Vercel Setup
- Root directory: frontend/
- Build command: npm run build
- Output directory: dist
- Environment variables:
  - VITE_API_BASE = https://midwaymobilestorage.com/api (or your API host)

### Build Checks
- Run scripts/dev-build.sh before deploy.
- Optional: scripts/dev-lint.sh and scripts/dev-test.sh if scripts exist.

## Backend Deployment (PHP)
- Deploy backend/ to a PHP 8 host with MySQL.
- Copy config.example.php to config.php and set production values.
- Ensure api/.htaccess and storage/.htaccess are present on the server.
- Verify /api/health returns status ok.

## Deploy Zip Workflow
- Build and package:
  - scripts/make-deploy-zips.sh
- Validate zips:
  - scripts/check-deploy-zips.sh

Outputs go to deploy/ as deploy-frontend.zip and deploy-backend.zip.

## Legacy Appendix
Historical cPanel deployment steps are no longer bundled in this repository.
