import { FormEvent, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Eye, EyeOff, LockKeyhole, Mail, X } from 'lucide-react'
import { toast } from 'sonner'
import { menuApi } from '../../lib/api'
import { useMenuStore } from '../../lib/store'

export function LoginModal() {
  const { isLoginOpen, setLoginOpen } = useMenuStore()
  const [mounted] = useState(() => typeof document !== 'undefined')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isLoginOpen) return
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [isLoginOpen])

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')
    if (!email.trim() || !password) {
      const message = 'Invalid credentials. Please try again.'
      setError(message)
      toast.error(message)
      return
    }
    setLoading(true)
    try {
      const result = await menuApi.login(email.trim().toLowerCase(), password)
      localStorage.setItem('sunrise-admin-session', JSON.stringify(result))
      localStorage.setItem('sunrise-admin-token', result.token)
      setLoginOpen(false)
      toast.success('Welcome to Sunrise Studio', { description: 'Opening your dashboard…' })
      window.history.pushState({}, '', '/admin')
      window.dispatchEvent(new PopStateEvent('popstate'))
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : 'Invalid credentials. Please try again.'
      const safeMessage = message === 'Invalid credentials' ? 'Invalid credentials. Please try again.' : message
      setError(safeMessage)
      toast.error(safeMessage)
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {isLoginOpen && (
        <motion.div
          className="login-backdrop"
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setLoginOpen(false)}
        >
          <motion.section
            className="login-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="login-title"
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 22, stiffness: 260 }}
            onClick={(event) => event.stopPropagation()}
          >
            <button className="modal-close icon-button" onClick={() => setLoginOpen(false)} aria-label="Close login"><X size={18} /></button>
            <div className="login-mark">☀</div>
            <span className="eyebrow">Sunrise Studio</span>
            <h2 id="login-title">Admin <em>login.</em></h2>
            <p className="login-intro">Sign in to manage Sunrise Cafe’s menu, tables and orders.</p>
            <form onSubmit={submit}>
              <label>Email address<div className="input-wrap"><Mail size={16} /><input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="skyrise@hotel.com" required /></div></label>
              <label>Password<div className="input-wrap"><LockKeyhole size={16} /><input type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></div></label>
              {error && <div className="form-error" role="alert">{error}</div>}
              <button className="primary-button full-width login-submit" disabled={loading}>{loading ? <span className="button-loader" /> : 'Enter dashboard'}<span>↗</span></button>
            </form>
            <div className="login-demo"><span>Authorized access</span><strong>Sunrise Cafe team only</strong></div>
            <p className="login-legal">Your session is protected with a secure, httpOnly cookie.</p>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
