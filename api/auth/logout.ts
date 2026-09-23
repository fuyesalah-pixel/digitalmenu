import type { VercelRequest, VercelResponse } from '@vercel/node'
import { SESSION_COOKIE } from '../_lib/auth'
import { json } from '../_lib/http'

export default function handler(_req: VercelRequest, res: VercelResponse) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
  res.setHeader('Set-Cookie', `${SESSION_COOKIE}=; HttpOnly${secure}; SameSite=Lax; Path=/; Max-Age=0`)
  return json(res, 200, { ok: true })
}
