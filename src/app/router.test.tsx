import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';
import { renderApp, scrollToLessonEnd } from '../test/renderApp';

describe('home', () => {
  it('shows all 7 levels on the level map', async () => {
    const { screen } = await renderApp('/');
    const stops = screen.getByRole('list', { name: 'Level map' }).getByRole('link');
    await expect.element(stops.first()).toMatchTextContent(/Press Start/);
    expect(stops.elements()).toHaveLength(7);
    await expect.element(stops.first()).toMatchTextContent(/2 lessons/);
    await expect.element(stops.last()).toMatchTextContent(/Ship It/);
    await expect.element(stops.last()).toMatchTextContent(/Coming soon/);
  });

  it('opens a level from the map', async () => {
    const { screen, router } = await renderApp('/');
    await screen
      .getByRole('list', { name: 'Level map' })
      .getByRole('link', { name: /Level 0.*Press Start/ })
      .click();
    await expect
      .element(screen.getByRole('heading', { level: 1, name: 'Press Start' }))
      .toBeVisible();
    expect(router.state.location.pathname).toBe('/level/0');
  });
});

describe('level page', () => {
  it('lists modules, links lessons and shows the boss fight', async () => {
    const { screen } = await renderApp('/level/0');
    const mda = screen.getByRole('region', { name: 'The MDA framework' });
    await expect
      .element(mda.getByRole('link', { name: 'The MDA framework' }))
      .toHaveAttribute('href', '/level/0/mda-framework');
    await expect
      .element(screen.getByRole('region', { name: '8 kinds of fun' }))
      .toMatchTextContent(/Coming soon/);
    await expect
      .element(screen.getByRole('region', { name: 'Boss fight' }))
      .toMatchTextContent(/MDA teardown/);
  });
});

describe('lesson page', () => {
  it('renders the MDX lesson with its media', async () => {
    const { screen } = await renderApp('/level/0/what-is-a-game');
    await expect
      .element(screen.getByRole('heading', { level: 1, name: 'What is a game' }))
      .toBeVisible();
    await expect.element(screen.getByRole('heading', { level: 2, name: 'Twist' })).toBeVisible();
    await expect.element(screen.getByRole('img', { name: /Act, feedback, reward/ })).toBeVisible();
  });

  it('clicks through to the next lesson and back', async () => {
    const { screen, router } = await renderApp('/level/0/what-is-a-game');
    const nav = screen.getByRole('navigation', { name: 'Lesson' });
    await expect.element(nav.getByRole('link', { name: /Next/ })).toBeVisible();
    await expect.element(nav.getByRole('link', { name: /Previous/ })).not.toBeInTheDocument();

    await nav.getByRole('link', { name: /Next.*The MDA framework/ }).click();
    await expect
      .element(screen.getByRole('img', { name: /Mechanics produce dynamics/ }))
      .toBeVisible();
    expect(router.state.location.pathname).toBe('/level/0/mda-framework');

    await nav.getByRole('link', { name: /Previous.*What is a game/ }).click();
    await expect.element(screen.getByRole('img', { name: /Act, feedback, reward/ })).toBeVisible();
  });
});

describe('completing a lesson', () => {
  it('unlocks after reading to the end, then updates rank XP and badges', async () => {
    const { screen, store } = await renderApp('/level/0/what-is-a-game');
    const complete = screen.getByRole('button', { name: 'Complete lesson' });
    await expect.element(complete).toBeDisabled();
    await expect
      .element(complete)
      .toHaveAccessibleDescription('Read to the end to complete this lesson');

    await scrollToLessonEnd(screen);
    await expect.element(complete).toBeEnabled();
    await complete.click();

    await expect
      .element(screen.getByRole('progressbar', { name: 'XP to next rank' }))
      .toHaveAttribute('aria-valuenow', '50');
    await expect.element(page.getByText('Badge unlocked: First Steps')).toBeVisible();
    expect(store.getState().progress.completedLessons).toEqual(['0/what-is-a-game']);
  });

  it('ranks up with a focused dialog', async () => {
    const { screen } = await renderApp('/level/0/mda-framework', {
      xp: 60,
      completedLessons: ['0/what-is-a-game'],
    });
    await scrollToLessonEnd(screen);
    await screen.getByRole('button', { name: 'Complete lesson' }).click();

    await expect.element(page.getByRole('dialog', { name: /Rank 2 · Apprentice/ })).toBeVisible();
    await expect.element(page.getByRole('button', { name: 'Keep going' })).toHaveFocus();
  });
});

describe('progress', () => {
  it('shows saved progress on the level map and suggests the next lesson', async () => {
    const { screen } = await renderApp('/', { completedLessons: ['0/what-is-a-game'], xp: 50 });
    await expect
      .element(screen.getByRole('list', { name: 'Level map' }).getByRole('link').first())
      .toMatchTextContent('1 / 2 lessons');
    await expect
      .element(screen.getByRole('link', { name: /Continue.*The MDA framework/ }))
      .toHaveAttribute('href', '/level/0/mda-framework');
  });

  it('shows rank, badges and the skill tree on the progress page', async () => {
    const { screen } = await renderApp('/progress', {
      xp: 130,
      completedLessons: ['0/what-is-a-game'],
      badges: ['first-steps'],
    });
    await expect
      .element(screen.getByRole('heading', { level: 1, name: 'Rank 2 · Apprentice' }))
      .toBeVisible();
    const badges = screen.getByRole('listitem');
    await expect.element(badges.filter({ hasText: 'First Steps' })).toMatchTextContent(/Earned/);
    await expect.element(badges.filter({ hasText: 'Toy Box' })).toMatchTextContent(/Locked/);
    const level0 = screen.getByRole('region', { name: /Level 0 · Press Start/ });
    await expect
      .element(level0.getByRole('link', { name: /What is a game.*complete/ }))
      .toBeVisible();
    await expect
      .element(level0.getByRole('link', { name: /The MDA framework.*not started/ }))
      .toBeVisible();
  });
});

describe('not found', () => {
  it.each(['/nope', '/level/9', '/level/one', '/level/0/nope', '/level/1/what-is-a-game'])(
    '%s shows the 404 page',
    async (path) => {
      const { screen } = await renderApp(path);
      await expect
        .element(screen.getByRole('heading', { level: 1, name: 'Page not found' }))
        .toBeVisible();
    },
  );
});
