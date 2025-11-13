// Centralized configuration for API endpoints
// Use environment variable in production, fallback to localhost for development
export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5001/api'
export const BACKEND_ORIGIN = API_BASE.replace(/\/api\/?.*$/, '')
