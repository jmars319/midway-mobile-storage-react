// Centralized configuration for API endpoints
// For production deployment: Update this to your production domain before building
// For local development: Uses localhost with PHP backend on port 8000

// PRODUCTION: Uncomment this line before running 'npm run build' for deployment
// export const API_BASE = 'https://midwaymobilestorage.com/api'

// DEVELOPMENT: Comment out this line before building for production
export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

export const BACKEND_ORIGIN = API_BASE.replace(/\/api\/?.*$/, '')
