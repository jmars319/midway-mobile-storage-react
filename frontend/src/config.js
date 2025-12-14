// Centralized configuration for API endpoints
// For production deployment: Update this to your production domain before building
// For local development: Uses localhost with PHP backend on port 8000

const DEFAULT_API_BASE = 'https://midwaymobilestorage.com/api'
const envBase = (import.meta?.env && typeof import.meta.env.VITE_API_BASE === 'string')
  ? import.meta.env.VITE_API_BASE.trim()
  : ''

export const API_BASE = envBase || DEFAULT_API_BASE
export const BACKEND_ORIGIN = API_BASE.replace(/\/api\/?.*$/, '')

// Central place for marketing CTAs so updating future URLs is simple
export const REVIEW_URL = 'https://share.google/3ZQAIfYdAA6C4y3zj'
export const PRIVATE_FEEDBACK_LINK = '#contact'
