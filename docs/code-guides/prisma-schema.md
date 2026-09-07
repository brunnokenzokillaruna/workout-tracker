# Prisma schema (`prisma/schema.prisma`)

## What it does

Declares the GymTrack Pro database structure for Prisma ORM: models, enums, relations, and indexes. Migrations under `prisma/migrations/` turn changes into versioned SQL applied to Neon.

## Why this approach

- **Enums in Postgres** close the set of legal values (AI output cannot invent muscle names).
- **`User` + `TrainingProfile`** keep Auth.js identity separate from training attributes (DOMAIN_SPEC 5.19).
- **`Exercise.ownerId` nullable** — `null` means global catalog; set means personal custom (5.16).
- **Emphasis as enum arrays** — multiple targets per exercise without a join table for MVP (5.7).
- **`ExerciseMedia` as its own table** — several links per exercise; dead links auditable per provider (5.4).
- **Templates without target weight** — plan holds sets/reps/rest/technique; load comes from last performance when a workout is started (5.11).
- **`WorkoutSet` self-relation** — intensity technique stages are child rows (`parentSetId`), not JSON (5.2).

## Alternatives and trade-offs

| Choice | Rejected alternative | Why |
|--------|----------------------|-----|
| One `Exercise` table | Separate global/custom tables | Same shape; search and templates treat both as exercises |
| Enum arrays for emphasis | Join table `ExerciseEmphasis` | Overkill while lists stay small; revisit if metadata per emphasis appears |
| `userId` as PK on `TrainingProfile` | Separate `id` + `@unique userId` | Same 1:1 guarantee; fewer columns |
| Copy template into workout | Live pointer to template rows | Editing a template must not rewrite history (5.1) |
| Explicit `position` on template lines | Rely on insertion order | Relational rows have no inherent order |
| Self-relation for stages | JSON blob of stages | Aggregations and validation stay in SQL |

## Bugs / edge cases

- Soft-hide via `isActive` — history rows must still resolve the exercise even when hidden from the catalog.
- Deleting a user cascades owned custom exercises; verified-by is set null so global rows survive curator account deletion.
- URL `https` validation is application-layer (DOMAIN_SPEC), not enforced by the column type.
- Trigram search indexes for bilingual dedupe are deferred to roadmap task 1.9.

## Security

- Catalog writes for global rows require curator role (enforced in app, not DB).
- `ownerId` scoping for custom exercises must be checked server-side on every read/write.
- Never trust LLM enum strings — validate against Prisma enums before persist.

## How it connects

- Config: `prisma7.config.ts` (CLI uses `DATABASE_URL_UNPOOLED`).
- Spec: `docs/DOMAIN_SPEC.md`.
- Client output: `src/generated/prisma` (gitignored; `prisma generate`).
- Roadmap Phase 1: models through 1.8 done; next: remaining indexes (trigram search), seed, domain validation.
