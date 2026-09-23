import type { VercelRequest, VercelResponse } from '@vercel/node'
import { categorySchema } from '../../src/lib/validation'
import { prisma } from '../_lib/prisma'
import { requireAdmin } from '../_lib/session'
import { json, methodNotAllowed } from '../_lib/http'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const admin = await requireAdmin(req)
  if (!admin) return json(res, 401, { error: 'Unauthorized' })
  try {
    if (req.method === 'GET') return json(res, 200, await prisma.category.findMany({ orderBy: { displayOrder: 'asc' } }))
    if (req.method === 'POST') {
      const parsed = categorySchema.safeParse(req.body)
      if (!parsed.success) return json(res, 400, { error: parsed.error.issues[0]?.message || 'Invalid category' })
      return json(res, 201, await prisma.category.create({ data: { name: parsed.data.name || '', slug: parsed.data.slug || '', icon: parsed.data.icon || null, displayOrder: parsed.data.displayOrder ?? 0, isActive: parsed.data.isActive ?? true } }))
    }
    const id = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id
    if (req.method === 'PATCH') {
      const body = req.body as Record<string, unknown>
      if (body.slug !== undefined) {
        const parsed = categorySchema.pick({ slug: true }).safeParse({ slug: body.slug })
        if (!parsed.success) return json(res, 400, { error: parsed.error.issues[0]?.message || 'Invalid category slug' })
        body.slug = parsed.data.slug
      }
      return json(res, 200, await prisma.category.update({ where: { id }, data: { name: body.name as string, slug: body.slug as string, icon: body.icon as string, displayOrder: body.displayOrder as number, isActive: body.isActive as boolean } }))
    }
    if (req.method === 'DELETE') { await prisma.category.delete({ where: { id } }); return json(res, 204, null) }
    return methodNotAllowed(res)
  } catch (error) { console.error(error); return json(res, 500, { error: 'Unable to update categories' }) }
}
