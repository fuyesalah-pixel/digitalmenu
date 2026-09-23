import { act, render, screen, waitFor } from '@testing-library/react'
import { LoginModal } from './LoginModal'
import { useMenuStore } from '../../lib/store'

describe('LoginModal', () => {
  afterEach(() => {
    act(() => useMenuStore.setState({ isLoginOpen: false }))
    document.body.style.overflow = ''
  })

  it('renders the login dialog through a body portal and locks scrolling', async () => {
    act(() => useMenuStore.setState({ isLoginOpen: true }))
    await act(async () => { render(<LoginModal />) })
    await waitFor(() => expect(screen.getByRole('dialog', { name: /admin login/i })).toBeInTheDocument())
    expect(document.body.querySelector('.login-backdrop')).toBeInTheDocument()
    expect(document.body.style.overflow).toBe('hidden')
  })
})
