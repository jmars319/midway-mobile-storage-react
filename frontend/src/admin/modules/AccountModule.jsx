import React, { useState } from 'react'
import { showToast } from '../../components/Toast'
import { API_BASE } from '../../config'

export default function AccountModule({ user }) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPasswords, setShowPasswords] = useState(false)

  const token = typeof window !== 'undefined' ? localStorage.getItem('midway_token') : null

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Client-side validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast('All fields are required', { type: 'error' })
      return
    }

    if (newPassword.length < 8) {
      showToast('New password must be at least 8 characters long', { type: 'error' })
      return
    }

    if (newPassword !== confirmPassword) {
      showToast('New password and confirmation do not match', { type: 'error' })
      return
    }

    if (currentPassword === newPassword) {
      showToast('New password must be different from current password', { type: 'error' })
      return
    }

    setLoading(true)

    try {
      const res = await fetch(`${API_BASE}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword
        })
      })

      const data = await res.json()

      if (res.ok) {
        showToast('Password changed successfully!', { type: 'success' })
        // Clear form
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        setShowPasswords(false)
      } else {
        showToast(data.error || 'Failed to change password', { type: 'error' })
      }
    } catch (err) {
      showToast('Failed to change password', { type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' }
    
    let strength = 0
    if (password.length >= 8) strength++
    if (password.length >= 12) strength++
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^a-zA-Z0-9]/.test(password)) strength++

    if (strength <= 2) return { strength, label: 'Weak', color: 'bg-red-500' }
    if (strength <= 3) return { strength, label: 'Fair', color: 'bg-yellow-500' }
    if (strength <= 4) return { strength, label: 'Good', color: 'bg-blue-500' }
    return { strength, label: 'Strong', color: 'bg-green-500' }
  }

  const passwordStrength = getPasswordStrength(newPassword)

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold text-[#0a2a52]">Account Security</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-[#0a2a52] mb-2">Change Password</h2>
          <p className="text-sm text-gray-600">
            Logged in as: <span className="font-semibold">{user?.username || 'admin'}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current Password */}
          <div>
            <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 mb-1">
              Current Password *
            </label>
            <input
              id="current-password"
              type={showPasswords ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-3 border rounded focus:ring-2 focus:ring-[#e84424] focus:outline-none"
              required
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          {/* New Password */}
          <div>
            <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
              New Password *
            </label>
            <input
              id="new-password"
              type={showPasswords ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 border rounded focus:ring-2 focus:ring-[#e84424] focus:outline-none"
              required
              disabled={loading}
              minLength={8}
              autoComplete="new-password"
            />
            {newPassword && (
              <div className="mt-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex-1 h-2 bg-gray-200 rounded overflow-hidden">
                    <div
                      className={`h-full transition-all ${passwordStrength.color}`}
                      style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{passwordStrength.label}</span>
                </div>
                <p className="text-xs text-gray-500">
                  Must be at least 8 characters. Stronger with uppercase, numbers, and symbols.
                </p>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password *
            </label>
            <input
              id="confirm-password"
              type={showPasswords ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 border rounded focus:ring-2 focus:ring-[#e84424] focus:outline-none"
              required
              disabled={loading}
              minLength={8}
              autoComplete="new-password"
            />
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="mt-1 text-sm text-red-600">Passwords do not match</p>
            )}
          </div>

          {/* Show/Hide Passwords Toggle */}
          <div className="flex items-center">
            <input
              id="show-passwords"
              type="checkbox"
              checked={showPasswords}
              onChange={(e) => setShowPasswords(e.target.checked)}
              className="mr-2"
              disabled={loading}
            />
            <label htmlFor="show-passwords" className="text-sm text-gray-700 cursor-pointer">
              Show passwords
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-4 flex gap-3">
            <button
              type="submit"
              disabled={loading || !currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword}
              className="bg-[#e84424] text-white px-6 py-2 rounded font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#d13918]"
            >
              {loading ? 'Changing Password...' : 'Change Password'}
            </button>
            {(currentPassword || newPassword || confirmPassword) && !loading && (
              <button
                type="button"
                onClick={() => {
                  setCurrentPassword('')
                  setNewPassword('')
                  setConfirmPassword('')
                  setShowPasswords(false)
                }}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded hover:bg-gray-300"
              >
                Clear
              </button>
            )}
          </div>
        </form>

        {/* Security Recommendations */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">🛡️ Password Security Tips</h3>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• Use at least 12 characters for maximum security</li>
            <li>• Include a mix of uppercase, lowercase, numbers, and symbols</li>
            <li>• Don't use personal information or common words</li>
            <li>• Don't reuse passwords from other accounts</li>
            <li>• Consider using a password manager</li>
            <li>• Change your password if you suspect it's been compromised</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
