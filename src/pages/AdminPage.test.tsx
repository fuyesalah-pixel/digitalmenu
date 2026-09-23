import { render, screen } from '@testing-library/react'
import AdminPage from './AdminPage'

describe('admin studio', () => {
  it('renders the overview dashboard with key metrics', () => {
    render(<AdminPage />)
    expect(screen.getByRole('heading', { name: /good morning/i })).toBeInTheDocument()
    expect(screen.getByText('Total menu items')).toBeInTheDocument()
    expect(screen.getByText('Menu engagement')).toBeInTheDocument()
  })
})
