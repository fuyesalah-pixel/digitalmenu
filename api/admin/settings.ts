import type { VercelRequest, VercelResponse } from '@vercel/node'
import { prisma } from '../_lib/prisma'
import { requireAdmin } from '../_lib/session'
import { json, methodNotAllowed } from '../_lib/http'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const admin = await requireAdmin(req)
  if (!admin) return json(res, 401, { error: 'Unauthorized' })
  if (req.method === 'GET') return json(res, 200, await prisma.restaurantSettings.findUnique({ where: { id: 'primary' } }))
  if (req.method === 'PATCH') {
    try { const body = req.body as Record<string, unknown>; return json(res, 200, await prisma.restaurantSettings.upsert({ where: { id: 'primary' }, update: body, create: { id: 'primary', name: String(body.name || 'Sunrise Cafe'), tagline: String(body.tagline || 'Fresh flavors, warm sunrise ☀️'), address: String(body.address || 'Bole Atlas, Addis Ababa, Ethiopia'), phone: String(body.phone || '0911223344'), email: String(body.email || 'hello@sunrisecafe.et'), logo: String(body.logo || '☀'), primaryColor: String(body.primaryColor || '#e59a45') } })) }
    catch (error) { console.error(error); return json(res, 500, { error: 'Unable to update settings' }) }
  }
  return methodNotAllowed(res)
}
