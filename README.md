# Health Journal

A calm, private health journal and tracker built with Next.js, Supabase, and Tailwind CSS. Designed for personal wellness journaling, symptom tracking, medication logs, reminders, care-plan tasks, and goals.

## Features

- Email/password authentication with secure cookie sessions
- Row-level security on all user data in PostgreSQL
- Today-focused dashboard with affirmations
- Journal entries (full + quick-entry mode)
- Symptom, medication, and daily check-in trackers
- In-app reminders (architecture ready for email/push later)
- Care plan tasks and health goals
- Calendar timeline view
- Mobile-first responsive layout

## Prerequisites

- Node.js 18.18+ (20+ recommended)
- npm, pnpm, or yarn
- A [Supabase](https://supabase.com) project
- A [Vercel](https://vercel.com) account (for deployment)

## Local setup

### 1. Clone and install

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon (public) key |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` for local dev |

Optional: `SUPABASE_SERVICE_ROLE_KEY` for dev seed script only. **Never expose this to the client.**

### 3. Set up Supabase database

1. Open your Supabase project → **SQL Editor**
2. Run the full contents of [`supabase/migrations/001_initial_schema.sql`](supabase/migrations/001_initial_schema.sql)

This creates tables, indexes, RLS policies, and the profile auto-creation trigger.

### 4. Configure Supabase Auth

In **Authentication → URL Configuration**:

- **Site URL**: `http://localhost:3000` (or your production URL)
- **Redirect URLs**:
  - `http://localhost:3000/auth/callback`
  - `https://your-app.vercel.app/auth/callback`
  - `https://*.vercel.app/auth/callback` (for preview deployments)

Enable **Email** provider under Authentication → Providers.

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

1. Push the repository to GitHub
2. Import the project in Vercel
3. Add environment variables (same as `.env.local`, with production URLs)
4. Set `NEXT_PUBLIC_APP_URL` to your production domain
5. Add the Vercel production and preview URLs to Supabase redirect allowlist
6. Deploy

```bash
npm run build
```

## Project structure

```
app/                 # Next.js App Router pages
components/          # UI and layout components
lib/
  actions/           # Server Actions (mutations)
  auth/              # Auth helpers
  queries/           # Read aggregations
  supabase/          # Supabase clients
  validations/       # Zod schemas
supabase/migrations/ # SQL schema
types/               # TypeScript database types
```

## Security notes

- All user tables use RLS (`auth.uid() = user_id`)
- Authorization uses `supabase.auth.getUser()` server-side
- Service role key is never bundled for the browser
- Inputs validated with Zod in Server Actions
- Security headers configured in `next.config.ts`

## Customization

Edit the app name in [`lib/constants/app.ts`](lib/constants/app.ts):

```ts
export const APP_NAME = "Health Journal";
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## License

Private / personal use. Adapt as needed for your own health journaling.
