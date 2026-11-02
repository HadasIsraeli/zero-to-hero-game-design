// Typed course outline: levels → modules → lessons.
// Adding a lesson = a new .mdx file + one entry below. No app code changes.
// Level details come from assets/docs/syllabus.md.
import type { MDXContent } from 'mdx/types';

export type Lesson = {
  /** URL segment: /level/:n/:slug */
  slug: string;
  title: string;
  /** Code-split import of the lesson's .mdx file. */
  load: () => Promise<{ default: MDXContent }>;
};

export type Module = {
  title: string;
  lessons: Lesson[];
};

export type Level = {
  level: number;
  title: string;
  theme: string;
  /** Studios and games the level is built around. */
  anchors: string;
  /** The project that proves the level's skill. */
  bossFight: string;
  modules: Module[];
};

export type Course = {
  title: string;
  levels: Level[];
};

const module = (title: string, lessons: Lesson[] = []): Module => ({ title, lessons });

export const course: Course = {
  title: 'Game Design: Zero to Hero',
  levels: [
    {
      level: 0,
      title: 'Press Start',
      theme: 'What a game is',
      anchors: 'Minecraft vs. Balatro as opposite ends',
      bossFight: 'A one-page "MDA teardown" of a favourite game',
      modules: [
        module('What is a game', [
          {
            slug: 'what-is-a-game',
            title: 'What is a game',
            load: () => import('./level-0/what-is-a-game.mdx'),
          },
        ]),
        module('The MDA framework', [
          {
            slug: 'mda-framework',
            title: 'The MDA framework',
            load: () => import('./level-0/mda-framework.mdx'),
          },
        ]),
        module('8 kinds of fun'),
        module('Deconstructing a game you love'),
      ],
    },
    {
      level: 1,
      title: 'Core Loop',
      theme: 'The engine of play',
      anchors: 'Balatro (juice), Valve (prototype week one)',
      bossFight: 'A prototype of one verb, juiced up',
      modules: [
        module('Verbs and core loops'),
        module('Game feel and juice'),
        module('Feedback, timing and responsiveness'),
        module('Paper prototyping'),
      ],
    },
    {
      level: 2,
      title: "The Player's Mind",
      theme: 'Psychology',
      anchors: 'FromSoftware (competence), Hades (relatedness), the cozy trend',
      bossFight: 'A motivation map: score 3 games on autonomy, competence and relatedness',
      modules: [
        module('Self-Determination Theory'),
        module('Flow and the challenge/skill channel'),
        module('Player types'),
        module('Reward schedules'),
        module('Loss aversion'),
        module('Cognitive load'),
        module('Designing for calm (cozy)'),
      ],
    },
    {
      level: 3,
      title: 'Challenge & Failure',
      theme: 'Difficulty, learning and progression',
      anchors: 'Nintendo, FromSoftware, Hades',
      bossFight: 'A 4-beat level that teaches one mechanic with no text',
      modules: [
        module('Kishōtenketsu level design'),
        module('Teaching without tutorials'),
        module('Difficulty curves and fairness'),
        module('Failure loops and meta-progression'),
        module('Roguelite structure'),
      ],
    },
    {
      level: 4,
      title: 'Systems & Worlds',
      theme: 'Emergence, narrative and UX',
      anchors: 'Zelda: BotW/TotK, Minecraft, FromSoftware, Clair Obscur',
      bossFight: 'A 3-rule "chemistry" system with 5 logged emergent interactions',
      modules: [
        module('Systemic and multiplicative design'),
        module('Emergent play and sandboxes'),
        module('Environmental storytelling'),
        module('Narrative design and choice'),
        module('Game UI/UX and HUDs'),
        module('Accessibility'),
      ],
    },
    {
      level: 5,
      title: 'Business & Live',
      theme: 'Economies, multiplayer and trends',
      anchors: 'Riot, Supercell, Roblox/Fortnite, GDC 2026 AI data',
      bossFight: 'Pitch a free-to-play concept with an ethical monetisation plan',
      modules: [
        module('Game economies'),
        module('Ethics and dark patterns'),
        module('Multiplayer and social dynamics'),
        module('Mastery and competitive design'),
        module('Live-service'),
        module('UGC and creator platforms'),
        module('AI in the pipeline'),
      ],
    },
    {
      level: 6,
      title: 'Ship It',
      theme: 'Process and career',
      anchors: 'Valve, Supercell, the Blue Prince case study',
      bossFight: 'A 48-hour solo jam game, a playtest report and a portfolio case study',
      modules: [
        module('Playtesting like Valve'),
        module('Iteration and killing ideas'),
        module('The game design doc'),
        module('Portfolio and pitching'),
        module('Game jam'),
      ],
    },
  ],
};
