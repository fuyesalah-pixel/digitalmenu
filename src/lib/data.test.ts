import { describe, expect, it } from 'vitest'
import { categories, menuItems } from './data'

describe('Sunrise Cafe menu seed', () => {
  it('contains the eight fixed categories and all seeded dishes', () => {
    expect(categories.filter((category) => category.id !== 'all')).toHaveLength(8)
    expect(categories.filter((category) => category.id !== 'all').map((category) => category.name)).toEqual([
      'Chickens', 'Pizza & Burgers', 'Ethiopian Food', 'Cakes', 'Juice', 'Hot Drinks', 'Cold Drinks', 'Soft Drinks',
    ])
    expect(menuItems).toHaveLength(59)
    expect(menuItems.find((item) => item.name === 'Fried Chicken (4 pcs)')?.price).toBe(480)
    expect(menuItems.find((item) => item.name === 'Whole Celebration Cake (1kg)')?.price).toBe(1200)
  })
})
