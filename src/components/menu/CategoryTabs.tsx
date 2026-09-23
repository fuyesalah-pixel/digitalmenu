import { motion } from 'framer-motion'
import { ChevronDown, SlidersHorizontal } from 'lucide-react'
import type { Category } from '../../lib/types'
import { cn } from '../../lib/utils'

type CategoryTabsProps = {
  categories: Category[]
  active: string
  onChange: (slug: string) => void
  itemCount: number
  onFilter: () => void
}

type Tab = {
  id: string
  slug: string
  name: string
  icon: string
  isAll?: boolean
}

export function CategoryTabs({ categories, active, onChange, itemCount, onFilter }: CategoryTabsProps) {
  // Reserve `all` for the synthetic view and make rendering safe even when an
  // API response contains stale, empty, or duplicated category rows.
  const seen = new Set<string>()
  const safeCategories = categories.reduce<Category[]>((safe, category) => {
    const slug = (category.slug || category.name || '').trim().toLowerCase()
    if (!slug || slug === 'all' || seen.has(slug)) return safe
    seen.add(slug)
    safe.push({ ...category, slug })
    return safe
  }, [])

  const tabs: Tab[] = [
    { id: 'tab-all', slug: 'all', name: 'All dishes', icon: '✦', isAll: true },
    ...safeCategories.map((category, index) => ({
      id: `tab-${category.slug}-${category.id || index}`,
      slug: category.slug,
      name: category.name,
      icon: category.icon || '🍴',
    })),
  ]

  return (
    <div className="category-nav-wrap">
      <div className="category-nav" role="tablist" aria-label="Menu categories">
        {tabs.map((tab) => {
          const isActive = active === tab.slug
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              className={cn('category-pill', isActive && 'is-active')}
              onClick={() => onChange(tab.slug)}
            >
              {isActive && <motion.span layoutId="activeCategoryPill" className="category-pill-glow" aria-hidden="true" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />}
              <span className="category-symbol" aria-hidden="true">{tab.icon}</span>
              <span>{tab.name}</span>
              {tab.isAll && <small>{itemCount}</small>}
            </button>
          )
        })}
        <span className="category-fade" aria-hidden="true" />
      </div>
      <button className="filter-button" onClick={onFilter} aria-label="Open menu filters">
        <SlidersHorizontal size={16} />
        <span>Filter</span>
        <ChevronDown size={14} />
      </button>
    </div>
  )
}
