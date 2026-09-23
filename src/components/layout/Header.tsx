import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Globe2, Menu as MenuIcon, Moon, ShoppingBag, Sun, X } from 'lucide-react'
import { useMenuStore } from '../../lib/store'

export function Header() {
  const { cart, isDark, setDark, setCartOpen, language, setLanguage, settings } = useMenuStore()
  const [mobileOpen, setMobileOpen] = useState(false)
  const count = cart.reduce((sum, line) => sum + line.quantity, 0)

  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMobileOpen(false)
  }

  return <header className="site-header">
    <div className="header-inner">
      <a className="brand" href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
        <div className="brand-mark">{settings.logo?.startsWith('data:') || settings.logo?.startsWith('http') ? <img src={settings.logo} alt="" /> : <span>☀</span>}</div>
        <div className="brand-copy"><strong>{settings.name}</strong><small>{settings.tagline}</small></div>
      </a>
      <nav className="desktop-nav" aria-label="Main navigation">
        <a href="#menu">The menu</a><a href="#story">Our story</a><a href="#visit">Visit us</a>
      </nav>
      <div className="header-actions">
        <button className="header-icon-button language-button" onClick={() => setLanguage(language === 'EN' ? 'HI' : 'EN')} aria-label="Change language"><Globe2 size={16} /><span>{language}</span></button>
        <button className="header-icon-button theme-toggle" onClick={() => setDark(!isDark)} aria-label={isDark ? 'Use light theme' : 'Use dark theme'}>{isDark ? <Sun size={17} /> : <Moon size={17} />}</button>
        <motion.button className="order-button" onClick={() => setCartOpen(true)} animate={count > 0 ? { scale: [1, 1.045, 1] } : { scale: 1 }} transition={{ duration: .35 }}><ShoppingBag size={16} /><span>Your order</span>{count > 0 && <b>{count}</b>}</motion.button>
        <button className="mobile-menu-button" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">{mobileOpen ? <X size={21} /> : <MenuIcon size={21} />}</button>
      </div>
    </div>
    <AnimatePresence>{mobileOpen && <motion.nav className="mobile-nav" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
      <a href="#menu" onClick={() => setMobileOpen(false)}>The menu <ArrowRight size={16} /></a><a href="#story" onClick={() => setMobileOpen(false)}>Our story <ArrowRight size={16} /></a><a href="#visit" onClick={() => setMobileOpen(false)}>Visit us <ArrowRight size={16} /></a>
    </motion.nav>}</AnimatePresence>
  </header>
}
