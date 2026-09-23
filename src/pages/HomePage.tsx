import { useEffect, useMemo, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown, ArrowRight, Check, Clock3, Leaf, MapPin, Play, Search, SlidersHorizontal, Sparkles, Star, X } from 'lucide-react'
import { toast } from 'sonner'
import { categories, menuItems, testimonials } from '../lib/data'
import { menuApi } from '../lib/api'
import { useMenuStore } from '../lib/store'
import { copy } from '../lib/i18n'
import { formatPrice } from '../lib/utils'
import { CategoryTabs } from '../components/menu/CategoryTabs'
import { MenuCard } from '../components/menu/MenuCard'
import { MenuImage } from '../components/menu/MenuImage'
import { MenuSkeleton } from '../components/menu/LoadingState'
import { CartDrawer } from '../components/menu/CartDrawer'
import { LoginModal } from '../components/menu/LoginModal'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { InstallPrompt } from '../components/layout/InstallPrompt'

const heroImage = 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1500&q=88'
const storyImage = 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=85'

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [vegetarianOnly, setVegetarianOnly] = useState(false)
  const [spicyOnly, setSpicyOnly] = useState(false)
  const [maxPrice, setMaxPrice] = useState(1200)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const { data: menuData } = useQuery({ queryKey: ['menu'], queryFn: menuApi.getMenu, staleTime: 5 * 60 * 1000 })
  const activeCategories = menuData?.categories
    ? [{ id: 'all', name: 'All dishes', slug: 'all', icon: '✦', displayOrder: 0, isActive: true }, ...menuData.categories]
    : categories
  const activeItems = menuData?.items ?? menuItems
  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.15])
  const setLoginOpen = useMenuStore((state) => state.setLoginOpen)
  const setSettings = useMenuStore((state) => state.setSettings)
  const setAccentColor = useMenuStore((state) => state.setAccentColor)
  const language = useMenuStore((state) => state.language)
  const t = copy[language]

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 480)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (menuData?.restaurant) {
      setSettings(menuData.restaurant)
      if (menuData.restaurant.primaryColor) setAccentColor(menuData.restaurant.primaryColor)
    }
  }, [menuData?.restaurant, setAccentColor, setSettings])

  useEffect(() => {
    document.documentElement.lang = language === 'HI' ? 'hi' : 'en'
    document.documentElement.dir = 'ltr'
  }, [language])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('login') === '1') setLoginOpen(true)
    const category = params.get('category')
    if (category && activeCategories.some((item) => item.slug === category)) setActiveCategory(category)
    const query = params.get('q')
    if (query) setSearch(query)
  }, [])

  const filteredItems = useMemo(() => activeItems.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.categorySlug === activeCategory
    const query = search.toLowerCase().trim()
    const matchesSearch = !query || `${item.name} ${item.description} ${item.categoryName}`.toLowerCase().includes(query)
    return matchesCategory && matchesSearch && (!vegetarianOnly || item.isVeg) && (!spicyOnly || item.isSpicy) && item.price <= maxPrice
  }), [activeCategory, search, vegetarianOnly, spicyOnly, maxPrice, activeItems])

  const groupedItems = useMemo(() => {
    if (activeCategory !== 'all') {
      const category = activeCategories.find((item) => item.slug === activeCategory)
      return category ? [{ category, items: filteredItems }] : []
    }
    return activeCategories.filter((category) => category.slug !== 'all').map((category) => ({ category, items: filteredItems.filter((item) => item.categoryId === category.id) })).filter((group) => group.items.length)
  }, [activeCategory, activeCategories, filteredItems])

  const chooseCategory = (slug: string) => {
    setActiveCategory(slug)
    const params = new URLSearchParams(window.location.search)
    if (slug === 'all') params.delete('category')
    else params.set('category', slug)
    window.history.replaceState({}, '', `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`)
    if (slug !== 'all') {
      window.setTimeout(() => document.getElementById(`category-${slug}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
    }
  }

  return <div id="top" className="site-shell">
    <Header />
    <main>
      <section className="hero-section" ref={heroRef}>
        <motion.div className="hero-copy" style={{ y: heroY, opacity: heroOpacity }}>
          <div className="hero-kicker"><span className="kicker-line" /> <span>Est. 2024 <i>·</i> Bole Atlas, Addis Ababa</span><span className="kicker-line" /></div>
          <h1>{language === 'HI' ? 'ताज़गी भरपूर,' : 'Fresh flavors,'}<br /><em>{language === 'HI' ? 'गर्म' : 'warm'}</em><br />{language === 'HI' ? 'सुबह का आनंद।' : 'sunrise.'}</h1>
          <p className="hero-description">A neighborhood table in Bole Atlas, serving fresh Ethiopian favorites, comfort classics and a little something sweet.</p>
          <div className="hero-ctas"><button className="primary-button" onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}>{t.explore} <ArrowRight size={17} /></button><button className="play-button" onClick={() => document.getElementById('story')?.scrollIntoView({ behavior: 'smooth' })}><span><Play size={12} fill="currentColor" /></span> {t.story}</button></div>
          <div className="hero-footnote"><span><Leaf size={14} /> Fresh, local, generous</span><span><Star size={13} fill="currentColor" /> 4.9 from our guests</span></div>
        </motion.div>
        <motion.div className="hero-visual" style={{ y: heroY }}>
          <div className="hero-image-frame"><MenuImage src={heroImage} alt="A fresh dish at Sunrise Cafe" priority /></div>
          <div className="hero-image-caption"><span>01</span><span>{t.seasonal}</span><ArrowDown size={15} /></div>
          <motion.div className="hero-floating-card" initial={{ opacity: 0, x: 25, y: 15 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ delay: 0.8, duration: 0.7 }}><div className="floating-card-top"><span>Sunrise favorite</span><span className="floating-star">✦</span></div><strong>Ethiopian Coffee</strong><small>Hot Drinks · 60 ETB</small></motion.div>
          <div className="hero-stamp"><Sparkles size={15} /><span>made<br />with care</span></div>
        </motion.div>
        <div className="hero-scroll"><span>{t.scroll}</span><div className="scroll-track"><i /></div></div>
      </section>

      <section className="marquee-band" aria-label="Restaurant values"><div className="marquee-track"><span>Good ingredients</span><i>✦</i><span>Warm hospitality</span><i>✦</i><span>Nothing rushed</span><i>✦</i><span>Good ingredients</span><i>✦</i><span>Warm hospitality</span><i>✦</i><span>Nothing rushed</span><i>✦</i></div></section>

      <section className="menu-section" id="menu">
        <div className="section-heading menu-heading"><div><span className="eyebrow">The good part</span><h2>{t.menu} <em>{t.table}</em></h2></div><div className="heading-aside"><span>From first coffee<br />to last sip.</span><a href="#visit" className="circle-link" aria-label="Visit us"><ArrowRight size={17} /></a></div></div>
        <div className="menu-tools"><div className="search-box"><Search size={17} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search dishes, ingredients…" aria-label="Search menu" />{search && <button onClick={() => setSearch('')} aria-label="Clear search"><X size={15} /></button>}</div><div className="tool-actions"><button className={`filter-toggle ${showFilters ? 'active' : ''}`} onClick={() => setShowFilters(!showFilters)}><SlidersHorizontal size={15} /> Filters{(vegetarianOnly || spicyOnly || maxPrice < 1200) && <i />}</button><div className="view-toggle" role="group" aria-label="Menu layout"><button className={viewMode === 'grid' ? 'active' : ''} onClick={() => setViewMode('grid')} aria-label="Grid view"><span className="grid-icon">⊞</span></button><button className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')} aria-label="List view"><span className="list-icon">☷</span></button></div></div></div>
        {showFilters && <motion.div className="filter-panel" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}><div className="filter-panel-inner"><div><span className="filter-title">Dietary</span><label className="check-row"><input type="checkbox" checked={vegetarianOnly} onChange={(e) => setVegetarianOnly(e.target.checked)} /><span className="fake-check"><Check size={12} /></span> Vegetarian only</label><label className="check-row"><input type="checkbox" checked={spicyOnly} onChange={(e) => setSpicyOnly(e.target.checked)} /><span className="fake-check"><Check size={12} /></span> Bring the heat</label></div><div className="price-filter"><span className="filter-title">Price up to <b>{formatPrice(maxPrice)}</b></span><input type="range" min="30" max="1200" step="10" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} /><div className="range-labels"><span>30 ETB</span><span>1,200+ ETB</span></div></div><button className="clear-filters" onClick={() => { setVegetarianOnly(false); setSpicyOnly(false); setMaxPrice(1200); setSearch('') }}>Clear all</button></div></motion.div>}
        <CategoryTabs categories={activeCategories} active={activeCategory} onChange={chooseCategory} itemCount={activeItems.length} onFilter={() => setShowFilters(!showFilters)} />
        {isLoading ? <MenuSkeleton /> : filteredItems.length === 0 ? <div className="no-results"><span>⌕</span><h3>Nothing matched that.</h3><p>Try a different search or clear your filters.</p><button className="secondary-button" onClick={() => { setSearch(''); setVegetarianOnly(false); setSpicyOnly(false); setMaxPrice(1200) }}>Show everything</button></div> : <div className={`menu-groups ${viewMode === 'list' ? 'list-view' : ''}`}>{groupedItems.map((group, groupIndex) => <section className="menu-group" id={`category-${group.category.slug}`} key={group.category.id}><div className="group-heading"><div className="group-title"><span className="group-icon">{group.category.icon}</span><h3>{group.category.name}</h3><span className="group-count">{group.items.length.toString().padStart(2, '0')}</span></div><span className="group-rule" /></div><div className="menu-grid">{group.items.map((item, index) => <MenuCard key={item.id} item={item} index={index} featured={item.isFeatured} />)}</div></section>)}</div>}
        <div className="menu-bottom-note"><span className="note-rule" /><span>Ask us about allergens — we’re happy to guide you.</span><span className="note-rule" /></div>
      </section>

      <section className="story-section" id="story"><div className="story-image-wrap"><MenuImage src={storyImage} alt="The dining room at Sunrise Cafe" /><div className="story-image-label"><span>02 / 03</span><span>Our room</span></div></div><div className="story-copy"><span className="eyebrow">A little about us</span><h2>Come for the<br /><em>good energy.</em></h2><p>Sunrise Cafe is a neighborhood table in Bole Atlas — a place for strong coffee, generous plates and the flavors that make Addis feel like home.</p><p>Come early for breakfast, stay for lunch, or meet friends over something cold and sweet.</p><a className="underlined-link" href="#visit">Meet Sunrise Cafe <ArrowRight size={16} /></a><div className="quote-block"><span className="quote-mark">“</span><p>{testimonials[0].quote}</p><small>{testimonials[0].author}</small></div></div></section>

      <section className="visit-section" id="visit"><div className="visit-copy"><span className="eyebrow">Come by</span><h2>Meet us in<br /><em>Bole Atlas.</em></h2><p>Our doors are open every day for breakfast, lunch, coffee and something sweet.</p><div className="visit-details"><div><MapPin size={17} /><span><b>Bole Atlas</b><br />Addis Ababa, Ethiopia</span></div><div><Clock3 size={17} /><span><b>Mon–Sun · 7:00 AM — 11:00 PM</b><br />Kitchen closes 10:30 PM</span></div></div><button className="primary-button" onClick={() => toast.success('Reservation request noted', { description: 'We’ll be in touch shortly.' })}>Request a table <ArrowRight size={17} /></button></div><div className="visit-card"><div className="visit-card-top"><span>Find your way</span><span>✦</span></div><div className="map-pattern"><span className="map-road road-one" /><span className="map-road road-two" /><span className="map-road road-three" /><span className="map-pin"><MapPin size={19} fill="currentColor" /></span><span className="map-label">☀</span></div><div className="visit-card-bottom"><span>Bole Atlas, Addis Ababa</span><a href="https://maps.google.com" target="_blank" rel="noreferrer">Open in maps <ArrowUpRightIcon /></a></div></div></section>

      <section className="newsletter-section"><div><span className="eyebrow">A note from the kitchen</span><h2>Good things,<br /><em>occasionally.</em></h2></div><form onSubmit={(e) => { e.preventDefault(); toast.success('You’re on the list', { description: 'A little goodness is headed your way.' }); (e.currentTarget as HTMLFormElement).reset() }}><label htmlFor="email">Join our table for new menus, events and occasional notes.</label><div className="newsletter-input"><input id="email" type="email" placeholder="Your email address" required /><button type="submit" aria-label="Subscribe"><ArrowRight size={18} /></button></div><small>No noise. Unsubscribe anytime.</small></form></section>
    </main>
    <Footer />
    <InstallPrompt />
    <CartDrawer />
    <LoginModal />
  </div>
}

function ArrowUpRightIcon() { return <span className="arrow-up-right">↗</span> }
