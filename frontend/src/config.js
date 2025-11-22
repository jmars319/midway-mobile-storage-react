// Centralized configuration for API endpoints
// Use environment variable in production, fallback to localhost for development
// PHP backend runs on port 8000, Node.js backend on 5001
export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'
export const BACKEND_ORIGIN = API_BASE.replace(/\/api\/?.*$/, '')
