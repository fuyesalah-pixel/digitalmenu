import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { restaurant } from './data'
import type { CartLine, MenuItem, RestaurantSettings } from './types'

type MenuStore = {
  cart: CartLine[]
  isCartOpen: boolean
  isDark: boolean
  accentColor: string
  settings: RestaurantSettings
  isLoginOpen: boolean
  language: 'EN' | 'HI'
  addToCart: (item: MenuItem) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  setCartOpen: (open: boolean) => void
  setDark: (dark: boolean) => void
  setAccentColor: (color: string) => void
  setSettings: (settings: Partial<RestaurantSettings>) => void
  setLoginOpen: (open: boolean) => void
  setLanguage: (language: 'EN' | 'HI') => void
}

export const useMenuStore = create<MenuStore>()(
  persist(
    (set) => ({
      cart: [],
      isCartOpen: false,
      isDark: false,
      accentColor: '#e59a45',
      settings: restaurant,
      isLoginOpen: false,
      language: 'EN',
      addToCart: (item) => set((state) => {
        const existing = state.cart.find((line) => line.id === item.id)
        return {
          cart: existing
            ? state.cart.map((line) => line.id === item.id ? { ...line, quantity: line.quantity + 1 } : line)
            : [...state.cart, { ...item, quantity: 1 }],
          isCartOpen: true,
        }
      }),
      updateQuantity: (id, quantity) => set((state) => ({
        cart: quantity <= 0 ? state.cart.filter((line) => line.id !== id) : state.cart.map((line) => line.id === id ? { ...line, quantity } : line),
      })),
      clearCart: () => set({ cart: [] }),
      setCartOpen: (isCartOpen) => set({ isCartOpen }),
      setDark: (isDark) => set({ isDark }),
      setAccentColor: (accentColor) => set({ accentColor }),
      setSettings: (settings) => set((state) => ({ settings: { ...state.settings, ...settings } })),
      setLoginOpen: (isLoginOpen) => set({ isLoginOpen }),
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'sunrise-cafe-preferences',
      partialize: (state) => ({ cart: state.cart, isDark: state.isDark, accentColor: state.accentColor, settings: state.settings, language: state.language }),
    },
  ),
)
