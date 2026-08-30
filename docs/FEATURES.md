# GymTrack Pro — Product Features

> **How to use this file:** Edit freely. Change status, cut ideas, add new ones.  
> Status values: `idea` | `mvp` | `v1` | `later` | `cut`

**Last updated:** August 2026  
**Product:** GymTrack Pro  
**Audience:** You + friends/family (individual accounts, no social feed)

---

## 1. Vision & pain points

GymTrack Pro exists because existing free apps often fail at:

| Pain | What we solve |
|------|----------------|
| Tiny free exercise catalogs | Large catalog + custom exercises |
| Weak form guidance (GIF/video/cues) | Execution media + cues (angle, grip, muscle emphasis) |
| Switching programs = delete everything manually | AI generates/regenerates workouts from goals |
| Missing intensity techniques | Drop set, rest-pause, cluster, etc. in set logging |
| Coarse muscle labels (“shoulders”) | **Muscle emphasis** (e.g. lateral vs anterior vs rear delt) |

**North star:** Build and log serious workouts on a phone at the gym — fast, precise, and explainable.

---

## 2. Personas

| Persona | Needs |
|---------|--------|
| **You (advanced)** | Full catalog, intensity techniques, muscle emphasis, AI program changes, timers + sound |
| **Friend/family (simpler)** | Clear UI, ready templates, last weight used, less jargon |

Both use **mobile web** at the gym (responsive, mobile-first).

---

## 3. Product pillars

1. **Rich exercise catalog** — quantity + custom exercises  
2. **Muscle emphasis** — primary/secondary focus, not only body-part buckets  
3. **Form guidance** — cues, angles, optional media  
4. **AI program builder** — create/regenerate from user goals + muscle map  
5. **Intensity techniques** — first-class in set logging  
6. **Gym-ready UX** — large taps, rest/work timers, **sound alerts**  

---

## 4. Domain notes — muscle emphasis (critical)

Exercises must encode **which part of the muscle** they emphasize. Examples:

| Exercise | Primary emphasis |
|----------|------------------|
| Lateral raise | Lateral deltoid |
| Front raise | Anterior deltoid |
| Reverse fly / rear delt fly | Posterior deltoid |

Suggested fields per exercise (for filters + AI prompts later):

- `primaryMuscle` (coarse, for browsing)
- `primaryEmphasis[]` / `secondaryEmphasis[]` (e.g. `deltoid_lateral`) — a list, since some movements have no single dominant target
- `equipment`
- `trackingMode` (`reps_weight` | `time` | `distance` …)
- `formCues` (angle, grip, “chest vs triceps” notes)

**Why it matters for AI:** When the user says “build a V-taper” or “focus rear delts”, the model needs structured emphasis data — not only “shoulders”.

**Where emphasis comes from:** no public dataset provides it at this granularity, so it is filled through the AI-assisted entry flow and confirmed by the curator before the exercise exists at all. See [DOMAIN_SPEC.md](./DOMAIN_SPEC.md) decisions 5.14, 5.15, and 5.17.

---

## 5. Feature backlog

Edit the checkboxes and `status` as you decide.

### Legend

- [ ] not decided / not done  
- [x] confirmed for that phase  

---

### 5.1 MVP

| Feature | Status | Problem it solves | User value | Notes |
|---------|--------|-------------------|------------|-------|
| [ ] Account sign-in (individual) | `mvp` | Multi-user (you + family) | Private data per person | No social |
| [ ] User profile (gender, birth date, body weight, experience) | `mvp` | Generic programs | Training scaled to the person | Feeds AI generator; sensitive data |
| [ ] Exercise catalog (browse/filter) | `mvp` | Free apps lack options | Find what you actually train | Starts empty; grows only with reviewed exercises |
| [ ] AI-assisted exercise entry (curator only) | `mvp` | Filling 8 fields by hand does not scale | Type a name, review proposed fields | Gemini proposes, curator approves; grounded on a vendored reference dataset |
| [ ] Bilingual search (EN + pt-BR names) | `mvp` | Names differ by language | Search "supino" or "bench press" | Also prevents duplicate entries |
| [ ] Custom exercises | `mvp` | Catalog gaps | Never blocked by missing moves | Members: private; curator: global |
| [ ] Workout templates / routines | `mvp` | Rebuild plans from scratch | Reuse Push/Pull/Legs etc. | |
| [ ] Active workout logging (sets: weight, reps) | `mvp` | Core tracker job | Record the session | Mobile-first |
| [ ] Basic intensity technique on a set | `mvp` | Paid apps gate this | Log drop set / rest-pause at least | Expand in v1 |
| [ ] Rest timer + **sound alert** | `mvp` | Watching the clock | Know when to start next set without staring | See audio limits below |
| [ ] Work timer (timed moves) + **sound alert** | `mvp` | Plank, cardio intervals | Know when hold/interval ends | User sets duration |
| [ ] Last weight / reps suggestion | `mvp` | Slow logging | Faster sets | From last session |
| [ ] Simple history list | `mvp` | “What did I do?” | Review past workouts | Charts in v1 |
| [ ] Responsive mobile-first UI | `mvp` | Gym = phone | Usable between sets | shadcn + Tailwind |

---

### 5.2 v1

| Feature | Status | Problem it solves | User value | Notes |
|---------|--------|-------------------|------------|-------|
| [ ] Favorites — exercises | `v1` | Hard to find go-to moves | Quick access | |
| [ ] Favorites — workouts/templates | `v1` | Lost “good” programs | Re-run a saved favorite | Archive + recover |
| [ ] Progress charts (volume, load, PRs) | `v1` | Numbers without insight | Visual progress | Recharts |
| [ ] Richer intensity techniques | `v1` | Incomplete intensity toolkit | Cluster, myo-reps, etc. | List below |
| [ ] Form cues + execution links (YouTube / Instagram) | `v1` | Bad form / wrong emphasis | Safer, better stimulus | Multiple links per exercise, provider tracked; own hosting later |
| [ ] Smart exercise swap (with reason) | `v1` | Injury, equipment busy, dislike | Same emphasis, different move | Reason sets scope: session-only vs permanent avoid list |
| [ ] AI generate / regenerate program | `v1` | Manual wipe & rebuild | “Legs 4x/week”, “V-taper” → new plan | Prompt includes emphasis map |
| [ ] Split presets + goal overrides | `v1` | Blank-page planning | PPL / UL / full body + goals | |
| [ ] Gym mode UI (large type, contrast) | `v1` | Small UI in gym lighting | Glanceable | |
| [ ] More sound cues in workout flow | `v1` | Eyes off screen | Hands-free pacing | Rest end, work end, optional others |
| [ ] Light PWA (Add to Home Screen) | `v1` | Slow browser open | App-like icon | **No offline** in this phase |

---

### 5.3 Later / optional

| Feature | Status | Problem it solves | User value | Notes |
|---------|--------|-------------------|------------|-------|
| [ ] Offline logging + sync | `later` | Bad gym Wi‑Fi | Log without network | See complexity note below |
| [ ] Hosted GIF/video library (S3) | `later` | External links break | Reliable demos | Cost/quota careful |
| [ ] Wake Lock “keep screen on” during workout | `later` | Browser kills timers | More reliable timers/sound | Complements audio limits |
| [ ] GitHub Actions CI on push | `later` | Forgotten local tests | Auto test on GitHub | Free tier |
| [ ] Pre-commit hooks (Husky) | `later` | Push without tests | Force lint/test | Add after habit exists |

---

### 5.4 Cut / out of scope (for now)

| Feature | Status | Why cut |
|---------|--------|---------|
| Share template with friends | `cut` | Explicitly not wanted |
| Social feed / followers | `cut` | Not a social product |
| Paid marketplace | `cut` | $0 product; no commerce |
| Native iOS/Android apps | `cut` | Web first; explainable scope |
| Wearables / Apple Watch | `cut` | Scope creep |
| Guaranteed sound with phone **fully locked** in pocket | `cut` (as promise) | Web browsers restrict background audio — see below |

---

## 6. Sound alerts — product rules

**Intent:** User can keep the phone in pocket / look away and still hear when to act (e.g. rest finished → start the set), especially with headphones.

**Events (minimum):**

1. Rest timer finished → “start next set/exercise”  
2. Work/duration timer finished → “stop / next”  
3. (Optional later) other workout milestones  

**Honest web limits (document for users later):**

| Situation | Realistic? |
|-----------|------------|
| App open, screen on (or Wake Lock) | Yes — target for MVP/v1 |
| App open, screen off briefly | Often ok; OS-dependent |
| Phone locked / tab fully backgrounded | **Unreliable** on mobile web |

We optimize for gym use with the workout screen active. We do **not** market “works 100% while locked like a native app”.

---

## 7. Intensity techniques (catalog idea)

Mark which ones you want in MVP vs v1:

- [ ] Drop set — `mvp` candidate  
- [ ] Rest-pause — `mvp` candidate  
- [ ] Cluster set — `v1`  
- [ ] Myo-reps — `v1` / `idea`  
- [ ] Superset / giant set linking — `idea`  
- [ ] Tempo (eccentric emphasis) — `idea`  
- [ ] _(add your own)_  

---

## 8. AI workout generation — inputs we care about

When building the AI feature, the prompt/context should include things like:

- **User profile: gender, age (from birth date), body weight, experience level**  
- Goal (hypertrophy, V-taper, strength, fat loss…)  
- Days/week and session length  
- Equipment available  
- Focus muscles / **emphasis** (e.g. rear delt, upper chest, glute med…)  
- Injuries / avoid list  
- Prefer favorites or exclude hated exercises  
- Intensity technique preferences  

Output: full template(s) the user can edit, favorite, and run — not a black box they cannot change.

---

## 9. Offline — decision note

Offline is **not** required for MVP/v1.

| Level | Meaning | Difficulty | Our call |
|-------|---------|------------|----------|
| A | Home screen icon only (light PWA) | Low | OK in v1 |
| B | Cache app shell offline | Medium | `later` |
| C | Log sets offline + sync + conflict handling | High | `later` only if gym network is a real pain |

**Mentor recommendation:** skip C until the core product works. Revisit if you often lose signal mid-workout.

---

## 10. PWA (short)

A **PWA** is still a website, but the phone can add it to the home screen and open it more like an app.  
We use it for convenience — **not** for offline-first (unless you later promote offline from `later`).

---

## 11. Your edit space

Add / change ideas below:

```
- [ ] Feature name — status: idea — notes:
- [ ] Feature name — status: idea — notes:
```

---

**Related:** [TECH_STACK.md](./TECH_STACK.md) · [DOMAIN_SPEC.md](./DOMAIN_SPEC.md) (data model) · [DESIGN_SPEC.md](./DESIGN_SPEC.md) (UI / UX)
