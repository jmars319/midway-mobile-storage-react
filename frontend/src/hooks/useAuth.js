import { useState, useEffect } from 'react'

/**
 * Custom hook for managing authentication state
 * Centralizes token management and provides auth utilities
 */
export function useAuth() {
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load token from localStorage on mount
    const storedToken = localStorage.getItem('midway_token')
    setToken(storedToken)
    setLoading(false)
  }, [])

  const login = (newToken) => {
    localStorage.setItem('midway_token', newToken)
    setToken(newToken)
  }

  const logout = () => {
    localStorage.removeItem('midway_token')
    setToken(null)
  }

  const isAuthenticated = !!token

  return { token, login, logout, isAuthenticated, loading }
}

/**
 * Get auth headers for API requests
 */
export function getAuthHeaders(token) {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
}

/**
 * Handle API errors consistently
 */
export function handleApiError(error, response) {
  if (response?.status === 401) {
    // Token expired or invalid - clear it
    localStorage.removeItem('midway_token')
    window.location.reload()
    return 'Session expired. Please log in again.'
  }
  
  if (response?.status === 429) {
    return 'Too many requests. Please wait a moment and try again.'
  }
  
  if (response?.status === 400) {
    return error || 'Please check your input and try again.'
  }
  
  if (response?.status >= 500) {
    return 'Server error. Please try again later.'
  }
  
  return error || 'An unexpected error occurred. Please try again.'
}
