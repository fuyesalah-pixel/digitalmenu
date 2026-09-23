import { lazy, Suspense, useEffect } from 'react'
import { MotionConfig } from 'framer-motion'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { Toaster } from 'sonner'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import { ErrorBoundary } from './components/ErrorBoundary'

const AdminPage = lazy(() => import('./pages/AdminPage'))
const ItemPage = lazy(() => import('./pages/ItemPage'))
const queryClient = new QueryClient({ defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } } })
import { useMenuStore } from './lib/store'
import { restaurant } from './lib/data'

function ThemeEffect() {
  const isDark = useMenuStore((state) => state.isDark)
  const accentColor = useMenuStore((state) => state.accentColor)
  const setDark = useMenuStore((state) => state.setDark)
  useEffect(() => {
    document.documentElement.dataset.theme = isDark ? 'dark' : 'light'
    document.documentElement.style.setProperty('--accent', accentColor)
    const stored = window.localStorage.getItem('sunrise-cafe-preferences')
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    if (!stored && media.matches) setDark(true)
  }, [accentColor, isDark, setDark])
  return null
}

function SeoRuntime() {
  useEffect(() => {
    const description = 'Sunrise Cafe — fresh flavors, warm sunrise in Bole Atlas, Addis Ababa.'
    let descriptionTag = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (!descriptionTag) { descriptionTag = document.createElement('meta'); descriptionTag.name = 'description'; document.head.appendChild(descriptionTag) }
    descriptionTag.content = description
    let script = document.querySelector<HTMLScriptElement>('script[data-menu-schema]')
    if (!script) { script = document.createElement('script'); script.type = 'application/ld+json'; script.dataset.menuSchema = 'true'; document.head.appendChild(script) }
    script.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'Restaurant', name: restaurant.name, description, servesCuisine: ['Ethiopian', 'Cafe'], address: { '@type': 'PostalAddress', streetAddress: 'Bole Atlas', addressLocality: 'Addis Ababa', addressCountry: 'ET' }, url: window.location.origin, telephone: '+251911223344', openingHours: 'Mo-Su 07:00-23:00', acceptsReservations: true })
  }, [])
  return null
}

function AppRoutes() {
  const location = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [location.pathname])
  return <Suspense fallback={<div className="route-loading" aria-label="Loading"><span /><span /><span /></div>}><Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/item/:slug" element={<ItemPage />} />
    <Route path="/admin/*" element={<AdminPage />} />
    <Route path="/login" element={<Navigate to="/" replace />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes></Suspense>
}

export default function App() {
  return <QueryClientProvider client={queryClient}><MotionConfig reducedMotion="user"><ErrorBoundary><BrowserRouter><ThemeEffect /><SeoRuntime /><AppRoutes /><Toaster position="bottom-right" toastOptions={{ classNames: { toast: 'app-toast' } }} /><Analytics /><SpeedInsights /></BrowserRouter></ErrorBoundary></MotionConfig></QueryClientProvider>
}

export const seo = {
  name: restaurant.name,
  description: restaurant.tagline,
}
