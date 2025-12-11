import { useEffect, useRef } from 'react'

const FOCUSABLE_SELECTORS = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
].join(',')

let activeTrapCount = 0

function lockBodyScroll() {
  if (activeTrapCount === 0) {
    document.body.dataset.midwayScrollLock = 'true'
    document.body.style.overflow = 'hidden'
  }
  activeTrapCount += 1
}

function unlockBodyScroll() {
  activeTrapCount = Math.max(0, activeTrapCount - 1)
  if (activeTrapCount === 0) {
    delete document.body.dataset.midwayScrollLock
    document.body.style.overflow = ''
  }
}

export function useFocusTrap({ isActive, containerRef, onClose }) {
  const previousFocusRef = useRef(null)

  useEffect(() => {
    if (!isActive) return undefined
    const container = containerRef.current
    if (!container) return undefined

    lockBodyScroll()

    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null

    const focusables = () => Array.from(container.querySelectorAll(FOCUSABLE_SELECTORS))

    const focusFirst = () => {
      const nodes = focusables()
      const target = nodes.find(el => el.dataset?.autofocus === 'true') || nodes[0] || container
      requestAnimationFrame(() => {
        if (typeof target?.focus === 'function') target.focus()
      })
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        if (onClose) onClose()
        return
      }
      if (event.key === 'Tab') {
        const nodes = focusables()
        if (nodes.length === 0) {
          event.preventDefault()
          container.focus()
          return
        }
        const first = nodes[0]
        const last = nodes[nodes.length - 1]
        const active = document.activeElement
        if (!event.shiftKey && active === last) {
          event.preventDefault()
          first.focus()
        } else if (event.shiftKey && active === first) {
          event.preventDefault()
          last.focus()
        }
      }
    }

    container.addEventListener('keydown', handleKeyDown)
    focusFirst()

    return () => {
      container.removeEventListener('keydown', handleKeyDown)
      unlockBodyScroll()
      const previous = previousFocusRef.current
      if (previous && typeof previous.focus === 'function') {
        requestAnimationFrame(() => {
          try {
            previous.focus()
          } catch (_) {}
        })
      }
    }
  }, [isActive, containerRef, onClose])
}
