# Code guides (`docs/code-guides/`)

This folder holds Markdown explanations for modules and files we build in GymTrack Pro.

**Language:** English only (same as the rest of `docs/`).

## Purpose

**Source code** stays lean: best-practice comments only when needed (also in English).

Companion guides here cover:

- What the file/module does
- Why this approach
- Alternatives and trade-offs
- Possible bugs / edge cases
- Security implications
- How it connects to the rest of the app

## Naming

Mirror the source path, replacing the extension with `.md`. Examples:

| Source | Guide |
|--------|-------|
| `src/db/client.ts` | `docs/code-guides/src-db-client.md` |
| `src/auth/middleware.ts` | `docs/code-guides/src-auth-middleware.md` |

Or use a short clear name for a whole folder/module (e.g. `auth-layer.md`).

## When to create or update

- When **creating** a meaningful module
- When **substantially changing** an existing module

Length is not a concern here: the 500-line limit applies to source files, not to docs. Write as much as the subject needs.

## Related

- AI rules: [`.cursor/rules/workout-tracker.mdc`](../../.cursor/rules/workout-tracker.mdc)
- Learning constitution: [`docs/LEARNING_CONSTITUTION.md`](../LEARNING_CONSTITUTION.md)
