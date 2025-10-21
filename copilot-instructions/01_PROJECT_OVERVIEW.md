# Midway Mobile Storage - Project Overview

## Project Description
A full-stack React website for Midway Mobile Storage, a company that rents and sells shipping containers and trailers for storage needs. The site includes a public-facing website and an admin panel for managing quotes, inventory, job applications, and orders.

## Tech Stack
- **Frontend**: React 18 with functional components and hooks
- **Styling**: Tailwind CSS with custom brand colors
- **Icons**: Lucide React
- **Backend**: Node.js with Express
- **Database**: MySQL
- **Authentication**: bcrypt for password hashing

## Project Structure
```
midway-mobile-storage/
├── backend/
│   ├── server.js
│   ├── package.json
│   └── .env
└── frontend/
    ├── public/
    ├── src/
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    ├── package.json
    ├── tailwind.config.js
    └── postcss.config.js
```

## Key Features

### Public Website
1. **Navigation Bar** - Fixed header with smooth scrolling
2. **Hero Section** - Compelling CTA with benefits
3. **Services Section** - Container rentals, sales, trailers, custom builds
4. **Products Section** - PanelSeal waterproofing product
5. **Quote Request Form** - Capture customer inquiries
6. **About Section** - Company information and commitments
7. **Careers Section** - Job listings and application form
8. **Footer** - Contact info, quick links, container dimensions

### Admin Panel
1. **Dashboard** - Statistics and recent activity
2. **Quote Requests** - Manage customer quotes
3. **Inventory Management** - Track containers and trailers
4. **Job Applications** - Review applicants
5. **PanelSeal Orders** - Manage product orders
6. **Settings** - Business information management

## Brand Colors
Derived from the official Midway Mobile Storage logo:
- **Primary Navy**: `#0a2a52`
- **Accent Orange-Red**: `#e84424`
- **Dark Navy**: `#0d3464`
- **Light Navy**: `#1a4d7a`
- **Hover Orange**: `#d13918`

## API Configuration
- **Backend Port**: 5001
- **Frontend Port**: 3000 (React default)
- **API Base URL**: `http://localhost:5001/api`

## Database
MySQL database named `midway_storage` with tables:
- admin_users
- quote_requests
- job_applications
- inventory
- panelseal_orders
- business_settings
- rental_contracts
- activity_log

## Authentication
- Demo admin credentials: username `admin`, password `admin123`
- Passwords hashed with bcrypt (10 rounds)

## Important Notes
- All React components are functional with hooks
- No class components used
- Smooth scrolling implemented for navigation
- Mobile-responsive design
- Form validation on all user inputs
- CORS enabled for local development