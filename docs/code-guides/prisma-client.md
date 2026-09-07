# Prisma client (`src/lib/prisma.ts`)

## What it does

Exports a singleton `PrismaClient` for the Next.js app, wired to Neon via `@prisma/adapter-pg` and the pooled `DATABASE_URL`.

## Why this approach

Prisma ORM 7 requires a **driver adapter** at runtime; the client no longer opens TCP by itself. Reusing one client in development (via `globalThis`) avoids exhausting Neon connections during hot reload.

## Alternatives and trade-offs

| Choice | Rejected | Why |
|--------|----------|-----|
| `@prisma/adapter-pg` + pooled URL | Unpooled for every query | Pooler is designed for serverless / many short requests |
| Module singleton + `globalThis` in dev | New client per import | Hot reload would open new pools repeatedly |

## Bugs / edge cases

- Missing `DATABASE_URL` throws at import/create time — fail fast.
- Seed script (`prisma/seed.ts`) builds its own client (no Next path aliases) and also uses the pooled URL.
- SSL mode warnings from `pg` may appear; Neon URLs already include `sslmode=require`.

## Security

- Never expose the Prisma client or `DATABASE_URL` to client components.
- Prefer server actions / route handlers that call repositories using this singleton.

## How it connects

- Schema: `prisma/schema.prisma`
- CLI config: `prisma7.config.ts` (unpooled for migrate)
- Seed: `prisma/seed.ts` / `npm run db:seed`
