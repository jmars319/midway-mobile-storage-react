import React, { useState } from 'react'

const API_BASE = 'http://localhost:5001/api'

export default function LoginPage({ onLogin, onBack }){
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const submit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/auth/login`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ username, password }) })
      const payload = await res.json()
      if (res.ok && payload.token) {
        onLogin({ username, token: payload.token })
      } else {
        setError(payload.error || 'Invalid credentials')
      }
    } catch (err) {
      console.error(err)
      setError('Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a2a52] via-[#0d3464] to-[#0a2a52]">
      <div className="max-w-md w-full p-6 bg-white rounded shadow">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-[#0a2a52]">Midway Admin</h2>
          <div className="text-sm text-gray-500">Sign in to manage orders, quotes, inventory and applications</div>
        </div>

        {error && <div className="mb-3 text-red-600">{error}</div>}

        <form onSubmit={submit} className="grid gap-3">
          <label className="text-sm text-[#0a2a52]">Username</label>
          <input value={username} onChange={(e)=>setUsername(e.target.value)} placeholder="Username" className="p-2 border rounded" />

          <label className="text-sm text-[#0a2a52]">Password</label>
          <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" className="p-2 border rounded" />

          <div className="flex items-center justify-between mt-2">
            <button type="submit" disabled={loading} className="bg-[#e84424] text-white px-4 py-2 rounded font-semibold disabled:opacity-60">{loading? 'Signing in...' : 'Sign In'}</button>
            <button type="button" onClick={onBack} className="text-sm">Back</button>
          </div>
        </form>

        <div className="mt-4 text-sm text-gray-600">
          Demo credentials: <div className="mt-1 font-mono text-sm">admin / admin123</div>
        </div>
      </div>
    </div>
  )
}
