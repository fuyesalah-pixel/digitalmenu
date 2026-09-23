import { SignJWT, jwtVerify } from 'jose'

export const ADMIN_EMAIL = 'skyrise@hotel.com'
export const ADMIN_PASSWORD = 'sky123'
export const SESSION_COOKIE = 'sunrise_admin'
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7

function secretKey() {
  return new TextEncoder().encode(process.env.SESSION_SECRET || 'sunrise-cafe-development-secret-change-me')
}

export async function createAdminToken() {
  return new SignJWT({ email: ADMIN_EMAIL, role: 'ADMIN' })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setSubject(ADMIN_EMAIL)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(secretKey())
}

export async function verifyAdminToken(token: string | null | undefined) {
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, secretKey(), { algorithms: ['HS256'] })
    if (payload.email !== ADMIN_EMAIL || payload.role !== 'ADMIN') return null
    return { email: String(payload.email), role: 'ADMIN' as const }
  } catch {
    return null
  }
}
