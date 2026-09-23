import type { VercelRequest, VercelResponse } from '@vercel/node'
import { prisma } from '../../_lib/prisma'
import { requireAdmin } from '../../_lib/session'
import { json, methodNotAllowed } from '../../_lib/http'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return methodNotAllowed(res)
  const admin = await requireAdmin(req)
  if (!admin) return json(res, 401, { error: 'Unauthorized' })
  const { ids, action } = req.body as { ids?: string[]; action?: 'available' | 'hidden' | 'delete' }
  if (!ids?.length || !action) return json(res, 400, { error: 'ids and action are required' })
  if (action === 'delete') await prisma.menuItem.deleteMany({ where: { id: { in: ids } } })
  else await prisma.menuItem.updateMany({ where: { id: { in: ids } }, data: { isAvailable: action === 'available' } })
  return json(res, 200, { ok: true, count: ids.length })
}
