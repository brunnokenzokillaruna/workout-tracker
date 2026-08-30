# Roadmap — Build Order

Task breakdown for building GymTrack Pro. The specs say **what** to build ([FEATURES](./FEATURES.md), [DOMAIN_SPEC](./DOMAIN_SPEC.md), [DESIGN_SPEC](./DESIGN_SPEC.md), [TECH_STACK](./TECH_STACK.md)); this document says **in what order** and **what "done" means** for each step.

## How this document is used

Every task follows the constitution's guided flow: explain → options and trade-offs → understanding check → reasoning checkpoint → implement → document. A task is not finished when the code runs; it is finished when the **acceptance criteria** are met and the affected docs are updated.

**Legend:** `[ ]` pending · `[~]` in progress · `[x]` done

Task sizing rule: if a task cannot be explained and implemented in one focused session, it must be split. Any source file approaching 500 lines triggers a refactor before the task is marked done.

---

## Phase 0 — Foundation ✅

| | Task | Acceptance criteria | Learning doc |
|--|------|--------------------|--------------|
| [x] | 0.1 Product and technical specs | Features, data model, design system, and stack documented with trade-offs | — |
| [x] | 0.2 Version control | Repository initialised, `.gitignore` protecting secrets, public remote on GitHub, history pushed | [01-git](./learning/01-git.md) |
| [x] | 0.3 Next.js scaffold | App boots on `localhost:3000` with TypeScript, Tailwind v4, App Router, `src/`, `@/*` alias | [02-project-setup](./learning/02-project-setup.md) |

---

## Phase 1 — Data layer

The whole app depends on this, so it comes first. Source of truth: [DOMAIN_SPEC](./DOMAIN_SPEC.md).

| | Task | Acceptance criteria |
|--|------|--------------------|
| [ ] | 1.1 Provision Neon and wire configuration | Database created; `DATABASE_URL` in `.env` (ignored); `.env.example` committed with keys and no values; connection verified |
| [ ] | 1.2 Install and initialise Prisma | `prisma/schema.prisma` exists; `prisma generate` succeeds; an empty baseline migration applies cleanly |
| [ ] | 1.3 Enums | All 14 enums from DOMAIN_SPEC section 4 defined and migrated |
| [ ] | 1.4 `User` and `UserProfile` | Includes `role` (member/curator), `gender`, `birthDate`, `bodyWeightKg`, `experienceLevel`, `preferredUnit`; migration applies |
| [ ] | 1.5 `Exercise` and `ExerciseMedia` | Bilingual names, `searchAliases`, emphasis arrays, `trackingMode`, verification fields; media rows validated as `https` |
| [ ] | 1.6 Templates | `WorkoutTemplate` and `TemplateExercise` with ordering |
| [ ] | 1.7 Workouts and sets | `Workout`, `WorkoutExercise`, `WorkoutSet` including the **self-relation** (`parentSetId`) for drop sets, rest-pause, and cluster stages |
| [ ] | 1.8 Support tables | `ExerciseAvoidance`, `FavoriteExercise`, `FavoriteTemplate` |
| [ ] | 1.9 Constraints and indexes | Uniqueness rules enforced in the database, not only in code; indexes on the query paths we actually use (last performance lookup, catalog search) |
| [ ] | 1.10 Seed script | Creates the curator account; idempotent so it can be re-run |
| [ ] | 1.11 Domain validation module | The 16 validation rules from DOMAIN_SPEC section 6 as pure functions, unit-tested |

**Why validation is a separate task from the schema:** the database enforces shape and referential integrity; it cannot express rules like "`weightKg` must be derived from `enteredWeight` and `enteredUnit`". Those live in code, and being pure functions makes them the cheapest thing in the project to test.

---

## Phase 2 — Design foundation

Built before feature screens so no screen is written twice. Source of truth: [DESIGN_SPEC](./DESIGN_SPEC.md).

| | Task | Acceptance criteria |
|--|------|--------------------|
| [ ] | 2.1 Design tokens | Colour palette and spacing scale from DESIGN_SPEC 2.1/2.3 declared with Tailwind v4 `@theme` in the global stylesheet |
| [ ] | 2.2 Typography | Archivo and Instrument Sans loaded via `next/font`; **tabular numerals** applied wherever numbers are displayed |
| [ ] | 2.3 shadcn/ui initialised | Components land in our repository and match our tokens rather than shadcn defaults |
| [ ] | 2.4 App shell and navigation | Route groups implementing the hybrid model: bottom tabs for browsing, full-screen for the active workout |
| [ ] | 2.5 Motion module | Duration and easing tokens from DESIGN_SPEC 2.4 in one place; `useReducedMotion` honoured; only `transform` and `opacity` animated |
| [ ] | 2.6 Sound module | Web Audio synthesis of the DESIGN_SPEC 2.5 palette; context unlocked on first gesture; envelope maths unit-tested |
| [ ] | 2.7 Accessibility baseline | Contrast verified (WCAG AA, 7:1 for numerals); 48px tap targets; keyboard navigation working |

**Note on 2.6:** the mobile autoplay lock is the highest-risk item in this phase. If the audio context is not resumed on a user gesture, the rest timer reaches zero in silence — and it will work on desktop while failing on the phone, which is where the app is actually used.

---

## Phase 3 — Authentication and authorization

| | Task | Acceptance criteria |
|--|------|--------------------|
| [ ] | 3.1 Auth.js with Google OAuth | Sign in and sign out working; session readable on the server |
| [ ] | 3.2 Route protection | Unauthenticated users cannot reach app routes or read another user's data |
| [ ] | 3.3 Role authorization | A `curator`-only guard enforced **server-side**; hiding the button in the UI is not authorization |

**Open question to close here:** Google OAuth only, or also email/password? (TECH_STACK section 5)

---

## Phase 4 — Exercise catalog

| | Task | Acceptance criteria |
|--|------|--------------------|
| [ ] | 4.1 List and bilingual search | Finds an exercise by English name, pt-BR name, or alias |
| [ ] | 4.2 Exercise detail | Shows emphasis, equipment, form cues, and execution links opening in the provider's app |
| [ ] | 4.3 Curator create form | Manual entry with full validation; visible only to a curator and enforced on the server |
| [ ] | 4.4 AI-assisted fill | Gemini proposes fields grounded on reference data; **nothing is saved without curator approval**; LLM output validated against the enums and treated as untrusted |
| [ ] | 4.5 Deduplication | Warns before creating a near-duplicate of an existing exercise |

---

## Phase 5 — Templates

| | Task | Acceptance criteria |
|--|------|--------------------|
| [ ] | 5.1 Create and edit a template | Add, remove, and reorder exercises |
| [ ] | 5.2 Template list and favourites | |
| [ ] | 5.3 Start a workout from a template | Exercises are **copied** into the workout, so later template edits do not rewrite history |
| [ ] | 5.4 Load suggestion | Pre-fills from the last performance of that exercise, editable |

---

## Phase 6 — Active workout logging

The core of the product, and the screen used with sweaty hands between sets. Source of truth: DESIGN_SPEC section 5.

| | Task | Acceptance criteria |
|--|------|--------------------|
| [ ] | 6.1 Workout screen layout | Current exercise, set list, next-up strip |
| [ ] | 6.2 Set entry | Pre-filled values, steppers primary, numeric keypad as escape hatch; nothing animates under the thumb |
| [ ] | 6.3 Units and entry mode | kg/lb and per-side/total remembered **per exercise**; canonical `weightKg` stored alongside what was typed |
| [ ] | 6.4 Rest timer | Arc driven by real time; final 3 seconds pulse; sound plus visual equivalent |
| [ ] | 6.5 Intensity techniques | Drop set, rest-pause, and cluster stages written as child rows of the parent set |
| [ ] | 6.6 Exercise swap | Swap with a reason; session-only or added to the avoid list per DOMAIN_SPEC 5.3 |
| [ ] | 6.7 Finish and summary | Totals computed correctly, including child-row aggregation |
| [ ] | 6.8 Offline resilience (light) | An in-progress workout survives a page reload |

---

## Phase 7 — History and progress

| | Task | Acceptance criteria |
|--|------|--------------------|
| [ ] | 7.1 Workout history list | |
| [ ] | 7.2 Workout detail | Read-only view of a past session |
| [ ] | 7.3 Progress charts | Recharts segment inside History; volume and load over time; no N+1 queries |
| [ ] | 7.4 Personal records | Detection and the signature celebration moment |

---

## Phase 8 — Quality

Runs alongside the phases above, not after. Listed separately because it has its own acceptance criteria.

| | Task | Acceptance criteria |
|--|------|--------------------|
| [ ] | 8.1 Vitest on domain logic | Weight conversion, set aggregation, and validation rules covered |
| [ ] | 8.2 Integration tests | Critical database paths, especially the set self-relation |
| [ ] | 8.3 Playwright E2E | One full path: sign in → start workout → log sets → finish |
| [ ] | 8.4 Accessibility audit | Automated pass plus manual keyboard and screen-reader check |

**Testing priority:** unit tests go where a bug would be **silent**. A broken layout is visible immediately; a wrong lb-to-kg conversion quietly corrupts months of training history. That is where the tests belong.

---

## Phase 9 — Deploy

| | Task | Acceptance criteria |
|--|------|--------------------|
| [ ] | 9.1 PWA manifest and icons | Installable via “Add to Home Screen” |
| [ ] | 9.2 Amplify hosting | Deployed and reachable; environment variables configured from `.env.example` |
| [ ] | 9.3 Billing alerts | AWS alerts active before any real traffic |
| [ ] | 9.4 Production checklist | Security headers, error handling, no secret reachable from the client bundle |

---

## Sequencing rules

1. **Data before UI.** A screen built against a wrong schema is written twice.
2. **Design foundation before feature screens.** Tokens retrofitted later means touching every component.
3. **Auth before anything user-scoped.** Adding ownership to existing queries is error-prone and a security risk.
4. **Tests alongside the code**, not in a phase at the end.
5. **Docs in the same step as the code**, per constitution rule 16.

## Deliberately deferred

Full offline sync with a service worker, native apps, social features, and nutrition tracking — see the "cut" section of [FEATURES](./FEATURES.md). Each was rejected with a reason; revisit only if that reason changes.
