import { useState, useEffect, useCallback } from 'react'
import { API_BASE } from '../config'

let cachedToken = null
let tokenPromise = null
let cachedError = null

async function requestCsrfToken(forceRefresh = false) {
  if (!forceRefresh && cachedToken) return cachedToken
  if (tokenPromise && !forceRefresh) return tokenPromise

  tokenPromise = fetch(`${API_BASE}/csrf-token`, {
    method: 'GET',
    credentials: 'include'
  })
    .then(res => {
      if (!res.ok) throw new Error('Failed to fetch CSRF token')
      return res.json()
    })
    .then(data => {
      cachedToken = data.csrf_token
      cachedError = null
      return cachedToken
    })
    .catch(err => {
      cachedToken = null
      cachedError = err
      throw err
    })
    .finally(() => {
      tokenPromise = null
    })

  return tokenPromise
}

/**
 * Custom hook to fetch and manage CSRF tokens across the app.
 * Ensures multiple components share the same request to avoid duplicate fetches.
 */
export function useCsrfToken() {
  const [token, setToken] = useState(cachedToken)
  const [loading, setLoading] = useState(!cachedToken)
  const [error, setError] = useState(cachedError ? cachedError.message : null)

  const refreshToken = useCallback(async () => {
    setLoading(true)
    try {
      const newToken = await requestCsrfToken(true)
      setToken(newToken)
      setError(null)
      return newToken
    } catch (err) {
      setToken(null)
      setError(err.message)
      if (import.meta.env.DEV) console.error('CSRF token refresh error:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    if (!cachedToken) {
      requestCsrfToken().then(
        newToken => {
          if (!isMounted) return
          setToken(newToken)
          setError(null)
          setLoading(false)
        },
        err => {
          if (!isMounted) return
          setToken(null)
          setError(err.message)
          setLoading(false)
          if (import.meta.env.DEV) console.error('CSRF token fetch error:', err)
        }
      )
    } else {
      setToken(cachedToken)
      setLoading(false)
      setError(null)
    }

    return () => {
      isMounted = false
    }
  }, [])

  return { token, loading, error, refreshToken }
}
