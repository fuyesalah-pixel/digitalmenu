import type { VercelRequest, VercelResponse } from '@vercel/node'

type RateLimitResult = { allowed: boolean; retryAfter: number }

/** Small Upstash REST limiter. It fails open when Upstash is not configured so local development remains frictionless. */
export async function checkRateLimit(req: VercelRequest, res: VercelResponse, scope: string, limit = 10, windowSeconds = 60): Promise<RateLimitResult> {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return { allowed: true, retryAfter: 0 }
  const ip = req.headers['x-forwarded-for']?.toString().split(',')[0]?.trim() || 'anonymous'
  const bucket = Math.floor(Date.now() / (windowSeconds * 1000))
  const key = `rate:${scope}:${ip}:${bucket}`
  try {
    const response = await fetch(`${url}/incr/${encodeURIComponent(key)}`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } })
    if (!response.ok) return { allowed: true, retryAfter: 0 }
    const count = Number(await response.text())
    if (count === 1) await fetch(`${url}/expire/${encodeURIComponent(key)}/${windowSeconds}`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } }).catch(() => undefined)
    const allowed = count <= limit
    if (!allowed) {
      const retryAfter = windowSeconds - Math.floor((Date.now() / 1000) % windowSeconds)
      res.setHeader('Retry-After', String(retryAfter))
    }
    return { allowed, retryAfter: allowed ? 0 : windowSeconds }
  } catch { return { allowed: true, retryAfter: 0 } }
}
