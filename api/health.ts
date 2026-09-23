import type { VercelRequest, VercelResponse } from '@vercel/node'
import { json } from './_lib/http'
import { prisma } from './_lib/prisma'

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try { await prisma.$queryRaw`SELECT 1`; return json(res, 200, { ok: true, timestamp: new Date().toISOString() }) }
  catch { return json(res, 503, { ok: false }) }
}
