import React, { useRef, useId, useCallback } from 'react'
import { useFocusTrap } from '../hooks/useFocusTrap'

export default function ConfirmModal({ title='Confirm', message='Are you sure?', confirmText='Yes', cancelText='Cancel', onConfirm, onCancel, loading = false }){
  const labelId = useId()
  const descriptionId = useId()
  const dialogRef = useRef(null)

  const handleClose = useCallback(() => {
    if (loading) return
    if (onCancel) onCancel()
  }, [loading, onCancel])

  useFocusTrap({ isActive: true, containerRef: dialogRef, onClose: handleClose })

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) handleClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onMouseDown={handleOverlayClick} role="presentation">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelId}
        aria-describedby={descriptionId}
        tabIndex="-1"
        className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 focus:outline-none"
      >
        <div className="flex items-start justify-between">
          <h3 id={labelId} className="text-lg font-bold">{title}</h3>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e84424] focus-visible:ring-offset-2 rounded"
            disabled={loading}
            aria-label="Close confirmation dialog"
          >✕</button>
        </div>
        <div id={descriptionId} className="mt-4 text-sm text-gray-700">{message}</div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={handleClose}
            className="px-3 py-1 bg-gray-200 rounded"
            disabled={loading}
            data-autofocus="true"
          >
            {cancelText}
          </button>
          <button onClick={onConfirm} className="px-3 py-1 bg-red-600 text-white rounded" disabled={loading}>{loading ? 'Processing…' : confirmText}</button>
        </div>
      </div>
    </div>
  )
}
