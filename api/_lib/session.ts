import type { VercelRequest } from '@vercel/node'
import { getSessionToken } from './http'
import { verifyAdminToken } from './auth'

export async function requireAdmin(req: VercelRequest) {
  return verifyAdminToken(getSessionToken(req))
}
