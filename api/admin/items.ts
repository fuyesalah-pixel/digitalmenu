import type { VercelRequest, VercelResponse } from '@vercel/node'
import { prisma } from '../_lib/prisma'
import { requireAdmin } from '../_lib/session'
import { json, methodNotAllowed } from '../_lib/http'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const admin = await requireAdmin(req)
  if (!admin) return json(res, 401, { error: 'Unauthorized' })
  try {
    if (req.method === 'GET') return json(res, 200, await prisma.menuItem.findMany({ include: { category: true }, orderBy: { createdAt: 'desc' } }))
    if (req.method === 'POST') {
      const body = req.body as Record<string, unknown>
      const item = await prisma.menuItem.create({ data: { name: String(body.name), description: body.description ? String(body.description) : null, price: Number(body.price), imageUrl: body.imageUrl ? String(body.imageUrl) : null, blurHash: body.blurHash ? String(body.blurHash) : null, isVeg: Boolean(body.isVeg), isSpicy: Boolean(body.isSpicy), isGlutenFree: Boolean(body.isGlutenFree), isAvailable: body.isAvailable !== false, isFeatured: Boolean(body.isFeatured), categoryId: String(body.categoryId) } })
      return json(res, 201, { ...item, price: Number(item.price) })
    }
    const id = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id
    if (req.method === 'PATCH') {
      const body = req.body as Record<string, unknown>
      const item = await prisma.menuItem.update({ where: { id }, data: { name: body.name as string, description: body.description as string, price: body.price ? Number(body.price) : undefined, imageUrl: body.imageUrl as string, isAvailable: body.isAvailable as boolean, isFeatured: body.isFeatured as boolean, categoryId: body.categoryId as string } })
      return json(res, 200, { ...item, price: Number(item.price) })
    }
    if (req.method === 'DELETE') { await prisma.menuItem.delete({ where: { id } }); return json(res, 204, null) }
    return methodNotAllowed(res)
  } catch (error) { console.error(error); return json(res, 500, { error: 'Unable to update menu items' }) }
}
