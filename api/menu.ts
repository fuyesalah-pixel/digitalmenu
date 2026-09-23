import type { VercelRequest, VercelResponse } from '@vercel/node'
import { prisma } from './_lib/prisma'
import { json } from './_lib/http'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const [categories, items, settings] = await Promise.all([
      prisma.category.findMany({ where: { isActive: true }, orderBy: { displayOrder: 'asc' }, include: { items: { where: { isAvailable: true }, orderBy: { createdAt: 'asc' } } } }),
      prisma.menuItem.findMany({ where: { isAvailable: true, category: { isActive: true } }, include: { category: true }, orderBy: [{ category: { displayOrder: 'asc' } }, { createdAt: 'asc' }] }),
      prisma.restaurantSettings.findUnique({ where: { id: 'primary' } }),
    ])
    const serializedItems = items.map((item) => ({ ...item, price: Number(item.price), categoryName: item.category.name, categorySlug: item.category.slug }))
    return json(res, 200, { categories, items: serializedItems, restaurant: settings })
  } catch (error) {
    console.error(error)
    return json(res, 500, { error: 'Unable to load menu' })
  }
}
