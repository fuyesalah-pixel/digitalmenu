# Sunrise Cafe — Digital Menu

A production-minded digital menu for Sunrise Cafe in Bole Atlas, Addis Ababa, built with React, Vite, TypeScript, Tailwind CSS, Framer Motion, Zustand and Prisma. The default experience runs with the complete local menu; Vercel Functions and PostgreSQL are ready to power production persistence.

## Run locally

```bash
npm install
npm run dev
```

Open:

- Public menu: `http://localhost:5173/`
- Admin studio: `http://localhost:5173/admin`

The app uses curated local data when no database/API is configured. The footer Admin Login accepts only:

```text
Email:    skyrise@hotel.com
Password: sky123
```

## Production setup

1. Copy `.env.example` to `.env` and set `DATABASE_URL` for Neon, Supabase, Vercel Postgres or any PostgreSQL provider.
2. Set a long random `SESSION_SECRET` in Vercel.
3. Run `npm run db:generate` and `npm run db:push`.
4. Run `npm run db:seed` to create the fixed single admin and all 59 menu items.
5. Deploy with `vercel` or connect the repository in Vercel.

`vercel.json` configures the Vite build, API routes, cache headers, SPA routes and asset caching.

### API surface

- `GET /api/menu` — active categories, available items and restaurant settings.
- `POST /api/menu/:id/view` — atomic dish view counter.
- `POST /api/auth/login` — fixed-admin credential validation, bcrypt verification when seeded, 7-day signed JWT and HttpOnly cookie.
- `POST /api/auth/logout` — clears the admin session cookie.
- `GET /api/health` — database connectivity check.
- `POST /api/upload` — authenticated Cloudinary direct-upload signature.
- `GET/POST/PATCH/DELETE /api/admin/categories` and `/api/admin/items` — protected CRUD surface with bulk item actions.

Login attempts are limited to five per minute per IP when Upstash Redis is configured. In production, `middleware.ts` protects `/admin` with the signed `sunrise_admin` cookie.

## Included experience

- Eight fixed menu categories: Chickens, Pizza & Burgers, Ethiopian Food, Cakes, Juice, Hot Drinks, Cold Drinks and Soft Drinks.
- Realistic ETB pricing, category tabs, deep-linkable category/item routes, search, vegetarian/spicy filters and price range filtering.
- Progressive images with lightweight LQIP placeholders, responsive Unsplash `srcset`, lazy loading and Framer Motion reveals.
- Skeleton loading states, order builder, quantity controls, WhatsApp handoff, print/PDF-friendly output and no-payment messaging.
- Footer-only Admin Login, portal-based centered modal, body scroll lock, click-outside close and mobile-safe scrolling.
- Admin overview analytics, menu availability controls, bulk actions, category drag-and-drop, QR table links/downloads and theme/profile customization.
- System-aware light/dark mode, English/Hindi toggle, reduced-motion support, PWA manifest/service worker, SEO/OpenGraph/JSON-LD, 404 and error boundary states.
- Vitest coverage for menu card availability and the public/admin app shells.

## Image CDN

The sample menu uses optimized Unsplash URLs. `api/upload.ts` includes a signed Cloudinary direct-upload payload with a `c_limit,w_1600,q_auto,f_auto` transformation. Store the resulting responsive WebP/AVIF URL in `MenuItem.imageUrl`; `MenuImage` already consumes responsive `srcset`-compatible URLs and a lightweight placeholder.
# digitalmenu
