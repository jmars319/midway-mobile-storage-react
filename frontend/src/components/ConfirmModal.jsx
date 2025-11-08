import React from 'react'

export default function ConfirmModal({ title='Confirm', message='Are you sure?', confirmText='Yes', cancelText='Cancel', onConfirm, onCancel, loading = false }){
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-bold">{title}</h3>
          <button onClick={onCancel} className="text-gray-500" disabled={loading}>✕</button>
        </div>
        <div className="mt-4 text-sm text-gray-700">{message}</div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onCancel} className="px-3 py-1 bg-gray-200 rounded" disabled={loading}>{cancelText}</button>
          <button onClick={onConfirm} className="px-3 py-1 bg-red-600 text-white rounded" disabled={loading}>{loading ? 'Processing…' : confirmText}</button>
        </div>
      </div>
    </div>
  )
}
