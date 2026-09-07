# Design tokens & typography (`src/app/globals.css`, `layout.tsx`)

## What it does

Declares the GymTrack Pro visual system in CSS: surfaces, signal colours, spacing, radii, type scale, motion durations, and maps them into Tailwind v4 `@theme` so utilities like `bg-surface-0`, `text-volt`, and `font-display` work. Loads **Archivo** and **Instrument Sans** via `next/font`.

## Why this approach

- **Tokens first** — feature screens inherit one palette instead of inventing colours per component.
- **Dark default** — gym lighting; chalk (light) is opt-in via `.theme-chalk` or system preference.
- **Tabular numerals** — `.font-tabular` keeps steppers from layout-jitter when digits change.
- **Tailwind v4 `@theme`** — no `tailwind.config.js`; configuration lives in CSS (TECH_STACK note).

## Alternatives and trade-offs

| Choice | Rejected | Why |
|--------|----------|-----|
| CSS variables + `@theme` | JS theme config (v3) | Matches installed Tailwind v4 |
| Archivo + Instrument Sans | Inter / Geist | Avoids generic AI-template look; matches DESIGN_SPEC 2.2 |
| Grain as CSS noise SVG | Image asset | Zero network; ~3% opacity |

## Bugs / edge cases

- Text **on** volt/amber/ember must use `.text-on-volt` (maps to `--surface-0`), never white — contrast requirement.
- Manual `.theme-dark` on `<html>` forces dark even when the OS is light (current default for gym-first MVP).
- `prefers-reduced-motion` collapses transitions globally; Motion library must still honour the hook when added (task 2.5).

## Security

N/A for tokens. External fonts load from Google via `next/font` (self-hosted at build time).

## How it connects

- Spec: `docs/DESIGN_SPEC.md` §2
- Preview: `src/app/page.tsx`
- Next: shadcn/ui init (task 2.3) should consume these tokens, not default shadcn colours
