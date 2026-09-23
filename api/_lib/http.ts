import type { VercelRequest, VercelResponse } from '@vercel/node'

export function json(res: VercelResponse, status: number, data: unknown) {
  res.status(status).json(data)
}

export function methodNotAllowed(res: VercelResponse) {
  return json(res, 405, { error: 'Method not allowed' })
}

export function getBearer(req: VercelRequest) {
  const header = req.headers.authorization
  return header?.startsWith('Bearer ') ? header.slice(7) : null
}

export function getSessionToken(req: VercelRequest) {
  const cookieToken = req.cookies?.sunrise_admin || req.headers.cookie?.split(';').map((part) => part.trim()).find((part) => part.startsWith('sunrise_admin='))?.split('=').slice(1).join('=')
  return getBearer(req) || cookieToken || null
}
