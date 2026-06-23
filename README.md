# CME AI Community of Practice — Frontend MVP

A frontend prototype for CME's secure AI Community of Practice platform. Manufacturers can explore the AI Workbench, recipe library, and admin console using simulated data — no backend required.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Demo credentials

Password for all accounts: `demo1234`

| Role | Email |
|------|-------|
| Admin | `admin@cme.ca` |
| Participant | `jane@acmemfg.ca` |
| Viewer | `viewer@acmemfg.ca` |

Additional seed users are available in `src/lib/mock/seed.ts`.

## Features

- **Login** — mock email/password authentication with role-based access
- **Dashboard** — quick links and admin summary widgets
- **AI Workbench** — test prompts with simulated GPT-4o mini and Claude 3.5 Haiku responses
- **Recipe Library** — search, filter, and browse approved recipes
- **Submit Recipe** — create drafts and submit for approval
- **Admin Console** — manage users, companies, recipe approvals, and view activity

## Demo script

1. Log in as `jane@acmemfg.ca` (participant)
2. Open **AI Workbench**, run a prompt, then **Save as draft recipe**
3. Complete the recipe form and **Submit for approval**
4. Log out and sign in as `admin@cme.ca`
5. Open **Admin → Approvals**, review the recipe, and approve it
6. Log in as `viewer@acmemfg.ca` — confirm the approved recipe is visible but workbench is not accessible

## Data persistence

- Session and mutations are stored in browser `localStorage`
- Use **Reset demo data** in the Admin Console to restore seed data
- A banner reminds users this is a non-secure prototype

## Phase 2 migration

The data layer in `src/lib/data/` is designed to be swapped for Supabase + server-side API routes without rewriting UI components. See `.env.example` for planned environment variables.

## Tech stack

- Next.js (App Router) + TypeScript
- Tailwind CSS v4 + shadcn/ui
- React Context + localStorage

## Non-goals (this prototype)

- Real authentication, database, or AI API integration
- Enterprise SSO, billing, or production integrations
