import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronRight, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react'
import { toast } from 'sonner'
import { useMenuStore } from '../../lib/store'
import { formatPrice } from '../../lib/utils'

export function CartDrawer() {
  const { cart, isCartOpen, setCartOpen, updateQuantity, clearCart, settings } = useMenuStore()
  const subtotal = cart.reduce((sum, line) => sum + line.price * line.quantity, 0)
  const service = 0
  const total = subtotal + service

  const sendOrder = () => {
    if (!cart.length) return
    const message = `Hello ${settings.name}! I would like to order:\n\n${cart.map((line) => `• ${line.quantity} × ${line.name} — ${formatPrice(line.price * line.quantity)}`).join('\n')}\n\nSubtotal: ${formatPrice(subtotal)}\nService: ${formatPrice(service)}\nTotal: ${formatPrice(total)}`
    const whatsappNumber = settings.phone.replace(/\D/g, '') || '251911223344'
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
    toast.success('Order ready to send', { description: 'Opening WhatsApp with your table order.' })
  }

  return (
    <AnimatePresence>
      {isCartOpen && <>
        <motion.button className="drawer-backdrop" aria-label="Close order drawer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setCartOpen(false)} />
        <motion.aside className="cart-drawer" aria-label="Your order" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 280 }}>
          <div className="drawer-header">
            <div><span className="eyebrow">Your table</span><h2>Order <em>builder</em></h2></div>
            <button className="icon-button" onClick={() => setCartOpen(false)} aria-label="Close order"><X size={19} /></button>
          </div>
          {!cart.length ? <div className="empty-cart">
            <div className="empty-cart-icon"><ShoppingBag size={27} strokeWidth={1.2} /></div>
            <h3>A little room for something good.</h3>
            <p>Add a few dishes from the menu and they’ll appear here.</p>
            <button className="text-link" onClick={() => setCartOpen(false)}>Explore the menu <ChevronRight size={15} /></button>
          </div> : <>
            <div className="drawer-items">
              {cart.map((line) => <div className="cart-line" key={line.id}>
                <div className="cart-line-thumb" style={{ backgroundImage: `url("${line.imageUrl}")` }} />
                <div className="cart-line-info"><strong>{line.name}</strong><span>{formatPrice(line.price)}</span><div className="quantity-control">
                  <button onClick={() => updateQuantity(line.id, line.quantity - 1)} aria-label={`Decrease ${line.name}`}><Minus size={13} /></button>
                  <span>{line.quantity}</span>
                  <button onClick={() => updateQuantity(line.id, line.quantity + 1)} aria-label={`Increase ${line.name}`}><Plus size={13} /></button>
                </div></div>
                <div className="cart-line-end"><strong>{formatPrice(line.price * line.quantity)}</strong><button onClick={() => updateQuantity(line.id, 0)} aria-label={`Remove ${line.name}`}><Trash2 size={14} /></button></div>
              </div>)}
            </div>
            <div className="drawer-summary">
              <div><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              <div><span>Service</span><span>{formatPrice(service)}</span></div>
              <div className="summary-total"><span>Total</span><strong>{formatPrice(total)}</strong></div>
              <button className="primary-button full-width" onClick={sendOrder}><span>Send order on WhatsApp</span><ChevronRight size={17} /></button>
              <button className="secondary-button full-width" onClick={() => window.print()}><span>Print / save as PDF</span></button>
              <button className="clear-order" onClick={clearCart}><Trash2 size={13} /> Clear order</button>
            </div>
          </>}
          <div className="drawer-note"><Check size={14} /> No payment needed · Pay at the table</div>
        </motion.aside>
      </>}
    </AnimatePresence>
  )
}
