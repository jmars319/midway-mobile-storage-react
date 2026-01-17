import React, { useRef } from 'react'
import ModalShell from './ModalShell'
import { useFocusTrap } from '../hooks/useFocusTrap'

export default function StandardModal({
  children,
  onClose,
  labelledBy,
  describedBy,
  panelClassName = '',
  panelProps = {},
  overlayClassName = ''
}){
  const dialogRef = useRef(null)

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget && onClose) onClose()
  }

  useFocusTrap({ isActive: true, containerRef: dialogRef, onClose })

  return (
    <ModalShell
      onOverlayClick={onClose ? handleOverlayClick : undefined}
      panelRef={dialogRef}
      panelProps={{
        role: 'dialog',
        'aria-modal': 'true',
        ...(labelledBy ? { 'aria-labelledby': labelledBy } : {}),
        ...(describedBy ? { 'aria-describedby': describedBy } : {}),
        tabIndex: '-1',
        ...panelProps
      }}
      panelClassName={panelClassName}
      overlayClassName={overlayClassName}
    >
      {children}
    </ModalShell>
  )
}
