import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Modal } from './Modal'

describe('Modal', () => {
  it('renders in a body portal, locks scroll, and closes on Escape', () => {
    const onClose = vi.fn()
    render(<Modal open onClose={onClose} title="Add a dish"><form><label>Dish name<input /></label></form></Modal>)
    expect(screen.getByRole('dialog', { name: 'Add a dish' })).toBeInTheDocument()
    expect(document.body.querySelector('.modal-portal-backdrop')).toBeInTheDocument()
    expect(document.body.style.overflow).toBe('hidden')
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
