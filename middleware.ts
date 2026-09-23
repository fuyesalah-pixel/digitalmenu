import { jwtVerify } from 'jose'

export default async function middleware(request: Request) {
  if (process.env.NODE_ENV !== 'production') return undefined
  const token = request.headers.get('cookie')?.split(';').map((part) => part.trim()).find((part) => part.startsWith('sunrise_admin='))?.split('=').slice(1).join('=')
  let valid = false
  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.SESSION_SECRET || 'sunrise-cafe-development-secret-change-me')
      const { payload } = await jwtVerify(token, secret, { algorithms: ['HS256'] })
      valid = payload.email === 'skyrise@hotel.com' && payload.role === 'ADMIN'
    } catch {
      valid = false
    }
  }
  if (!valid) {
    const url = new URL(request.url)
    url.pathname = '/'
    url.searchParams.set('login', '1')
    return Response.redirect(url, 302)
  }
  return undefined
}

export const config = { matcher: ['/admin/:path*'] }
