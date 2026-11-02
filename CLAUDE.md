# Game Design: Zero to Hero — project rules

A personal, gamified web course that teaches game design in 7 levels (Level 0 "Press Start" → Level 6 "Ship It").
Every lesson is a playable toy first and theory second. Build it like a senior engineer would.

## Stack
- React 19 (latest stable — run `npm view react version` before installing) + TypeScript (strict) + Vite
- MDX for lesson content
- React Compiler enabled — do not add manual useMemo / useCallback / React.memo
- State: Zustand store for progress/XP behind a `ProgressStorage` interface (localStorage adapter now; Supabase adapter later)
- Mini-games: React + canvas (Phaser only if a toy truly needs a game engine)
- Tests: Vitest (Node for logic, Browser Mode for components) + Playwright end-to-end. See "Tests" below.
- Lint/format: ESLint + Prettier. CI on every push (GitHub Actions): typecheck, lint, test, build

## Folder structure (feature-based)
```
src/
  app/                 # app shell, routing, providers
  features/
    lessons/           # lesson renderer, MDX components, navigation
    progress/          # XP, levels, badges, store + storage adapters
    toys/              # one folder per mini-game, each implements ToyProps
    quiz/              # retryable quizzes (wrong answers unlock explanations)
  shared/
    ui/                # design-system components (Button, Card, XPBar…)
    lib/               # pure utilities, no React
content/
  course.manifest.ts   # typed: levels → modules → lessons
  level-0/…            # .mdx lesson files
```

## Rules
- Content is separate from code: adding a lesson = new .mdx + manifest entry, never app-code changes.
- Every toy implements one contract: `type ToyProps = { onComplete: (result: ToyResult) => void }`.
- "Complete lesson" unlocks only after the lesson's toy calls `onComplete` (toys register with `useLessonActivity`), or, for lessons without a toy, once the reader reaches the end. Until then it is disabled with a hint.
- Player progression is called **Rank**; "Level" always means a course level. No hard locks: every level stays open, and the map highlights the recommended next lesson.
- Lazy-load each level with React.lazy + Suspense; toys load only when opened.
- Function components only. No `any`. No default exports except route/lesson entry points.
- Accessibility: every toy keyboard-playable; respect `prefers-reduced-motion` for all "juice" animations; WCAG AA contrast.
- Design tokens (colors, type, spacing) live in one theme file; no hard-coded colors in components.
- Pure game/scoring logic lives in `shared/lib` or the feature's `model/` folder and has unit tests.

## Course content reference
- `assets/docs/syllabus.md` holds the full syllabus: each level's studio and game anchors, boss-fight project, trends and research. Read the relevant level section before writing any lesson, toy or quiz for that level.

## Tests
- Pure logic tests are `*.test.ts` and run in Node.
- Anything that renders React (components, pages, lazy routes, toys) is `*.test.tsx` and runs in Vitest Browser Mode (Chromium via Playwright). Use `vitest-browser-react`'s `render`, `vitest/browser` `page` locators, and `await expect.element(...)` for anything async.
- No Testing Library, `user-event`, manual `act()` or jsdom (ESLint blocks `@testing-library/*`). Interact like a user: real clicks, keyboard and scrolling; no fakes for browser APIs. Use `commands.setReducedMotion(true)` to test reduced motion.
- `toHaveTextContent` is an exact match; use `toMatchTextContent` for partial text.
- Playwright (`e2e/`) covers full journeys against the production build.

## Media and assets (single source of truth)
- All media lives in `assets/` at the project root. `assets/media.json` lists every video, diagram, paper and link, grouped by level and module.
- Always fetch media from `assets/media.json` through one typed loader (`shared/lib/media.ts`); lessons reference media by `id` only (e.g. `<Media id="mda-diagram" />`). Never hard-code a URL or file path in a lesson or component.
- Copy `assets/images/` into `public/assets/images/` at build time (a Vite plugin or prebuild script), so the folder stays the only place I edit.
- `type: youtube` → embed with youtube-nocookie.com, lazy-loaded, with the title as an accessible label. `type: link` / `pdf` → render as a link card. `type: diagram` → `<img>` of the SVG with its `alt`.
- Items with `"verified": false` must pass `npm run media:check` (YouTube oEmbed lookup for each id) before they render; if a check fails, show the item as a link card and list it in the check output so I can fix the id.
- Never download or commit copyrighted game screenshots, trailers or art. Game visuals come only from official embeds or links listed in `media.json`.
- If a lesson needs media that isn't in `media.json`, stop and ask me to add it — don't invent URLs.

## Workflow
- Before any feature: write a short plan and wait for approval.
- Small commits, one feature each, with descriptive messages.
- After each feature: run typecheck, lint, tests and build; fix failures before moving on.
- Don't add a dependency without saying why.
- After each step's commit, push to origin and make sure CI passes.
