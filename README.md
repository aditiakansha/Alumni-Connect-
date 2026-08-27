# Alumni Engagement Portal

DBMS course project — MySQL + Prisma, Node/Express (TS), React/Vite, JWT+bcrypt auth.
Monorepo managed with pnpm workspaces.

## Structure

```
alumni-portal/
├── apps/
│   ├── api/                 # Express + TypeScript backend
│   │   └── src/
│   │       ├── routes/       # auth, alumni, jobs, referrals, forum, events, admin
│   │       ├── controllers/  # business logic (auth done; rest are stubs to fill in)
│   │       ├── middleware/   # requireAuth (JWT), requireRole (RBAC)
│   │       └── utils/        # jwt.ts, hash.ts
│   └── web/                  # React + Vite + Tailwind frontend (scaffold notes in web/README.md)
├── packages/
│   └── db/                   # Prisma schema + shared client, imported as @alumni/db
│       └── prisma/
│           ├── schema.prisma
│           └── seed.ts
├── pnpm-workspace.yaml
├── package.json
└── .env.example
```

## Setup

```bash
pnpm install

cp .env.example .env
# edit .env: set DATABASE_URL to your MySQL instance, set JWT_SECRET

pnpm db:generate      # generate Prisma client
pnpm db:migrate        # creates tables + prompts for a migration name
pnpm db:seed           # optional: creates an admin@alumniportal.test user

pnpm dev:api           # starts Express on :5000
pnpm dev:web           # starts Vite dev server on :5173 (after you scaffold apps/web)
```

## Tables (packages/db/prisma/schema.prisma)

| Model         | Feature                  |
|---------------|---------------------------|
| User          | Auth / RBAC (Role: ADMIN, ALUMNI, STUDENT) |
| RefreshToken  | Auth (token rotation)     |
| Profile       | Alumni directory          |
| Job           | Job/internship board      |
| Referral      | Referral request system   |
| ForumPost, ForumComment | Discussion forum |
| Event, EventRSVP | Events board (hackathons/workshops) |

Admin dashboard has no dedicated table — it's the `ADMIN` role plus the
`/api/admin/*` routes, which is the standard way to do it and keeps the
schema from Phase 3 (ER/EER) clean.

## Auth flow (owned by Aditya)

- `POST /api/auth/register` → bcrypt-hashes password, creates User + Profile, returns JWT
- `POST /api/auth/login` → verifies password, returns JWT
- `GET /api/auth/me` → protected by `requireAuth` middleware
- `requireRole("ADMIN")` (and similar) gate admin-only / alumni-only routes

## Mapping to the 11 phases

- **Phase 2 (ER/EER):** entities above map 1:1 to models; relationships are the
  `@relation` fields in schema.prisma.
- **Phase 3–4 (Relational model + normalization):** schema is already in 3NF —
  e.g. Profile is split from User, Referral is its own junction-like entity
  between User (x2) and Job.
- **Phase 5 (DDL):** `pnpm db:migrate` generates the SQL DDL from schema.prisma
  under `packages/db/prisma/migrations/` — good to include in your submission.
- **Phase 6 (DML):** `prisma/seed.ts` is your starting point; add more sample
  INSERTs there for the demo dataset.
- **Phase 9 (DB connectivity):** `packages/db/src/index.ts` is the single
  Prisma client every app imports — this *is* the connectivity layer.
