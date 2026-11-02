import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { beforeAll, describe, expect, it } from 'vitest';
import { course } from '@content/course.manifest';
import { allLessons, loadLesson } from '@features/lessons';
import { routes } from './router';

// Vitest compiles each .mdx on first import (over a second, past findBy* timeouts),
// so preload lessons once, as hovering a lesson link does in the app.
beforeAll(async () => {
  await Promise.all(allLessons(course).map(({ lesson }) => loadLesson(lesson)));
}, 30_000);

function renderAt(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  render(<RouterProvider router={router} />);
  return router;
}

describe('home', () => {
  it('shows all 7 levels on the level map', async () => {
    renderAt('/');
    const map = await screen.findByRole('list', { name: 'Level map' });
    const stops = within(map).getAllByRole('link');
    expect(stops).toHaveLength(7);
    expect(stops[0]).toHaveTextContent('Press Start');
    expect(stops[0]).toHaveTextContent('2 lessons');
    expect(stops[6]).toHaveTextContent('Ship It');
    expect(stops[6]).toHaveTextContent('Coming soon');
  });

  it('opens a level from the map', async () => {
    const router = renderAt('/');
    await userEvent.click(await screen.findByRole('link', { name: /Level 0.*Press Start/ }));
    expect(router.state.location.pathname).toBe('/level/0');
    expect(await screen.findByRole('heading', { level: 1, name: 'Press Start' })).toBeVisible();
  });
});

describe('level page', () => {
  it('lists modules, links lessons and shows the boss fight', async () => {
    renderAt('/level/0');
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
    renderAt('/level/0/what-is-a-game');
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
    renderAt('/level/0/what-is-a-game');
    const nav = await screen.findByRole('navigation', { name: 'Lesson' });
    expect(within(nav).getByRole('link', { name: /Next.*The MDA framework/ })).toHaveAttribute(
      'href',
      '/level/0/mda-framework',
    );
    expect(within(nav).queryByRole('link', { name: /Previous/ })).not.toBeInTheDocument();
  });

  it('links a later lesson back to the one before it', async () => {
    renderAt('/level/0/mda-framework');
    const nav = await screen.findByRole('navigation', { name: 'Lesson' });
    expect(within(nav).getByRole('link', { name: /Previous.*What is a game/ })).toHaveAttribute(
      'href',
      '/level/0/what-is-a-game',
    );
  });
});

describe('not found', () => {
  it.each(['/nope', '/level/9', '/level/one', '/level/0/nope', '/level/1/what-is-a-game'])(
    '%s shows the 404 page',
    async (path) => {
      renderAt(path);
      expect(
        await screen.findByRole('heading', { level: 1, name: 'Page not found' }),
      ).toBeInTheDocument();
    },
  );
});
