import { categories, menuItems, restaurant } from './data'
import type { Category, MenuItem, RestaurantSettings } from './types'

const API_URL = import.meta.env.VITE_API_URL

export const ADMIN_CREDENTIALS = {
  email: 'skyrise@hotel.com',
  password: 'sky123',
} as const

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('sunrise-admin-token') : null
  const response = await fetch(`${API_URL ?? ''}${path}`, { headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, ...init })
  if (!response.ok) throw new Error(`Request failed: ${response.status}`)
  return response.json() as Promise<T>
}

export const menuApi = {
  async getMenu(): Promise<{ categories: Category[]; items: MenuItem[]; restaurant: RestaurantSettings }> {
    if (API_URL) return request('/api/menu')
    if (import.meta.env.PROD) {
      try { return await request('/api/menu') } catch { /* local preview can run without a database */ }
    }
    return { categories, items: menuItems, restaurant }
  },
  async trackView(id: string) {
    if (!API_URL) return
    await request(`/api/menu/${id}/view`, { method: 'POST' })
  },
  async updateItem(id: string, changes: Record<string, unknown>) {
    if (!API_URL && !import.meta.env.PROD) return { ...changes, id }
    return request(`/api/admin/items?id=${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify(changes) })
  },
  async createItem(input: Record<string, unknown>) {
    if (!API_URL && !import.meta.env.PROD) return input
    return request('/api/admin/items', { method: 'POST', body: JSON.stringify(input) })
  },
  async deleteItem(id: string) {
    if (!API_URL && !import.meta.env.PROD) return
    return request(`/api/admin/items?id=${encodeURIComponent(id)}`, { method: 'DELETE' })
  },
  async bulkItems(ids: string[], action: 'available' | 'hidden' | 'delete') {
    if (!API_URL && !import.meta.env.PROD) return
    return request('/api/admin/items/bulk', { method: 'POST', body: JSON.stringify({ ids, action }) })
  },
  async updateSettings(changes: Record<string, unknown>) {
    if (!API_URL && !import.meta.env.PROD) return changes
    return request('/api/admin/settings', { method: 'PATCH', body: JSON.stringify(changes) })
  },
  async createCategory(input: Record<string, unknown>) {
    if (!API_URL && !import.meta.env.PROD) return input
    return request('/api/admin/categories', { method: 'POST', body: JSON.stringify(input) })
  },
  async updateCategory(id: string, changes: Record<string, unknown>) {
    if (!API_URL && !import.meta.env.PROD) return { ...changes, id }
    return request(`/api/admin/categories?id=${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify(changes) })
  },
  async deleteCategory(id: string) {
    if (!API_URL && !import.meta.env.PROD) return
    return request(`/api/admin/categories?id=${encodeURIComponent(id)}`, { method: 'DELETE' })
  },
  async login(email: string, password: string): Promise<{ token: string; user: { email: string; role: 'ADMIN' | 'STAFF' } }> {
    if (email !== ADMIN_CREDENTIALS.email || password !== ADMIN_CREDENTIALS.password) {
      throw new Error('Invalid credentials. Please try again.')
    }
    if (API_URL) return request('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })
    await new Promise((resolve) => setTimeout(resolve, 650))
    if (import.meta.env.PROD) {
      try { return await request('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }) }
      catch { /* keep the local preview usable before a database is connected */ }
    }
    return { token: 'sunrise-demo-session', user: { email: ADMIN_CREDENTIALS.email, role: 'ADMIN' as const } }
  },
}
