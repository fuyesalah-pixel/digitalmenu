import { useState } from 'react'
import { ArrowUpRight, ChevronDown, Instagram, Mail, MapPin, Phone, Utensils } from 'lucide-react'
import { CAFE_INFO } from '../../lib/data'
import { useMenuStore } from '../../lib/store'

export function Footer() {
  const setLoginOpen = useMenuStore((state) => state.setLoginOpen)
  const { settings, language, setLanguage } = useMenuStore()
  const [open, setOpen] = useState(false)
  const year = new Date().getFullYear()

  return <footer className="site-footer">
    <div className="footer-main">
      <div className="footer-brand">
        <div className="brand-mark light">{settings.logo?.startsWith('data:') || settings.logo?.startsWith('http') ? <img src={settings.logo} alt="" /> : <span>☀</span>}</div>
        <p className="footer-tagline">{settings.tagline}</p>
        <a className="footer-social" href="https://instagram.com" target="_blank" rel="noreferrer"><Instagram size={15} /> {CAFE_INFO.social.instagram} <ArrowUpRight size={13} /></a>
      </div>
      <div className="footer-column"><span className="footer-label">Visit us</span><a href="#visit"><MapPin size={14} /> {settings.address}</a><a href={CAFE_INFO.phoneLink}><Phone size={14} /> {settings.phone}</a><a href={`mailto:${settings.email}`}><Mail size={14} /> Say hello</a></div>
      <div className="footer-column"><span className="footer-label">Hours</span><p>{CAFE_INFO.hours}</p><span className="open-now"><i /> Open every day</span><a href="https://facebook.com" target="_blank" rel="noreferrer">Facebook · {CAFE_INFO.social.facebook} <ArrowUpRight size={12} /></a><a href="https://tiktok.com" target="_blank" rel="noreferrer">TikTok · {CAFE_INFO.social.tiktok} <ArrowUpRight size={12} /></a></div>
      <div className="footer-column footer-admin-column"><span className="footer-label">Staff access</span><p>Manage your menu, tables<br />and the details.</p><button className="footer-admin-button" onClick={() => setLoginOpen(true)}><Utensils size={15} /> Admin login <ArrowUpRight size={14} /></button></div>
    </div>
    <div className="footer-bottom"><span>© {year} {settings.name}. All rights reserved.</span><span className="powered">Powered by <b>sunrise / studio</b></span><div className="footer-legal"><a href="#privacy">Privacy</a><a href="#accessibility">Accessibility</a><button onClick={() => { setOpen(!open); setLanguage(language === 'EN' ? 'HI' : 'EN') }} aria-expanded={open}>{language === 'EN' ? 'English' : 'हिन्दी'} <ChevronDown size={13} className={open ? 'rotate' : ''} /></button></div></div>
  </footer>
}
