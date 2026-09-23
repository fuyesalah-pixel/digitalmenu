import crypto from 'node:crypto'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { requireAdmin } from './_lib/session'
import { json, methodNotAllowed } from './_lib/http'

/** Returns a signed direct-upload payload for Cloudinary. The server never exposes the API secret. */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return methodNotAllowed(res)
  const admin = await requireAdmin(req)
  if (!admin) return json(res, 401, { error: 'Unauthorized' })
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET
  if (!cloudName || !apiKey || !apiSecret) return json(res, 503, { error: 'Cloudinary is not configured' })
  const timestamp = Math.floor(Date.now() / 1000)
  const folder = String(req.body?.folder || 'sunrise-cafe-menu')
  const signature = crypto.createHash('sha1').update(`folder=${folder}&timestamp=${timestamp}${apiSecret}`).digest('hex')
  return json(res, 200, { signature, timestamp, folder, cloudName, apiKey, transformation: 'c_limit,w_1600,q_auto,f_auto' })
}
