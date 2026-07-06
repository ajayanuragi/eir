<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# eir — Weight Tracker

## Stack

| Layer          | Choice                                                               |
| -------------- | -------------------------------------------------------------------- |
| Runtime        | Bun 1.3+                                                             |
| Framework      | Next.js 16 (App Router, `src/` dir)                                  |
| DB             | PostgreSQL via `@vercel/postgres` (Vercel Postgres dashboard)        |
| Auth           | Custom JWT via `jose` + `bcryptjs`, stored in httpOnly cookie        |
| Charts         | recharts                                                             |
| Styling        | Tailwind CSS 4                                                       |
| Deployment     | Vercel (free)                                                        |

## Getting started

```bash
bun install
# Copy .env.example → .env.local and fill in values
bun run dev        # http://localhost:3000
```

## Env vars

```
SESSION_SECRET=generate_a_random_64_char_secret     # used by jose to sign JWTs
POSTGRES_URL=your_postgres_connection_string         # set automatically by Vercel Postgres
```

Generate the secret: `openssl rand -base64 48`

## Database setup

1. **Production**: Vercel Postgres — provision from Vercel dashboard (Storage → Create → Postgres).  
   The `POSTGRES_URL` is auto-injected in deployment.  
   **Local dev**: Use Neon (free at neon.tech) or any PostgreSQL. Set `POSTGRES_URL` in `.env.local`.
2. Run `schema.sql` against your database.

## Architecture

```
src/
├── app/
│   ├── page.tsx              # Landing page (unauthenticated)
│   ├── login/page.tsx        # Sign in
│   ├── register/page.tsx     # Sign up
│   ├── dashboard/page.tsx    # Main app (protected)
│   ├── api/
│   │   ├── me/route.ts       # GET current user username
│   │   ├── weight/
│   │   │   ├── route.ts      # GET (list), POST (create)
│   │   │   └── [id]/route.ts # DELETE
│   │   └── auth/
│   │       ├── login/route.ts    # POST sign in
│   │       ├── register/route.ts # POST sign up
│   │       └── logout/route.ts   # POST sign out
├── components/
│   ├── Navbar.tsx
│   ├── StatsCards.tsx
│   ├── WeightChart.tsx       # recharts LineChart
│   ├── WeightForm.tsx
│   └── WeightTable.tsx
├── lib/
│   ├── db.ts                 # @vercel/postgres sql helper
│   └── session.ts            # JWT encrypt/decrypt, cookie helpers
├── proxy.ts                  # Auth guard (Next.js 16 proxy)
└── ...
schema.sql                    # DDL for users + weight_entries
```

## Key conventions

- **Auth**: JWT stored in httpOnly `session` cookie. `src/lib/session.ts` handles encrypt/decrypt with `jose`. Password hashing with `bcryptjs`.
- **Proxy** (`src/proxy.ts`): Reads `session` cookie from request, decrypts JWT. Protects `/dashboard`, redirects logged-in users from `/login`/`/register`.
- **API routes**: Use `getSession()` from `src/lib/session.ts` to get current user. All weight queries scoped to `user_id`.
- **Charts** (`WeightChart.tsx`): Must be `"use client"` (recharts requires browser APIs).
- **Dashboard**: Client component fetches entries from `/api/weight` and user from `/api/me`.
- **Styling**: Tailwind CSS 4 with `@theme` directives.

## Database

Two tables: `users` (username, password_hash) and `weight_entries` (user_id, date, weight_kg, notes). No RLS — authorization is done server-side via JWT user_id.

## Commands

```bash
bun run dev       # Dev server
bun run build     # Production build (checks types + compiles)
bun run lint      # ESLint
bun run start     # Prod server (after build)
```

No test framework set up.

## Deployment

1. Push to GitHub
2. Import repo in Vercel
3. In Vercel dashboard: Storage → Create Postgres database
4. Vercel auto-injects `POSTGRES_URL`. Add `SESSION_SECRET` in Environment Variables.
5. Run `schema.sql` against the Vercel Postgres database (use Vercel CLI or any SQL client)
6. Auto-deploys on push to main
