import { useEffect, useMemo, useState } from 'react'
import QRCode from 'qrcode'
import { motion } from 'framer-motion'
import { BarChart3, Bell, ChevronDown, ChevronRight, CircleHelp, Download, ExternalLink, GripVertical, ImagePlus, LayoutDashboard, LogOut, MoreHorizontal, Palette, Plus, QrCode, Search, Settings, ShoppingBag, SlidersHorizontal, Sparkles, Store, Tags, Trash2, Upload, Users, Utensils, X, Menu as MenuIcon, Check, Moon, Sun } from 'lucide-react'
import { toast } from 'sonner'
import { categories, menuItems as seedItems } from '../lib/data'
import { menuApi } from '../lib/api'
import type { Category, MenuItem } from '../lib/types'
import { formatPrice } from '../lib/utils'
import { useMenuStore } from '../lib/store'

type AdminSection = 'overview' | 'menu' | 'categories' | 'tables' | 'settings'

const navItems: { id: AdminSection; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'menu', label: 'Menu items', icon: Utensils },
  { id: 'categories', label: 'Categories', icon: Tags },
  { id: 'tables', label: 'Tables & QR', icon: QrCode },
  { id: 'settings', label: 'Settings', icon: Settings },
]

const activity = [
  { title: 'Table 08 placed an order', time: '2 min ago', color: 'gold', icon: ShoppingBag },
  { title: '“Miso glazed lamb” was viewed', time: '18 min ago', color: 'green', icon: BarChart3 },
  { title: 'You updated the Spring menu', time: 'Yesterday', color: 'blue', icon: Sparkles },
]

export default function AdminPage() {
  const [section, setSection] = useState<AdminSection>('overview')
  const [items, setItems] = useState<MenuItem[]>(seedItems)
  const [cats, setCats] = useState<Category[]>(categories.filter((category) => category.id !== 'all'))
  const [query, setQuery] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [showCategoryAdd, setShowCategoryAdd] = useState(false)
  const [mobileSidebar, setMobileSidebar] = useState(false)
  const { isDark, setDark } = useMenuStore()
  const settings = useMenuStore((state) => state.settings)

  useEffect(() => { document.title = 'Sunrise Studio dashboard'; return () => { document.title = 'Sunrise Cafe — Fresh flavors, warm sunrise ☀️' } }, [])

  const visibleItems = useMemo(() => items.filter((item) => !query || `${item.name} ${item.categoryName}`.toLowerCase().includes(query.toLowerCase())), [items, query])
  const availableCount = items.filter((item) => item.isAvailable).length
  const totalViews = items.reduce((sum, item) => sum + item.views, 0)

  const toggleItem = (id: string) => {
    const item = items.find((entry) => entry.id === id)
    const isAvailable = item ? !item.isAvailable : true
    setItems((current) => current.map((entry) => entry.id === id ? { ...entry, isAvailable } : entry))
    void menuApi.updateItem(id, { isAvailable }).catch(() => toast.error('Could not sync that change'))
    toast.success('Menu updated', { description: 'Changes are live for your guests.' })
  }
  const deleteItem = (id: string) => {
    setItems((current) => current.filter((item) => item.id !== id))
    void menuApi.deleteItem(id).catch(() => toast.error('Could not sync that deletion'))
    toast.success('Item removed', { description: 'The menu has been updated.' })
  }
  const bulkAction = (action: 'available' | 'hidden' | 'delete', ids: string[]) => {
    if (action === 'delete') setItems((current) => current.filter((item) => !ids.includes(item.id)))
    else setItems((current) => current.map((item) => ids.includes(item.id) ? { ...item, isAvailable: action === 'available' } : item))
    void menuApi.bulkItems(ids, action).catch(() => toast.error('Could not sync bulk action'))
    toast.success(`${ids.length} item${ids.length === 1 ? '' : 's'} updated`)
  }
  const moveCategory = (index: number, direction: -1 | 1) => {
    const next = index + direction
    if (next < 0 || next >= cats.length) return
    const copy = [...cats]
    ;[copy[index], copy[next]] = [copy[next], copy[index]]
    setCats(copy.map((category, order) => ({ ...category, displayOrder: order })))
    void menuApi.updateCategory(copy[index].id, { displayOrder: next }).catch(() => toast.error('Could not sync category order'))
  }
  const reorderCategories = (from: number, to: number) => {
    if (from === to || from < 0 || to < 0 || from >= cats.length || to >= cats.length) return
    const copy = [...cats]
    const [moved] = copy.splice(from, 1)
    copy.splice(to, 0, moved)
    const reordered = copy.map((category, order) => ({ ...category, displayOrder: order }))
    setCats(reordered)
    void Promise.all(reordered.map((category) => menuApi.updateCategory(category.id, { displayOrder: category.displayOrder }))).catch(() => toast.error('Could not sync category order'))
    toast.success('Category order updated', { description: 'Guests will see the new order.' })
  }
  const deleteCategory = (id: string) => {
    setCats((current) => current.filter((category) => category.id !== id).map((category, order) => ({ ...category, displayOrder: order })))
    void menuApi.deleteCategory(id).catch(() => toast.error('Could not sync category deletion'))
    toast.success('Category removed', { description: 'The section is no longer shown to guests.' })
  }
  const addItem = (item: MenuItem) => {
    setItems((current) => [item, ...current])
    void menuApi.createItem(item).catch(() => toast.error('Could not sync the new dish'))
  }
  const addCategory = (category: Category) => {
    setCats((current) => [...current, { ...category, displayOrder: current.length }])
    void menuApi.createCategory(category).catch(() => toast.error('Could not sync the new category'))
  }
  const nav = (id: AdminSection) => { setSection(id); setMobileSidebar(false) }

  return <div className="admin-shell">
    <aside className={`admin-sidebar ${mobileSidebar ? 'mobile-open' : ''}`}>
      <div className="admin-sidebar-top"><a className="admin-brand" href="/" onClick={(e) => e.preventDefault()}><div className="brand-mark"><span>☀</span></div><div><strong>{settings.name}</strong><small>Studio dashboard</small></div></a><button className="sidebar-close" onClick={() => setMobileSidebar(false)}><X size={18} /></button></div>
      <div className="admin-workspace"><span className="workspace-dot" /> <span>Bole Atlas cafe</span><ChevronDown size={13} /></div>
      <nav className="admin-nav"><span className="admin-nav-label">Workspace</span>{navItems.map(({ id, label, icon: Icon }) => <button key={id} className={section === id ? 'active' : ''} onClick={() => nav(id)}><Icon size={17} strokeWidth={section === id ? 2 : 1.7} /><span>{label}</span>{id === 'menu' && <small>{items.length}</small>}</button>)}</nav>
      <div className="admin-sidebar-bottom"><div className="sidebar-tip"><Sparkles size={15} /><div><strong>Make it yours</strong><span>Customize your digital menu</span></div><ChevronRight size={14} /></div><div className="admin-user"><div className="user-avatar">MC</div><div><strong>Maya Chen</strong><span>Administrator</span></div><MoreHorizontal size={17} /></div></div>
    </aside>
    {mobileSidebar && <button className="sidebar-overlay" onClick={() => setMobileSidebar(false)} aria-label="Close navigation" />}
    <div className="admin-main">
      <header className="admin-topbar"><button className="admin-mobile-menu" onClick={() => setMobileSidebar(true)}><MenuIcon size={20} /></button><div className="admin-breadcrumb"><span>Studio</span><ChevronRight size={13} /><b>{navItems.find((item) => item.id === section)?.label}</b></div><div className="admin-top-actions"><button className="admin-top-icon" onClick={() => setDark(!isDark)} aria-label="Toggle theme">{isDark ? <Sun size={17} /> : <Moon size={17} />}</button><button className="admin-top-icon notification" aria-label="Notifications"><Bell size={17} /><i /></button><a className="view-menu-button" href="/" target="_blank">View menu <ExternalLink size={14} /></a></div></header>
      <div className="admin-content">
        {section === 'overview' && <Overview onNavigate={nav} totalViews={totalViews} availableCount={availableCount} items={items} />}
        {section === 'menu' && <MenuManager items={visibleItems} query={query} setQuery={setQuery} onToggle={toggleItem} onDelete={deleteItem} onBulk={bulkAction} onAdd={() => setShowAdd(true)} />}
        {section === 'categories' && <CategoryManager categories={cats} onMove={moveCategory} onReorder={reorderCategories} onDelete={deleteCategory} onAdd={() => setShowCategoryAdd(true)} />}
        {section === 'tables' && <TablesManager />}
        {section === 'settings' && <SettingsPanel />}
      </div>
    </div>
    {showAdd && <AddItemModal onClose={() => setShowAdd(false)} onAdd={(item) => { addItem(item); setShowAdd(false) }} />}
    {showCategoryAdd && <AddCategoryModal onClose={() => setShowCategoryAdd(false)} onAdd={(category) => { addCategory(category); setShowCategoryAdd(false) }} />}
  </div>
}

function PageIntro({ eyebrow, title, description, action }: { eyebrow: string; title: React.ReactNode; description: string; action?: React.ReactNode }) {
  return <div className="page-intro"><div><span className="admin-eyebrow">{eyebrow}</span><h1>{title}</h1><p>{description}</p></div>{action}</div>
}

function Overview({ onNavigate, totalViews, availableCount, items }: { onNavigate: (id: AdminSection) => void; totalViews: number; availableCount: number; items: MenuItem[] }) {
  const maxViews = Math.max(...items.map((item) => item.views))
  return <>
    <PageIntro eyebrow="Wednesday, 23 September 2026" title={<>Good morning, <em>Sunrise.</em></>} description="Here’s what’s happening at Sunrise Cafe today." action={<button className="admin-primary-button" onClick={() => onNavigate('menu')}><Plus size={16} /> Add menu item</button>} />
    <div className="stats-grid"><StatCard label="Total menu items" value={items.length.toString()} delta="+3 this month" icon={<Utensils size={17} />} tone="gold" /><StatCard label="Available now" value={availableCount.toString()} delta={`${Math.round((availableCount / items.length) * 100)}% of your menu`} icon={<Check size={17} />} tone="green" /><StatCard label="Views this month" value={totalViews.toLocaleString()} delta="+18.4% vs last month" icon={<BarChart3 size={17} />} tone="blue" /><StatCard label="Active tables" value="08" delta="3 tables occupied" icon={<Store size={17} />} tone="rose" /></div>
    <div className="overview-grid"><section className="admin-panel chart-panel"><div className="panel-heading"><div><span className="admin-eyebrow">Performance</span><h2>Menu engagement</h2></div><div className="panel-actions"><button className="select-button">Last 30 days <ChevronDown size={14} /></button><button className="icon-button"><MoreHorizontal size={17} /></button></div></div><div className="chart-summary"><div><strong>2,846</strong><span>total menu views</span></div><div className="chart-legend"><span><i className="legend-dot current" /> This month</span><span><i className="legend-dot previous" /> Previous</span></div></div><div className="chart"><div className="chart-y-labels"><span>800</span><span>600</span><span>400</span><span>200</span><span>0</span></div><div className="chart-area"><div className="chart-grid-lines"><i /><i /><i /><i /><i /></div><svg viewBox="0 0 720 230" preserveAspectRatio="none" aria-label="Menu views chart"><defs><linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#d9954a" stopOpacity=".23" /><stop offset="1" stopColor="#d9954a" stopOpacity="0" /></linearGradient></defs><path d="M0,190 C28,182 39,165 65,171 C93,178 102,141 130,150 C160,160 171,124 201,136 C229,147 243,115 271,122 C301,130 315,89 343,101 C370,113 386,82 415,89 C442,97 454,67 480,76 C512,87 520,50 548,61 C574,72 592,39 618,48 C646,58 661,24 686,34 C704,42 711,25 720,22 L720,230 L0,230 Z" fill="url(#chartFill)" /><path d="M0,190 C28,182 39,165 65,171 C93,178 102,141 130,150 C160,160 171,124 201,136 C229,147 243,115 271,122 C301,130 315,89 343,101 C370,113 386,82 415,89 C442,97 454,67 480,76 C512,87 520,50 548,61 C574,72 592,39 618,48 C646,58 661,24 686,34 C704,42 711,25 720,22" fill="none" stroke="#d9954a" strokeWidth="3" strokeLinecap="round" /></svg><div className="chart-x-labels"><span>Aug 25</span><span>Sep 01</span><span>Sep 08</span><span>Sep 15</span><span>Sep 23</span></div></div></div></section><section className="admin-panel popular-panel"><div className="panel-heading"><div><span className="admin-eyebrow">What guests love</span><h2>Most viewed</h2></div><button className="text-button" onClick={() => onNavigate('menu')}>View all <ChevronRight size={14} /></button></div><div className="popular-list">{items.slice().sort((a, b) => b.views - a.views).slice(0, 4).map((item, index) => <div className="popular-item" key={item.id}><span className="popular-rank">0{index + 1}</span><div className="popular-thumb" style={{ backgroundImage: `url("${item.imageUrl}")` }} /><div className="popular-info"><strong>{item.name}</strong><span>{item.categoryName}</span></div><div className="popular-views"><BarChart3 size={13} /> {item.views}</div></div>)}</div><div className="popular-footer"><span>Top dish gets <strong>27%</strong> of all views</span><div className="mini-progress"><i style={{ width: '27%' }} /></div></div></section></div>
    <div className="overview-lower"><section className="admin-panel quick-panel"><div className="panel-heading"><div><span className="admin-eyebrow">Quick actions</span><h2>Keep things moving</h2></div></div><div className="quick-actions"><button onClick={() => onNavigate('menu')}><span className="quick-icon gold"><Plus size={17} /></span><span><strong>Add a dish</strong><small>Publish a new plate</small></span><ChevronRight size={15} /></button><button onClick={() => onNavigate('tables')}><span className="quick-icon green"><QrCode size={17} /></span><span><strong>Print QR codes</strong><small>Make table sharing easy</small></span><ChevronRight size={15} /></button><button onClick={() => onNavigate('settings')}><span className="quick-icon purple"><Palette size={17} /></span><span><strong>Customize theme</strong><small>Make it unmistakably yours</small></span><ChevronRight size={15} /></button></div></section><section className="admin-panel activity-panel"><div className="panel-heading"><div><span className="admin-eyebrow">Live feed</span><h2>Recent activity</h2></div><button className="icon-button"><MoreHorizontal size={17} /></button></div><div className="activity-list">{activity.map((event) => { const Icon = event.icon; return <div className="activity-item" key={event.title}><span className={`activity-icon ${event.color}`}><Icon size={14} /></span><div><strong>{event.title}</strong><span>{event.time}</span></div></div> })}</div></section></div>
  </>
}

function StatCard({ label, value, delta, icon, tone }: { label: string; value: string; delta: string; icon: React.ReactNode; tone: string }) { return <div className="stat-card"><div className={`stat-icon ${tone}`}>{icon}</div><span className="stat-label">{label}</span><strong>{value}</strong><small className={tone === 'blue' ? 'positive' : ''}>{delta}</small></div> }

function MenuManager({ items, query, setQuery, onToggle, onDelete, onBulk, onAdd }: { items: MenuItem[]; query: string; setQuery: (value: string) => void; onToggle: (id: string) => void; onDelete: (id: string) => void; onBulk: (action: 'available' | 'hidden' | 'delete', ids: string[]) => void; onAdd: () => void }) {
  const [selected, setSelected] = useState<string[]>([])
  const allSelected = items.length > 0 && items.every((item) => selected.includes(item.id))
  const toggleSelected = (id: string) => setSelected((current) => current.includes(id) ? current.filter((value) => value !== id) : [...current, id])
  const runBulk = (action: 'available' | 'hidden' | 'delete') => { onBulk(action, selected); setSelected([]) }
  return <><PageIntro eyebrow="Content management" title={<>Your <em>menu.</em></>} description="Keep your menu fresh, beautiful and in sync with the kitchen." action={<button className="admin-primary-button" onClick={onAdd}><Plus size={16} /> Add item</button>} />{selected.length > 0 && <div className="bulk-toolbar"><span><strong>{selected.length}</strong> selected</span><div><button onClick={() => runBulk('available')}>Make available</button><button onClick={() => runBulk('hidden')}>Hide</button><button className="danger" onClick={() => runBulk('delete')}><Trash2 size={13} /> Delete</button><button onClick={() => setSelected([])} aria-label="Clear selection"><X size={14} /></button></div></div>}<div className="table-toolbar"><div className="admin-search"><Search size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search your menu…" /></div><div className="toolbar-actions"><button className="outline-admin-button"><SlidersHorizontal size={15} /> Filter <ChevronDown size={13} /></button><button className="outline-admin-button"><Download size={15} /> Export</button></div></div><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th className="select-column"><input type="checkbox" aria-label="Select all menu items" checked={allSelected} onChange={() => setSelected(allSelected ? [] : items.map((item) => item.id))} /></th><th>Item</th><th>Category</th><th>Price</th><th>Views</th><th>Availability</th><th /></tr></thead><tbody>{items.map((item) => <tr key={item.id} className={selected.includes(item.id) ? 'selected-row' : ''}><td className="select-column"><input type="checkbox" aria-label={`Select ${item.name}`} checked={selected.includes(item.id)} onChange={() => toggleSelected(item.id)} /></td><td><div className="table-item"><div className="table-thumb" style={{ backgroundImage: `url("${item.imageUrl}")` }} /><div><strong>{item.name}</strong><span>{item.isFeatured ? 'Signature dish' : item.tags[0] ?? 'Menu item'}</span></div></div></td><td><span className="category-chip">{item.categoryName}</span></td><td><strong>{formatPrice(item.price)}</strong></td><td><span className="views-cell"><BarChart3 size={13} />{item.views}</span></td><td><button className={`availability-toggle ${item.isAvailable ? 'on' : ''}`} onClick={() => onToggle(item.id)} aria-label={`Toggle ${item.name} availability`}><i /></button><span className="availability-label">{item.isAvailable ? 'Available' : 'Hidden'}</span></td><td><button className="row-more" onClick={() => onDelete(item.id)} aria-label={`Delete ${item.name}`}><Trash2 size={15} /></button></td></tr>)}</tbody></table>{!items.length && <div className="table-empty"><Search size={25} /><strong>No dishes found</strong><span>Try a different search term.</span></div>}</div><div className="table-footer"><span>Showing <strong>{items.length}</strong> menu items</span><span><button disabled>←</button><b>1</b><button disabled>→</button></span></div></>
}

function CategoryManager({ categories: list, onMove, onReorder, onDelete, onAdd }: { categories: Category[]; onMove: (index: number, direction: -1 | 1) => void; onReorder: (from: number, to: number) => void; onDelete: (id: string) => void; onAdd: () => void }) {
  const [dragged, setDragged] = useState<number | null>(null)
  return <><PageIntro eyebrow="Menu structure" title={<>The <em>order</em> of things.</>} description="Arrange your menu so guests find exactly what they’re looking for." action={<button className="admin-primary-button" onClick={onAdd}><Plus size={16} /> New category</button>} /><div className="category-admin-layout"><section className="admin-panel category-list-panel"><div className="panel-heading"><div><span className="admin-eyebrow">{list.length} categories</span><h2>Menu sections</h2></div><button className="icon-button"><MoreHorizontal size={17} /></button></div><div className="sortable-categories">{list.map((category, index) => <div className={`sortable-category ${dragged === index ? 'is-dragging' : ''}`} key={category.id} draggable onDragStart={() => setDragged(index)} onDragOver={(event) => event.preventDefault()} onDrop={() => { if (dragged !== null) onReorder(dragged, index); setDragged(null) }} onDragEnd={() => setDragged(null)}><GripVertical size={17} className="drag-handle" /><span className="admin-category-icon">{category.icon}</span><div><strong>{category.name}</strong><span>/{category.slug}</span></div><span className="category-count">{seedItems.filter((item) => item.categoryId === category.id).length} items</span><span className="active-label"><i /> Active</span><div className="sort-actions"><button onClick={() => onMove(index, -1)} aria-label="Move category up">↑</button><button onClick={() => onMove(index, 1)} aria-label="Move category down">↓</button><button className="delete-category" onClick={() => onDelete(category.id)} aria-label={`Delete ${category.name}`}><Trash2 size={12} /></button></div></div>)}</div><button className="add-dashed" onClick={onAdd}><Plus size={16} /> Add a new section</button></section><section className="admin-panel category-preview"><div className="panel-heading"><div><span className="admin-eyebrow">Guest preview</span><h2>Live menu order</h2></div><span className="live-pill"><i /> Live</span></div><div className="mini-menu-preview"><div className="mini-preview-head"><span>SAFFRON & STONE</span><span>Menu</span></div>{list.map((category, index) => <div className="mini-preview-row" key={category.id}><span className="mini-number">0{index + 1}</span><span>{category.icon} {category.name}</span><ChevronRight size={14} /></div>)}</div><div className="preview-note"><Sparkles size={14} /> Changes appear instantly for guests.</div></section></div></>
}

function TablesManager() {
  const [selected, setSelected] = useState('01')
  const [copied, setCopied] = useState(false)
  const [qrImage, setQrImage] = useState('')
  useEffect(() => {
    const url = `${window.location.origin}/?table=${selected}`
    void QRCode.toDataURL(url, { width: 240, margin: 1, color: { dark: '#343b32', light: '#faf9f4' } }).then(setQrImage)
  }, [selected])
  const copy = async () => { await navigator.clipboard?.writeText(`${window.location.origin}/?table=${selected}`); setCopied(true); toast.success(`Table ${selected} link copied`); window.setTimeout(() => setCopied(false), 1800) }
  return <><PageIntro eyebrow="Guest experience" title={<>Every table,<br /><em>their story.</em></>} description="Give guests a direct path to your menu with a unique QR code for every table." action={<button className="admin-primary-button" onClick={() => { if (!qrImage) return; const link = document.createElement('a'); link.href = qrImage; link.download = `sunrise-table-${selected}.png`; link.click(); toast.success(`Table ${selected} QR downloaded`) }}><Download size={16} /> Download QR code</button>} /><div className="tables-layout"><section className="admin-panel table-list-panel"><div className="panel-heading"><div><span className="admin-eyebrow">8 active tables</span><h2>Dining room</h2></div><button className="outline-admin-button"><Plus size={15} /> Add table</button></div><div className="room-grid">{Array.from({ length: 12 }, (_, i) => { const id = String(i + 1).padStart(2, '0'); return <button className={`room-card ${selected === id ? 'selected' : ''}`} key={id} onClick={() => setSelected(id)}><span className="room-number">{id}</span><span className={`room-status ${i < 8 ? 'occupied' : ''}`}>{i < 8 ? 'Occupied' : 'Available'}</span></button> })}</div></section><section className="admin-panel qr-panel"><div className="panel-heading"><div><span className="admin-eyebrow">Table {selected}</span><h2>Guest menu link</h2></div><span className="live-pill"><i /> Ready</span></div><div className="qr-display">{qrImage ? <img className="real-qr" src={qrImage} alt={`QR code for table ${selected}`} /> : <div className="fake-qr"><span className="qr-corner a" /><span className="qr-corner b" /><span className="qr-corner c" /><span className="qr-center">☀</span>{Array.from({ length: 36 }, (_, i) => <i key={i} style={{ opacity: ((i * 7) % 5) / 8 + .3 }} />)}</div>}<strong>Scan to view the menu</strong><span>Works on any phone. No app required.</span></div><div className="link-copy"><span>sunrisecafe.et/table/{selected}</span><button onClick={copy}>{copied ? <Check size={15} /> : <Download size={15} />} {copied ? 'Copied' : 'Copy link'}</button></div><button className="admin-primary-button full-width" onClick={() => window.open(`/?table=${selected}`, '_blank')}>Preview guest view <ExternalLink size={15} /></button></section></div></>
}

function SettingsPanel() {
  const { isDark, setDark, accentColor, setAccentColor, settings, setSettings } = useMenuStore()
  const [accent, setAccent] = useState(accentColor)
  const [form, setForm] = useState(settings)
  const [saved, setSaved] = useState(false)
  return <><PageIntro eyebrow="Studio settings" title={<>Make it <em>yours.</em></>} description="A few details that make this space feel like your space." action={<button className="admin-primary-button" onClick={() => { setSettings({ ...form, primaryColor: accent }); setAccentColor(accent); void menuApi.updateSettings({ ...form, primaryColor: accent }).catch(() => toast.error('Could not sync settings')); setSaved(true); toast.success('Settings saved', { description: 'Your menu is looking good.' }); window.setTimeout(() => setSaved(false), 1800) }}>{saved ? <Check size={16} /> : <Sparkles size={16} />} {saved ? 'Saved' : 'Save changes'}</button>} /><div className="settings-layout"><section className="admin-panel settings-form"><div className="panel-heading"><div><span className="admin-eyebrow">Restaurant profile</span><h2>Public details</h2></div></div><div className="settings-fields"><label>Restaurant name<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label><label>Tagline<input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} /></label><label>Address<input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></label><label>Phone<input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label><label>Contact email<input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" /></label></div><div className="settings-divider" /><div className="panel-heading"><div><span className="admin-eyebrow">Appearance</span><h2>Visual identity</h2></div></div><div className="appearance-row"><div className="logo-upload"><div className="brand-mark"><span>S</span><i>&</i><span>S</span></div><span><strong>Logo mark</strong><small>PNG or SVG · 2MB max</small></span><label className="outline-admin-button upload-label"> <Upload size={14} /> Replace<input type="file" accept="image/png,image/svg+xml,image/jpeg" onChange={(event) => { const file = event.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => setForm((current) => ({ ...current, logo: String(reader.result) })); reader.readAsDataURL(file) }} /></label></div><div className="color-field"><span><strong>Accent color</strong><small>Used across your menu</small></span><label><input type="color" value={accent} onChange={(e) => { setAccent(e.target.value); setAccentColor(e.target.value) }} /><code>{accent}</code></label></div><div className="theme-choice"><span><strong>Default mode</strong><small>What guests see first</small></span><div className="theme-buttons"><button className={!isDark ? 'active' : ''} onClick={() => setDark(false)}><Sun size={14} /> Light</button><button className={isDark ? 'active' : ''} onClick={() => setDark(true)}><Moon size={14} /> Dark</button><button><Settings size={14} /> System</button></div></div></div></section><aside className="settings-side"><div className="admin-panel support-card"><div className="support-icon"><CircleHelp size={18} /></div><h3>Need a hand?</h3><p>Our little team is here if you need a second pair of hands.</p><button className="underlined-link">Visit help center <ChevronRight size={14} /></button></div><div className="admin-panel danger-card"><div><span className="admin-eyebrow">Danger zone</span><h3>Sign out everywhere</h3><p>End all active admin sessions on your devices.</p></div><button className="outline-admin-button"><LogOut size={14} /> Sign out</button></div></aside></div></>
}

function AddItemModal({ onClose, onAdd }: { onClose: () => void; onAdd: (item: MenuItem) => void }) {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('320')
  const [categoryId, setCategoryId] = useState('chickens')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=82')
  const [isVeg, setIsVeg] = useState(true)
  const [isSpicy, setIsSpicy] = useState(false)
  const [isGlutenFree, setIsGlutenFree] = useState(false)
  const [isFeatured, setIsFeatured] = useState(false)
  const submit = (event: React.FormEvent) => { event.preventDefault(); const category = categories.find((item) => item.id === categoryId)!; onAdd({ id: `new-${Date.now()}`, name, description: description || 'A new seasonal plate from the kitchen.', price: Number(price), imageUrl, categoryId, categoryName: category.name, categorySlug: category.slug, isVeg, isSpicy, isGlutenFree, isAvailable: true, isFeatured, views: 0, tags: [isVeg ? 'vegetarian' : 'non-vegetarian', ...(isSpicy ? ['spicy'] : []), ...(isGlutenFree ? ['gluten-free'] : [])] }); toast.success('New dish added', { description: 'It’s now live on your menu.' }) }
  return <><button className="modal-backdrop" aria-label="Close add item" onClick={onClose} /><motion.form className="admin-modal" onSubmit={submit} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}><div className="modal-heading"><div><span className="admin-eyebrow">New menu item</span><h2>Add a dish</h2></div><button type="button" className="icon-button" onClick={onClose}><X size={18} /></button></div><label>Dish name<input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Roasted carrots" required /></label><label>Description<textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What makes it special?" rows={3} /></label><div className="two-fields"><label>Price (ETB)<input type="number" min="1" value={price} onChange={(e) => setPrice(e.target.value)} required /></label><label>Category<select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>{categories.filter((c) => c.id !== 'all').map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label></div><div className="form-toggles"><label><input type="checkbox" checked={isVeg} onChange={(e) => setIsVeg(e.target.checked)} /> Vegetarian</label><label><input type="checkbox" checked={isSpicy} onChange={(e) => setIsSpicy(e.target.checked)} /> Spicy</label><label><input type="checkbox" checked={isGlutenFree} onChange={(e) => setIsGlutenFree(e.target.checked)} /> Gluten-free</label><label><input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} /> Signature</label></div><div className="upload-field"><ImagePlus size={18} /><span><strong>Add a dish photo</strong><small>Drop an image here or browse · JPG, PNG</small></span><label className="outline-admin-button upload-label">Browse<input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => { const file = event.target.files?.[0]; if (file) setImageUrl(URL.createObjectURL(file)) }} /></label></div><div className="modal-actions"><button type="button" className="outline-admin-button" onClick={onClose}>Cancel</button><button className="admin-primary-button" type="submit">Publish dish <ChevronRight size={15} /></button></div></motion.form></>
}

function AddCategoryModal({ onClose, onAdd }: { onClose: () => void; onAdd: (category: Category) => void }) {
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('✦')
  const [slug, setSlug] = useState('')
  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    const cleanSlug = (slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')).trim()
    onAdd({ id: `category-${Date.now()}`, name, slug: cleanSlug, icon, displayOrder: 0, isActive: true })
    toast.success('Category created', { description: 'The new section is ready for dishes.' })
  }
  return <><button className="modal-backdrop" aria-label="Close add category" onClick={onClose} /><motion.form className="admin-modal category-modal" onSubmit={submit} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}><div className="modal-heading"><div><span className="admin-eyebrow">New menu section</span><h2>Add a category</h2></div><button type="button" className="icon-button" onClick={onClose}><X size={18} /></button></div><label>Category name<input autoFocus value={name} onChange={(e) => { setName(e.target.value); if (!slug) setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-')) }} placeholder="e.g. Weekend brunch" required /></label><div className="two-fields"><label>URL slug<input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="weekend-brunch" required /></label><label>Icon<span className="icon-input"><input value={icon} onChange={(e) => setIcon(e.target.value)} maxLength={2} /><small>Emoji or symbol</small></span></label></div><div className="modal-actions"><button type="button" className="outline-admin-button" onClick={onClose}>Cancel</button><button className="admin-primary-button" type="submit">Create category <ChevronRight size={15} /></button></div></motion.form></>
}
