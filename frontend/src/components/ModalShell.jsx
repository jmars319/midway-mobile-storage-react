import React from 'react'

export default function ModalShell({
  children,
  onOverlayClick,
  panelRef,
  panelProps = {},
  panelClassName = '',
  overlayClassName = ''
}){
  const { className, ...restPanelProps } = panelProps
  const panelClasses = [
    'bg-white rounded-lg shadow-lg max-h-[90vh] flex flex-col overflow-hidden',
    panelClassName,
    className || ''
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className={`fixed inset-0 bg-black/40 flex items-center justify-center z-50 ${overlayClassName}`.trim()}
      onMouseDown={onOverlayClick}
      role="presentation"
    >
      <div ref={panelRef} className={panelClasses} {...restPanelProps}>
        {children}
      </div>
    </div>
  )
}
