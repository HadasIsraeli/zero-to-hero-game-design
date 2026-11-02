# Game Design: Zero to Hero — Research & Syllabus

> Reference for writing lessons. Stack and build rules live in `CLAUDE.md`; media lives in `assets/media.json`. If this file and `CLAUDE.md` ever disagree, `CLAUDE.md` wins.

## Summary

The syllabus is a 7-level journey (Level 0 "Press Start" to Level 6 "Ship It"), and every module is anchored to a real studio practice or a landmark game rather than abstract theory.

The research produced one thesis that shapes the whole course: **great studios design systems and test them on real players, rather than designing "fun" directly.** Nintendo teaches one mechanic per level, Valve playtests from week one, FromSoftware makes failure feel fair, Supercell kills good games to find great ones, and Riot builds for mastery over years. The five games show what those practices produce: emergent systems (Zelda, Minecraft), failure as story (Hades), feedback as the product (Balatro), and genre remixing (Clair Obscur).

Every lesson is a playable toy first, theory second.

## The 5 studios

Each studio was chosen because it owns one transferable design practice, not just hit games. Together they cover level design, process, difficulty, business, and live-service.

| Studio | Signature practice | What the course borrows | Evidence |
| --- | --- | --- | --- |
| **Nintendo** | Kishōtenketsu level design: introduce a mechanic, develop it, twist it, conclude, then drop it | The 4-beat level template; "teach without tutorials" | Koichi Hayashida adapted the 4-panel comic structure for Mario levels ([MCV](https://www.mcvuk.com/development/video-nintendos-level-design-secrets-in-four-steps)) |
| **Valve** | Playtesting from week one; design as hypotheses tested on real players | The build → test → change loop as a weekly habit | Portal's team tested a half-built room in its first week; GLaDOS was added because testers thought the game was a tutorial ([GMTK](https://gmtk.substack.com/p/valves-secret-weapon)) |
| **FromSoftware** | Difficulty as meaning: hard but fair, learned through consequence, story told through the environment | Fair-failure checklist; environmental storytelling | Miyazaki says the goal is overcoming adversity, not difficulty for its own sake ([PlayStation Blog](https://blog.playstation.com/2022/01/28/an-interview-with-fromsoftwares-hidetaka-miyazki/)) |
| **Supercell** | Tiny autonomous "cells" that prototype fast and kill most games, even good ones | Prototype fast, set a kill bar, soft-launch thinking | Teams decide to kill their own games; most never ship ([GDC Vault](https://gdcvault.com/browse/gdc-18/play/1025004/), [Fast Company](https://www.fastcompany.com/90777774/exclusive-supercell-ceo-ilkka-paananen-clash-of-clans-10th-anniversary)) |
| **Riot Games** | Player-focused design for mastery and "designing for multiple minds" in multiplayer | Mastery curves, social dynamics, live-service ethics | Riot's stated mission is to be the most player-focused game company ([Riot](https://www.riotgames.com/en/who-we-are)); Player Dynamics talk ([Game Developer](https://gamedeveloper.com/design/video-behind-riot-games-player-dynamics-design-philosophy)) |

## The 5 games

The games span AAA, indie, solo-dev and a debut studio, so the learner sees that great design is not a budget question.

| Game | Core design lesson | Key idea to teach | Evidence |
| --- | --- | --- | --- |
| **Zelda: Breath of the Wild / Tears of the Kingdom** (Nintendo) | Systems over scripts | "Multiplicative gameplay": build a system that makes fun things happen; a chemistry engine with 3 rules for elements and materials | [Den of Geek](https://www.denofgeek.com/games/tears-of-the-kingdoms-developers-share-a-lesson-more-studios-should-follow/), [GamesBeat](https://gamesbeat.com/the-legend-of-zelda-breath-of-the-wild-makes-chemistry-just-as-important-as-physics/) |
| **Minecraft** (Mojang) | Emergence and player creativity | Simple rules + procedural world = endless player-made goals; tension between building and surviving | [Game Design Skills](https://gamedesignskills.com/game-design/minecraft/) |
| **Hades** (Supergiant) | Failure as progression | Every death advances story and permanent upgrades, so there is no "game over" moment | [Tom's Guide](https://www.tomsguide.com/uk/features/hades-exclusive-interview-supergiant) |
| **Balatro** (LocalThunk, solo) | Feedback is the product; know who your game is for | "Juice" turns math into thrill; the deliberate choice to hide the score preview keeps the suspense | [GMTK](https://gmtk.substack.com/p/balatros-cursed-design-problem); 2025 GDCA Game of the Year |
| **Clair Obscur: Expedition 33** (Sandfall) | Remixing a genre | "Reactive turn-based": strategy on your turn, real-time dodge and parry on theirs | [PlayStation Blog](https://blog.playstation.com/?p=394441); 2026 GDCA Game of the Year with 5 awards ([Thumbsticks](https://www.thumbsticks.com/clair-obscur-expedition-33-triumphs-at-the-2026-gdc-awards/)) |

Capstone case study: *Blue Prince* won Best Design at the 2026 GDCAs — a strong example of puzzle and information design ([Nintendo Wire](https://nintendowire.com/news/2026/03/13/blue-prince-wins-best-design-at-game-developers-choice-awards-2026/)).

## What's new and trending (2026)

| Trend | What's happening | Where it lands in the course |
| --- | --- | --- |
| **Creator economy / UGC** | Roblox and Fortnite paid creators over $1.5B in 2025; a Roblox game (Grow a Garden) peaked near 16M concurrent players ([Taylor Wessing](https://www.taylorwessing.com/en/insights-and-events/insights/2026/03/games-industry-in-2026-and-beyond)) | Level 5: designing for creators |
| **Generative AI, contested** | 36% of industry pros use gen-AI tools, yet 52% say it harms the industry, up from 30% a year earlier ([GDC 2026 State of the Industry](https://www.businesswire.com/news/home/20260129438528/en/2026-State-of-the-Game-Industry-Report-Reveals-Widening-Effect-of-Layoffs-Broader-Perspectives-on-Generative-AI-Unionization-Tariffs-and-More)) | Level 5: AI as a prototyping tool, plus the ethics debate |
| **Narrative roguelites** | Hades-style meta-progression and characterful dialogue spread across the genre; Hades II reached 1.0 in Sept 2025 | Level 3: failure loops and meta-progression |
| **Cozy and co-op** | Cozy sims are the fastest-growing Roblox genre in 2026 ([creation.dev](https://www.creation.dev/learn/what-roblox-game-mechanics-are-trending-2026), [CGMagazine](https://www.cgmagonline.com/articles/the-rise-of-cozy-games/)) | Level 2: designing for calm, short sessions |
| **Accessibility from day one** | Treated as core design rather than a pre-launch patch ([Yudiz](https://www.yudiz.com/insights/game-design-trends-2026/)) | Woven into every level; dedicated lesson in Level 4 |

## How the course itself plays

1. **Kishōtenketsu lessons (Nintendo).** Every lesson runs: play a toy (intro) → tweak it (develop) → a surprise that breaks your assumption (twist) → name the principle (conclude).
2. **Playtest checkpoints (Valve).** Each level ends with one real person playing your prototype while you watch silently, then three logged observations.
3. **Fair failure (FromSoftware, Hades).** Quizzes can be retried; wrong answers unlock an explanation, so failing still progresses you.
4. **Juice (Balatro).** XP counters roll, badges pop, a level-up screen plays. Feedback is part of the lesson.
5. **Self-Determination Theory as the compass.** Autonomy, competence and relatedness predict enjoyment and return play ([Ryan, Rigby & Przybylski, 2006](https://www.rochester.edu/warner/lida/wp-content/uploads/2022/11/02bfe513dd59366750000000.pdf)): choice of side quests (autonomy), visible skill trees (competence), a gallery of your own prototypes (relatedness).
6. **Kill your darlings (Supercell).** One assignment asks you to prototype three ideas and kill two.

## Syllabus: 7 levels, ~30 modules

Each level ends in a "boss fight": a small project that proves the skill. Estimated total: 10–12 weeks at 4–6 hours a week.

| Level | Theme | Modules | Studio / game anchor | Boss fight (project) |
| --- | --- | --- | --- | --- |
| **0 — Press Start** | What a game is | What is a game (rules, goals, feedback, voluntary play); the MDA framework; 8 kinds of fun; deconstructing a game you love | Minecraft vs. Balatro as opposite ends | One-page "MDA teardown" of a favourite game |
| **1 — Core Loop** | The engine of play | Verbs and core loops; game feel and juice; feedback, timing and responsiveness; paper prototyping | Balatro (juice), Valve (prototype week one) | Prototype of one verb, juiced up |
| **2 — The Player's Mind** | Psychology | Self-Determination Theory; flow and the challenge/skill channel; player types (Bartle, Quantic Foundry); reward schedules; loss aversion; cognitive load; designing for calm (cozy) | FromSoftware (competence), Hades (relatedness), cozy trend | Motivation map: score 3 games on autonomy, competence, relatedness |
| **3 — Challenge & Failure** | Difficulty, learning, progression | Kishōtenketsu level design; teaching without tutorials; difficulty curves and fairness; failure loops and meta-progression; roguelite structure | Nintendo, FromSoftware, Hades | A 4-beat level that teaches one mechanic with no text |
| **4 — Systems & Worlds** | Emergence, narrative, UX | Systemic and multiplicative design; emergent play and sandboxes; environmental storytelling; narrative design and choice; game UI/UX and HUDs; accessibility | Zelda BotW/TotK, Minecraft, FromSoftware, Clair Obscur | A 3-rule "chemistry" system with 5 logged emergent interactions |
| **5 — Business & Live** | Economies, multiplayer, trends | Game economies and monetisation; ethics and dark patterns; multiplayer and social dynamics; mastery and competitive design; live-service; UGC and creator platforms; AI in the pipeline | Riot, Supercell, Roblox/Fortnite, GDC 2026 AI data | Pitch a free-to-play concept with an ethical monetisation plan |
| **6 — Ship It** | Process and career | Playtesting like Valve; iteration and killing ideas like Supercell; the game design doc (GDD); portfolio and pitching; game jam | Valve, Supercell, Blue Prince case study | 48-hour solo jam game + playtest report + portfolio case study |

Side quests (optional): genre deep-dives (roguelites, cozy sims, soulslikes, card games), tool tracks (Unity, Roblox Studio, Figma for game UI), and a design-history track.

**Default engine: Unity, learned from zero alongside the design.** Levels 0–1 add a short Unity on-ramp (editor tour, scenes and GameObjects, C# basics for one verb); from Level 1 on, every boss fight is built in Unity from a starter project, so design stays the focus. The Unity track lives outside the web app; the course links to it (see `unityTrack` in `assets/media.json`).
