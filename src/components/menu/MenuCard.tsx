import { motion } from 'framer-motion'
import { Flame, Leaf, Plus, Star, Timer } from 'lucide-react'
import { toast } from 'sonner'
import type { MenuItem } from '../../lib/types'
import { useMenuStore } from '../../lib/store'
import { formatPrice } from '../../lib/utils'
import { MenuImage } from './MenuImage'

export function DietMark({ veg, spicy }: { veg: boolean; spicy: boolean }) {
  return (
    <span className="diet-marks" aria-label={`${veg ? 'Vegetarian' : 'Non-vegetarian'}${spicy ? ', spicy' : ''}`}>
      <i className={veg ? 'veg' : 'nonveg'}>{veg ? '●' : '●'}</i>
      {spicy && <Flame size={13} fill="currentColor" aria-label="Spicy" />}
    </span>
  )
}

export function MenuCard({ item, index, featured = false }: { item: MenuItem; index: number; featured?: boolean }) {
  const addToCart = useMenuStore((state) => state.addToCart)
  const unavailable = !item.isAvailable

  const add = () => {
    if (unavailable) return
    addToCart(item)
    toast.success(`${item.name} added`, { description: 'Added to your table order', icon: <Leaf size={16} /> })
  }

  return (
    <motion.article
      layout
      className={`menu-card ${featured ? 'is-featured' : ''} ${unavailable ? 'is-unavailable' : ''}`}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.055, 0.35), ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="card-media-wrap">
        <MenuImage src={item.imageUrl} alt={item.name} priority={featured} />
        <div className="card-topline">
          <DietMark veg={item.isVeg} spicy={item.isSpicy} />
          {item.isFeatured && <span className="featured-chip"><Star size={11} fill="currentColor" /> Signature</span>}
        </div>
        {unavailable && <div className="sold-out">Back tomorrow</div>}
      </div>
      <div className="card-body">
        <div className="card-heading">
          <h3><a href={`/item/${item.id}`} className="item-title-link">{item.name}</a></h3>
          <strong>{formatPrice(item.price)}</strong>
        </div>
        <p>{item.description}</p>
        <div className="card-footer">
          <div className="card-meta">
            {item.prepTime && <span><Timer size={13} /> {item.prepTime}</span>}
            {item.isGlutenFree && <span className="gf-tag">GF</span>}
          </div>
          <button className="add-button" onClick={add} disabled={unavailable} aria-label={`Add ${item.name} to order`}>
            <Plus size={17} strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </motion.article>
  )
}
