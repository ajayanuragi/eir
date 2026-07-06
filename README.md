# eir — Weight Tracker

Track your weight, body measurements, and visualize your journey.

## Stack

| Layer          | Choice                                                               |
| -------------- | -------------------------------------------------------------------- |
| Runtime        | Bun 1.3+                                                             |
| Framework      | Next.js 16 (App Router, `src/` dir)                                 |
| Database       | PostgreSQL via `@neondatabase/serverless` (Vercel Postgres / Neon) |
| Auth           | Custom JWT via `jose` + `bcryptjs`, httpOnly cookie                 |
| Charts         | recharts                                                             |
| Styling        | Tailwind CSS 4 + CSS custom properties for dark mode                |

## Features

- **Weight tracking** — Log daily weight with optional notes
- **Body measurements** — Track waist, hip, chest, thigh, arm circumference
- **Goal weight** — Set a target, see progress bar and remaining on dashboard
- **BMI** — Auto-calculated, color-coded (underweight/healthy/overweight/obese)
- **7-entry moving average** — Dashed trend line overlay on chart
- **Date range filter** — Filter entries by 7/30/90 days or show all
- **Streak tracking** — Consecutive-day logging streak displayed on dashboard
- **Multi-measurement chart** — Toggle individual body measure lines on/off
- **CSV export** — Download all weight entries as CSV
- **Dark mode** — Toggle in navbar, persisted to localStorage
- **Unit toggle** — Switch between kg and lbs throughout the app
- **Change password** — Update password from profile page
- **Height input** — Supports cm, inches, or feet+inches
- **Auth** — Register, login, logout with JWT in httpOnly cookie

## Getting started

```bash
bun install
# Copy .env.example → .env.local and fill in values
bun run dev        # http://localhost:3000
```

## Env vars

```
SESSION_SECRET=generate_a_random_64_char_secret     # used by jose to sign JWTs
DATABASE_URL=your_postgres_connection_string         # set automatically by Vercel Postgres
```

Generate the secret: `openssl rand -base64 48`

## Database

Run `schema.sql` against your PostgreSQL database (Neon for local dev, Vercel Postgres for production).

### Migrating an existing database

```sql
ALTER TABLE users ADD COLUMN goal_weight_kg DECIMAL(5,1);
ALTER TABLE users ADD COLUMN unit_preference TEXT DEFAULT 'kg';

CREATE TABLE body_measurements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) NOT NULL,
  date DATE NOT NULL,
  waist_cm DECIMAL(5,1),
  hip_cm DECIMAL(5,1),
  chest_cm DECIMAL(5,1),
  thigh_cm DECIMAL(5,1),
  arm_cm DECIMAL(5,1),
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_body_measurements_user_date ON body_measurements(user_id, date DESC);
```

## Architecture

```
src/
├── app/
│   ├── page.tsx                 # Landing page (unauthenticated)
│   ├── login/page.tsx           # Sign in
│   ├── register/page.tsx        # Sign up
│   ├── dashboard/page.tsx       # Main dashboard (protected)
│   ├── profile/page.tsx         # Settings, goal, height, measurements, password (protected)
│   ├── api/
│   │   ├── me/route.ts          # GET user info, PATCH height/goal/units/password
│   │   ├── weight/
│   │   │   ├── route.ts         # GET (list), POST (create)
│   │   │   └── [id]/route.ts    # DELETE
│   │   ├── measurements/
│   │   │   ├── route.ts         # GET (list), POST (create)
│   │   │   └── [id]/route.ts    # DELETE
│   │   └── auth/
│   │       ├── login/route.ts
│   │       ├── register/route.ts
│   │       └── logout/route.ts
├── components/
│   ├── Navbar.tsx               # Navigation with dark mode toggle
│   ├── ThemeProvider.tsx        # Dark mode context + localStorage
│   ├── StatsCards.tsx           # Current, change, BMI, streak, goal progress
│   ├── WeightChart.tsx          # recharts AreaChart with moving average
│   ├── MeasurementChart.tsx     # Multi-line body measurement chart
│   ├── WeightForm.tsx           # Add/edit weight entry form
│   ├── WeightTable.tsx          # Weight entries list with delete
│   ├── MeasurementForm.tsx      # Body measurement entry form
│   ├── MeasurementTable.tsx     # Measurement history table
│   └── HeightForm.tsx           # Height input (cm/in/ft+in)
├── lib/
│   ├── db.ts                    # Lazy neon client
│   └── session.ts               # JWT encrypt/decrypt, cookie helpers
├── proxy.ts                     # Next.js 16 proxy (auth guard)
└── schema.sql                   # DDL for all tables
```

## Commands

```bash
bun run dev       # Dev server
bun run build     # Production build (checks types + compiles)
bun run lint      # ESLint
bun run start     # Prod server (after build)
```

## Deployment

1. Push to GitHub
2. Import repo in Vercel
3. Provision Vercel Postgres (Storage → Create Database)
4. Vercel auto-injects `DATABASE_URL`. Add `SESSION_SECRET` in Environment Variables.
5. Run `schema.sql` against the Vercel Postgres database
6. Auto-deploys on push to main
