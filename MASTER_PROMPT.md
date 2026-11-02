# Master prompt — paste this into Claude Code

Paste everything between the two lines into Claude Code, from the project folder (the one containing `CLAUDE.md` and `assets/`).

---

You are building my personal course web app, **Game Design: Zero to Hero**. Act as a senior front-end engineer and game-design-literate product designer.

## Before anything else
1. Read `CLAUDE.md` fully. Its stack, folder structure, rules and workflow are binding for every step.
2. Read `assets/media.json` and list the folders in `assets/`. This folder is the **only** source of media (videos, diagrams, papers, links). Every lesson fetches media from it by `id`. Never hard-code URLs and never invent media; if something is missing, stop and ask me to add it to `assets/`.
3. Confirm in 3–5 lines that you've read both, then show me the step list below with Step 1 marked as next.

## How we work
- We do **one step at a time**. For each step:
  1. Write a short plan (files you'll create, dependencies and why, how you'll test it).
  2. **Stop and wait for my "go".**
  3. Build it. Run typecheck, lint, tests and build. Fix every failure.
  4. Commit with a descriptive message.
  5. Report: what you built, how I can see it (`npm run dev` route), test results, and anything you need from me.
  6. **Stop.** Don't start the next step until I say "next".
- If I give feedback, apply it before moving on.
- Keep `CLAUDE.md` updated if we agree on a new rule.

## The steps

**Step 1 — Scaffold.**
Run `npm view react version` and use that version. Set up Vite + React 19 + TypeScript (strict) + MDX + React Compiler + Zustand + Vitest + React Testing Library + Playwright + ESLint + Prettier, and a GitHub Actions CI workflow (typecheck, lint, test, build). Create the folder structure from `CLAUDE.md` with empty index files. Add a prebuild script that copies `assets/images/` into `public/assets/images/`.

**Step 2 — Media layer.**
Build `shared/lib/media.ts`: a typed loader and Zod (or hand-written) schema for `assets/media.json`, plus `getMedia(id)` and `getMediaForLevel(level)`. Build the `<Media id="…" />` component that renders `youtube` (youtube-nocookie, lazy), `link` and `pdf` (link cards) and `diagram` (img with alt). Add `npm run media:check`, a Node script that checks every `youtube` id with YouTube's oEmbed endpoint and prints a pass/fail table. Unit-test the loader; make an unknown id fail loudly in dev.

**Step 3 — Course shell.**
Build the typed `content/course.manifest.ts` for all 7 levels (titles and module names from the syllabus at the end of this prompt), routing (`/`, `/level/:n`, `/level/:n/:lesson`), a level map home screen, and Level 0 with 2 placeholder lessons. Lazy-load each level.

**Step 4 — Game layer.**
Build `features/progress`: XP, level-ups, badges, a skill-tree map, the `ProgressStorage` interface with a localStorage adapter (swappable later), XP bar, level-up screen with juice that respects `prefers-reduced-motion`. Test the scoring logic.

**Step 5 — First toy: Juice Slider.**
In `features/toys/juice-slider`: one button whose feedback (screen shake, particles, sound, squash-and-stretch, rolling number) is turned up by sliders. Implements `ToyProps`, is keyboard-playable, and calls `onComplete` after the learner has tried each slider. Link it to the `juice-it-or-lose-it` and `art-of-screenshake` media.

**Step 6 — Level 0 content.**
Write the two Level 0 MDX lessons in kishōtenketsu form: **play** (a toy first), **tweak**, **twist** (a surprise that breaks an assumption), **name** (the principle). Lesson 1: "What is a game" using `core-loop-diagram`. Lesson 2: "The MDA framework" using `mda-diagram` and `mda-paper`. Pull every media item from `assets/media.json` by id.

**Step 7 — Quiz.**
Build `features/quiz`: retryable multiple-choice where a wrong answer unlocks an explanation (fair failure, like Hades), and correct answers award XP. Write a 5-question Level 0 quiz.

**Step 8 — Playtest checkpoint.**
Stop building. Give me a short playtest script (3 tasks, what to watch for, 3 questions to ask after) so I can test Level 0 with 3 people. When I paste their notes, propose the changes as a prioritised list and wait for my approval.

**Step 9+ — Repeat per level.**
For Levels 1 → 6, repeat Steps 5–8: one new toy, the level's MDX lessons using that level's media from `assets/media.json`, the level quiz, then a playtest checkpoint. Suggested toys:
- Level 1: Core-loop builder (drag Act → Feedback → Reward → Upgrade and play the result)
- Level 2: Flow channel (adjust difficulty and watch a simulated player land in anxiety, flow or boredom)
- Level 3: Kishōtenketsu level builder (4 tiles, one mechanic, playable)
- Level 4: 3-rule chemistry sandbox (fire, water, grass on a grid)
- Level 5: Economy tuner (prices and drop rates vs. player happiness, with a dark-pattern warning)
- Level 6: Kill-your-darlings board (prototype 3 ideas, score them, kill 2)

## Syllabus (for the manifest)
- **Level 0 — Press Start:** What is a game · The MDA framework · 8 kinds of fun · Deconstructing a game you love
- **Level 1 — Core Loop:** Verbs and core loops · Game feel and juice · Feedback, timing and responsiveness · Paper prototyping
- **Level 2 — The Player's Mind:** Self-Determination Theory · Flow and the challenge/skill channel · Player types · Reward schedules · Loss aversion · Cognitive load · Designing for calm (cozy)
- **Level 3 — Challenge & Failure:** Kishōtenketsu level design · Teaching without tutorials · Difficulty curves and fairness · Failure loops and meta-progression · Roguelite structure
- **Level 4 — Systems & Worlds:** Systemic and multiplicative design · Emergent play and sandboxes · Environmental storytelling · Narrative design and choice · Game UI/UX and HUDs · Accessibility
- **Level 5 — Business & Live:** Game economies · Ethics and dark patterns · Multiplayer and social dynamics · Mastery and competitive design · Live-service · UGC and creator platforms · AI in the pipeline
- **Level 6 — Ship It:** Playtesting like Valve · Iteration and killing ideas · The game design doc · Portfolio and pitching · Game jam

Start now with "Before anything else", then stop and wait for me.

---
