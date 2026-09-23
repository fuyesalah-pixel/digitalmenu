import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, Flame, Leaf, Plus, Share2, Star, Timer } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { menuItems } from '../lib/data'
import { menuApi } from '../lib/api'
import { useMenuStore } from '../lib/store'
import { formatPrice } from '../lib/utils'
import { MenuImage } from '../components/menu/MenuImage'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { CartDrawer } from '../components/menu/CartDrawer'

export default function ItemPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { data: menuData } = useQuery({ queryKey: ['menu'], queryFn: menuApi.getMenu, staleTime: 5 * 60 * 1000 })
  const availableItems = menuData?.items ?? menuItems
  const item = availableItems.find((dish) => dish.id === slug || dish.categorySlug === slug) ?? availableItems[0] ?? menuItems[0]
  const addToCart = useMenuStore((state) => state.addToCart)
  useEffect(() => { document.title = `${item.name} — Sunrise Cafe`; void menuApi.trackView(item.id); return () => { document.title = 'Sunrise Cafe — Fresh flavors, warm sunrise ☀️' } }, [item.id, item.name])
  const related = availableItems.filter((dish) => dish.categoryId === item.categoryId && dish.id !== item.id).slice(0, 3)
  return <div className="site-shell item-page"><Header /><main className="item-detail-wrap"><button className="back-link" onClick={() => navigate(-1)}><ArrowLeft size={16} /> Back to menu</button><div className="item-detail-grid"><motion.div className="item-detail-image" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}><MenuImage src={item.imageUrl} alt={item.name} priority /><div className="item-image-stamp">☀<br /><span>sunrise</span></div></motion.div><motion.div className="item-detail-copy" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .1 }}><span className="eyebrow">{item.categoryName} · from the kitchen</span><h1>{item.name}<em>.</em></h1><p className="item-detail-description">{item.description}</p><div className="detail-price">{formatPrice(item.price)} <span>per serving</span></div><div className="detail-rule" /><div className="detail-facts"><span><Timer size={16} /><b>{item.prepTime}</b><small>Preparation</small></span><span><Leaf size={16} /><b>{item.isVeg ? 'Vegetarian' : 'Chef’s craft'}</b><small>{item.isGlutenFree ? 'Gluten free' : 'Seasonal plate'}</small></span><span><Flame size={16} /><b>{item.isSpicy ? 'A little heat' : 'Comforting'}</b><small>Flavor profile</small></span></div><button className="primary-button detail-add" onClick={() => { addToCart(item); toast.success(`${item.name} added to your order`) }} disabled={!item.isAvailable}><Plus size={17} /> {item.isAvailable ? 'Add to your order' : 'Currently unavailable'}</button><button className="share-item" onClick={async () => { await navigator.clipboard?.writeText(window.location.href); toast.success('Dish link copied') }}><Share2 size={15} /> Share this dish</button></motion.div></div>{related.length > 0 && <section className="related-section"><div className="section-heading"><div><span className="eyebrow">Keep exploring</span><h2>More from <em>{item.categoryName.toLowerCase()}.</em></h2></div><button className="underlined-link" onClick={() => navigate('/')}>See full menu <ArrowRight size={15} /></button></div><div className="related-grid">{related.map((dish) => <button className="related-card" key={dish.id} onClick={() => navigate(`/item/${dish.id}`)}><MenuImage src={dish.imageUrl} alt={dish.name} /><span><strong>{dish.name}</strong><small>{formatPrice(dish.price)}</small></span><ArrowRight size={15} /></button>)}</div></section>}</main><Footer /><CartDrawer /></div>
}
