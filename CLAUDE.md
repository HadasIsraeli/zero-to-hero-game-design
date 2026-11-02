# Game Design: Zero to Hero — project rules

A personal, gamified web course that teaches game design in 7 levels (Level 0 "Press Start" → Level 6 "Ship It").
Every lesson is a playable toy first and theory second. Build it like a senior engineer would.

## Stack
- React 19 (latest stable — run `npm view react version` before installing) + TypeScript (strict) + Vite
- MDX for lesson content
- React Compiler enabled — do not add manual useMemo / useCallback / React.memo
- State: Zustand store for progress/XP behind a `ProgressStorage` interface (localStorage adapter now; Supabase adapter later)
- Mini-games: React + canvas (Phaser only if a toy truly needs a game engine)
- Tests: Vitest + React Testing Library (logic), Playwright (one end-to-end path)
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
- Lazy-load each level with React.lazy + Suspense; toys load only when opened.
- Function components only. No `any`. No default exports except route/lesson entry points.
- Accessibility: every toy keyboard-playable; respect `prefers-reduced-motion` for all "juice" animations; WCAG AA contrast.
- Design tokens (colors, type, spacing) live in one theme file; no hard-coded colors in components.
- Pure game/scoring logic lives in `shared/lib` or the feature's `model/` folder and has unit tests.

## Course content reference
- `assets/docs/syllabus.md` holds the full syllabus: each level's studio and game anchors, boss-fight project, trends and research. Read the relevant level section before writing any lesson, toy or quiz for that level.

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
