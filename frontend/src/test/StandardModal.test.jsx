import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import StandardModal from '../components/StandardModal'

describe('StandardModal', () => {
  it('renders a dialog with accessible labels and handles overlay close', () => {
    const onClose = vi.fn()

    render(
      <StandardModal onClose={onClose} labelledBy="modal-title" describedBy="modal-desc">
        <div>
          <h2 id="modal-title">Modal Title</h2>
          <p id="modal-desc">Modal description</p>
          <button type="button">Confirm</button>
        </div>
      </StandardModal>
    )

    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title')
    expect(dialog).toHaveAttribute('aria-describedby', 'modal-desc')

    const overlay = screen.getByRole('presentation')
    fireEvent.mouseDown(overlay)
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
