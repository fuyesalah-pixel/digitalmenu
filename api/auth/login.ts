import type { VercelRequest, VercelResponse } from '@vercel/node'
import bcrypt from 'bcryptjs'
import { ADMIN_EMAIL, ADMIN_PASSWORD, SESSION_COOKIE, SESSION_TTL_SECONDS, createAdminToken } from '../_lib/auth'
import { prisma } from '../_lib/prisma'
import { checkRateLimit } from '../_lib/rateLimit'
import { json, methodNotAllowed } from '../_lib/http'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return methodNotAllowed(res)
  res.setHeader('Cache-Control', 'no-store')
  const limit = await checkRateLimit(req, res, 'sunrise-login', 5, 60)
  if (!limit.allowed) return json(res, 429, { error: 'Too many attempts. Try again shortly.' })
  const { email, password } = (req.body ?? {}) as { email?: string; password?: string }
  if (!email || !password) return json(res, 400, { error: 'Email and password are required' })
  if (email.toLowerCase() !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) return json(res, 401, { error: 'Invalid credentials. Please try again.' })
  try {
    // Seeded deployments use bcrypt verification; the fixed credential check above
    // keeps the single-admin deployment deterministic if the seed has not run yet.
    try {
      const user = await prisma.user.findUnique({ where: { email: ADMIN_EMAIL } })
      if (user && !(await bcrypt.compare(password, user.password))) return json(res, 401, { error: 'Invalid credentials. Please try again.' })
    } catch (databaseError) {
      console.warn('Admin database lookup unavailable; using fixed admin credentials.', databaseError)
    }
    const token = await createAdminToken()
    const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
    res.setHeader('Set-Cookie', `${SESSION_COOKIE}=${token}; HttpOnly${secure}; SameSite=Lax; Path=/; Max-Age=${SESSION_TTL_SECONDS}`)
    return json(res, 200, { token, user: { email: ADMIN_EMAIL, role: 'ADMIN' } })
  } catch (error) {
    console.error(error)
    return json(res, 500, { error: 'Unable to sign in' })
  }
}
