# eir — Weight Tracker

Track your weight, visualize progress, reach your goals.

## Stack

- **Runtime**: Bun 1.3+
- **Framework**: Next.js 16 (App Router, `src/` dir)
- **Database**: PostgreSQL via `@neondatabase/serverless` (Vercel Postgres / Neon)
- **Auth**: JWT (`jose`) + bcrypt, httpOnly cookie
- **Charts**: recharts
- **Styling**: Tailwind CSS 4

## Getting started

```bash
bun install
# Copy .env.example → .env.local and fill in values
bun run dev
```

### Env vars

```
SESSION_SECRET=generate_a_random_64_char_secret
DATABASE_URL=your_postgres_connection_string
```

Generate the secret: `openssl rand -base64 48`

### Database

1. Provision Postgres (Neon for local dev, Vercel Postgres for production)
2. Run `schema.sql` against your database

## Deployment

1. Push to GitHub
2. Import in Vercel
3. Provision Vercel Postgres (Storage → Create Database)
4. Add `SESSION_SECRET` to Environment Variables
5. Run `schema.sql` against the Vercel Postgres database
