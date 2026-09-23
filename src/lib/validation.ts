import { z } from 'zod'

export const RESERVED_CATEGORY_SLUGS = new Set(['all', 'menu', 'categories'])

export const categorySchema = z.object({
  name: z.string().trim().min(1).max(60),
  slug: z.string().trim().min(1).max(60).regex(/^[a-z0-9-]+$/, 'Slug must be kebab-case').refine((slug) => !RESERVED_CATEGORY_SLUGS.has(slug), 'This slug is reserved'),
  icon: z.string().max(8).optional(),
  displayOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
})

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
})

export const menuItemSchema = z.object({
  name: z.string().trim().min(2, 'Give the dish a name.'),
  description: z.string().trim().optional(),
  price: z.coerce.number().positive('Price must be greater than zero.'),
  categoryId: z.string().min(1, 'Choose a category.'),
  isVeg: z.boolean().default(true),
  isSpicy: z.boolean().default(false),
  isGlutenFree: z.boolean().default(false),
  isAvailable: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
})

export type LoginInput = z.infer<typeof loginSchema>
export type MenuItemInput = z.infer<typeof menuItemSchema>
export type CategoryInput = z.infer<typeof categorySchema>
