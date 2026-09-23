import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import { CategoryTabs } from './CategoryTabs'

describe('CategoryTabs', () => {
  it('reserves all and deduplicates stale category rows', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    render(<CategoryTabs categories={[
      { id: 'all', name: 'All', slug: 'all', icon: '✦', displayOrder: 0, isActive: true },
      { id: 'chickens-1', name: 'Chickens', slug: 'chickens', icon: '🍗', displayOrder: 1, isActive: true },
      { id: 'chickens-2', name: 'Chickens duplicate', slug: 'chickens', icon: '🍗', displayOrder: 2, isActive: true },
      { id: 'empty', name: '', slug: '', icon: '', displayOrder: 3, isActive: true },
    ]} active="all" onChange={() => undefined} itemCount={59} onFilter={() => undefined} />)
    expect(screen.getAllByRole('tab')).toHaveLength(2)
    expect(screen.getByRole('tab', { name: /all dishes/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /chickens/i })).toBeInTheDocument()
    expect(error).not.toHaveBeenCalled()
    error.mockRestore()
  })
})
