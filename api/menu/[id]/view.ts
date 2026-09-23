import type { VercelRequest, VercelResponse } from '@vercel/node'
import { prisma } from '../../_lib/prisma'
import { json, methodNotAllowed } from '../../_lib/http'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return methodNotAllowed(res)
  try {
    const id = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id
    if (!id) return json(res, 400, { error: 'Menu item id is required' })
    const updated = await prisma.menuItem.update({ where: { id }, data: { views: { increment: 1 } }, select: { id: true, views: true } })
    return json(res, 200, updated)
  } catch {
    return json(res, 404, { error: 'Menu item not found' })
  }
}
