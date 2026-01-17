import React, { useId, useCallback } from 'react'
import StandardModal from './StandardModal'

export default function ConfirmModal({ title='Confirm', message='Are you sure?', confirmText='Yes', cancelText='Cancel', onConfirm, onCancel, loading = false }){
  const labelId = useId()
  const descriptionId = useId()
  const handleClose = useCallback(() => {
    if (loading) return
    if (onCancel) onCancel()
  }, [loading, onCancel])

  return (
    <StandardModal
      onClose={handleClose}
      labelledBy={labelId}
      describedBy={descriptionId}
      panelClassName="max-w-md w-full focus:outline-none"
    >
      <div className="flex items-start justify-between px-6 py-4 border-b">
        <h3 id={labelId} className="text-lg font-bold">{title}</h3>
        <button
          onClick={handleClose}
          className="text-gray-500 hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e84424] focus-visible:ring-offset-2 rounded"
          disabled={loading}
          aria-label="Close confirmation dialog"
        >✕</button>
      </div>
      <div id={descriptionId} className="min-h-0 flex-1 overflow-y-auto [-webkit-overflow-scrolling:touch] px-6 py-4 text-sm text-gray-700">
        {message}
      </div>
      <div className="px-6 py-4 border-t flex justify-end gap-3">
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
    </StandardModal>
  )
}
