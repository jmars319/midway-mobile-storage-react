import { useState, useEffect } from 'react'
import { API_BASE } from '../config'

/**
 * Custom hook to fetch and manage CSRF tokens
 * Automatically fetches a token on mount and provides it for form submissions
 */
export function useCsrfToken() {
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    async function fetchToken() {
      try {
        const res = await fetch(`${API_BASE}/csrf-token`, {
          method: 'GET',
          credentials: 'include', // Include cookies for session
        })
        
        if (!res.ok) {
          throw new Error('Failed to fetch CSRF token')
        }
        
        const data = await res.json()
        
        if (isMounted) {
          setToken(data.csrf_token)
          setError(null)
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message)
          if (import.meta.env.DEV) console.error('CSRF token fetch error:', err)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchToken()

    return () => {
      isMounted = false
    }
  }, [])

  return { token, loading, error }
}
