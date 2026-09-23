import { render, screen } from '@testing-library/react'
import App from './App'

describe('app shell', () => {
  it('renders the public menu experience', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /fresh flavors/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /explore the menu/i })).toBeInTheDocument()
  })
})
