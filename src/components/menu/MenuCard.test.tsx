import { render, screen } from '@testing-library/react'
import { MenuCard } from './MenuCard'
import { menuItems } from '../../lib/data'

describe('MenuCard', () => {
  it('renders a dish name, price and dietary marks', () => {
    const item = menuItems.find((dish) => dish.isVeg)!
    render(<MenuCard item={item} index={0} />)
    expect(screen.getByText(item.name)).toBeInTheDocument()
    expect(screen.getByText(`${item.price} ETB`)).toBeInTheDocument()
    expect(screen.getByLabelText('Vegetarian')).toBeInTheDocument()
  })

  it('disables the add action for unavailable dishes', () => {
    const item = { ...menuItems[0], isAvailable: false }
    render(<MenuCard item={item} index={0} />)
    expect(screen.getByRole('button', { name: /add/i })).toBeDisabled()
  })
})
