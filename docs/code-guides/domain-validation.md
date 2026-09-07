# Domain validation (`src/domain/`)

## What it does

Pure TypeScript functions that enforce DOMAIN_SPEC section 6 rules before persistence: weight conversion, set/stage shape, workout dates, curator/catalog authorization checks, enum validation, name dedupe, and media URL safety.

## Why this approach

Postgres enums and foreign keys cannot express “`weightKg` must equal converted `enteredWeight`” or “stages cannot carry `technique`”. Keeping those rules as pure functions makes them the cheapest tests in the project (Vitest, no database).

## Alternatives and trade-offs

| Choice | Rejected | Why |
|--------|----------|-----|
| Pure functions returning `{ ok, errors }` | Throwing exceptions for every miss | Callers can collect multiple errors; easier in forms |
| Domain folder separate from Prisma | Putting rules only in API routes | Routes would duplicate logic; tests would need HTTP |

## Bugs / edge cases

- Floating lb→kg uses 2-decimal rounding to match `Decimal(n,2)` columns; equality uses that precision.
- Rule 11 (`validateSingleOpenWorkout`) needs the caller to query for another open workout — the function only interprets the boolean.
- Rule 16 is exact normalized match; trigram fuzzy dedupe can wrap it later without changing the API.
- Rule 14b (AI never writes avoidances) is a process/API constraint — enforced where Gemini results are applied, not in these helpers alone.

## Security

- `validateMediaUrl` rejects non-`https` and mismatched hosts (XSS via `javascript:` href).
- Curator checks are helpers — **must** be called on the server; hiding UI is not authorization.
- Enum validation rejects unknown strings from LLM output (rule 15).

## How it connects

- Spec: `docs/DOMAIN_SPEC.md` §6
- Tests: `src/domain/*.test.ts` via `npm test`
- Prisma enums imported from `@/generated/prisma/enums`
- Call sites: future server actions / route handlers for sets, exercises, media
