export type Category = {
  id: string
  name: string
  slug: string
  icon: string
  displayOrder: number
  isActive: boolean
  itemCount?: number
}

export type MenuItem = {
  id: string
  name: string
  description: string
  price: number
  imageUrl: string
  blurDataUrl?: string
  categoryId: string
  categoryName: string
  categorySlug: string
  isVeg: boolean
  isSpicy: boolean
  isGlutenFree?: boolean
  isAvailable: boolean
  isFeatured: boolean
  views: number
  tags: string[]
  prepTime?: string
  calories?: number
}

export type CartLine = MenuItem & { quantity: number }

export type RestaurantSettings = {
  name: string
  tagline: string
  address: string
  phone: string
  email: string
  logo: string
  primaryColor: string
}
