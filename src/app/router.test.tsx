import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, describe, expect, it } from 'vitest';
import { course } from '@content/course.manifest';
import { allLessons, loadLesson } from '@features/lessons';
import { renderApp } from '../test/renderApp';

// Vitest compiles each lazy page and .mdx lesson on first import (over a second, past
// findBy* timeouts), so warm them once. Lessons preload as hovering a lesson link does.
beforeAll(async () => {
  await Promise.all([
    import('./routes/HomePage'),
    import('./routes/LevelPage'),
    import('./routes/LessonPage'),
    import('./routes/ProgressPage'),
    import('./routes/NotFoundPage'),
    ...allLessons(course).map(({ lesson }) => loadLesson(lesson)),
  ]);
}, 30_000);

const renderAt = async (path: string) => (await renderApp(path)).router;

describe('home', () => {
  it('shows all 7 levels on the level map', async () => {
    await renderAt('/');
    const map = await screen.findByRole('list', { name: 'Level map' });
    const stops = within(map).getAllByRole('link');
    expect(stops).toHaveLength(7);
    expect(stops[0]).toHaveTextContent('Press Start');
    expect(stops[0]).toHaveTextContent('2 lessons');
    expect(stops[6]).toHaveTextContent('Ship It');
    expect(stops[6]).toHaveTextContent('Coming soon');
  });

  it('opens a level from the map', async () => {
    const router = await renderAt('/');
    const map = await screen.findByRole('list', { name: 'Level map' });
    await userEvent.click(within(map).getByRole('link', { name: /Level 0.*Press Start/ }));
    expect(router.state.location.pathname).toBe('/level/0');
    expect(await screen.findByRole('heading', { level: 1, name: 'Press Start' })).toBeVisible();
  });
});

describe('level page', () => {
  it('lists modules, links lessons and shows the boss fight', async () => {
    await renderAt('/level/0');
    const mda = await screen.findByRole('region', { name: 'The MDA framework' });
    expect(within(mda).getByRole('link', { name: 'The MDA framework' })).toHaveAttribute(
      'href',
      '/level/0/mda-framework',
    );
    expect(screen.getByRole('region', { name: '8 kinds of fun' })).toHaveTextContent('Coming soon');
    expect(screen.getByRole('region', { name: 'Boss fight' })).toHaveTextContent('MDA teardown');
  });
});

describe('lesson page', () => {
  it('renders the MDX lesson with its media', async () => {
    await renderAt('/level/0/what-is-a-game');
    expect(
      await screen.findByRole('heading', { level: 1, name: 'What is a game' }),
    ).toBeInTheDocument();
    expect(await screen.findByRole('heading', { level: 2, name: 'Twist' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /Act, feedback, reward/ })).toBeInTheDocument();
  });

  // Clicking through lessons is covered by Playwright (e2e/course.spec.ts). In jsdom, a
  // lesson-to-lesson transition intermittently never commits after certain earlier tests,
  // though the same click works in a real browser, so here we check the link targets.
  it('links the first lesson forward only', async () => {
    await renderAt('/level/0/what-is-a-game');
    const nav = await screen.findByRole('navigation', { name: 'Lesson' });
    expect(within(nav).getByRole('link', { name: /Next.*The MDA framework/ })).toHaveAttribute(
      'href',
      '/level/0/mda-framework',
    );
    expect(within(nav).queryByRole('link', { name: /Previous/ })).not.toBeInTheDocument();
  });

  it('links a later lesson back to the one before it', async () => {
    await renderAt('/level/0/mda-framework');
    const nav = await screen.findByRole('navigation', { name: 'Lesson' });
    expect(within(nav).getByRole('link', { name: /Previous.*What is a game/ })).toHaveAttribute(
      'href',
      '/level/0/what-is-a-game',
    );
  });
});

describe('progress', () => {
  it('shows saved progress on the level map and suggests the next lesson', async () => {
    await renderApp('/', { completedLessons: ['0/what-is-a-game'], xp: 50 });
    const map = await screen.findByRole('list', { name: 'Level map' });
    expect(within(map).getAllByRole('link')[0]).toHaveTextContent('1 / 2 lessons');
    expect(screen.getByRole('link', { name: /Continue.*The MDA framework/ })).toHaveAttribute(
      'href',
      '/level/0/mda-framework',
    );
  });

  it('shows rank, badges and the skill tree on the progress page', async () => {
    await renderApp('/progress', {
      xp: 130,
      completedLessons: ['0/what-is-a-game'],
      badges: ['first-steps'],
    });
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Rank 2 · Apprentice' }),
    ).toBeInTheDocument();
    expect(screen.getByText('First Steps').closest('li')).toHaveTextContent('Earned');
    expect(screen.getByText('Toy Box').closest('li')).toHaveTextContent('Locked');
    const level0 = screen.getByRole('region', { name: /Level 0 · Press Start/ });
    expect(within(level0).getByRole('link', { name: /What is a game, complete/ })).toBeVisible();
    expect(
      within(level0).getByRole('link', { name: /The MDA framework, not started/ }),
    ).toBeVisible();
  });
});

describe('not found', () => {
  it.each(['/nope', '/level/9', '/level/one', '/level/0/nope', '/level/1/what-is-a-game'])(
    '%s shows the 404 page',
    async (path) => {
      await renderAt(path);
      expect(
        await screen.findByRole('heading', { level: 1, name: 'Page not found' }),
      ).toBeInTheDocument();
    },
  );
});
