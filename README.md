# GymTrack Pro

A mobile-first workout tracker for serious training: precise muscle emphasis, first-class intensity techniques, and AI-generated programs you can actually edit.

Built as a learning project with every architectural decision documented and defended.

**Status:** design and specification complete; implementation starting.

---

## Why this exists

Free workout apps tend to fail in the same places. GymTrack Pro targets those gaps directly:

| Problem in existing apps | What this does |
|--------------------------|----------------|
| Small exercise catalogs | Curated catalog plus AI-assisted entry for anything missing |
| Coarse muscle labels ("shoulders") | Muscle **emphasis** — lateral vs anterior vs posterior deltoid |
| Intensity techniques locked behind paywalls | Drop set, rest-pause, cluster, and myo-reps in set logging |
| Changing programs means deleting everything | AI generates and regenerates plans from goals and muscle focus |
| Weak form guidance | Execution cues plus curated video links per exercise |
| One unit system only | Log in kg or lb per set — gyms mix both |

**North star:** build and log serious workouts on a phone at the gym — fast, precise, and explainable.

---

## Tech stack

| Layer | Choice |
|-------|--------|
| Language | TypeScript |
| Framework | Next.js (App Router) |
| UI | React, Tailwind CSS, shadcn/ui |
| Database | PostgreSQL via Prisma |
| Auth | Auth.js (NextAuth) |
| AI | Google Gemini (server-side only) |
| Charts | Recharts |
| Tests | Vitest (domain logic), Playwright (critical flows) |
| Hosting | AWS Amplify, with managed Postgres on Neon or Supabase |

Every choice above, including the alternatives rejected and why, is recorded in [docs/TECH_STACK.md](./docs/TECH_STACK.md).

Budget target is roughly **$0/month** on free tiers.

---

## Documentation

The specs are the source of truth and are kept in sync with the code.

| Document | Contents |
|----------|----------|
| [FEATURES.md](./docs/FEATURES.md) | Product scope, personas, MVP / v1 / later backlog |
| [DOMAIN_SPEC.md](./docs/DOMAIN_SPEC.md) | Data model, entities, validation rules, security, acceptance criteria |
| [DESIGN_SPEC.md](./docs/DESIGN_SPEC.md) | Screens, navigation, visual system, gym ergonomics, accessibility |
| [TECH_STACK.md](./docs/TECH_STACK.md) | Architecture, decision log, budget, testing strategy |
| [LEARNING_CONSTITUTION.md](./docs/LEARNING_CONSTITUTION.md) | How this project is built and reviewed |
| [code-guides/](./docs/code-guides/) | Per-module explanations: behaviour, trade-offs, bugs, security |

---

## Design highlights

A few decisions worth knowing before reading the code:

**Workouts snapshot their template.** Starting a session copies the exercises rather than referencing the template, so editing a routine never rewrites past history.

**Intensity techniques are rows, not JSON.** A drop set is a parent set plus stage rows linked by `parentSetId`, which keeps weight and reps as real numeric columns that `SUM` correctly.

**Weight is stored canonically in kilograms**, excluding the bar, while the number and unit the user typed are preserved separately — converting back for display would be lossy.

**AI proposes, a human approves.** Gemini can suggest exercise metadata, but only reviewed rows feed workout generation, and the model never touches injury data.

---

## Getting started

Not yet runnable — the application is being scaffolded. This section will cover prerequisites, environment variables, database setup, and the local dev commands.

---

## License

Personal project, not currently licensed for reuse.
