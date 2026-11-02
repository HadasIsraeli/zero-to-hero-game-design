import { describe, expect, it } from 'vitest';
import { commands, page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { testCourse } from '../model/fixtures';
import { emptyProgress } from '../model/state';
import { ProgressProvider } from '../ProgressProvider';
import { memoryAdapter } from '../storage/memoryAdapter';
import { createProgressStore } from '../store';
import { LevelUpDialog } from './LevelUpDialog';

async function renderAndRankUp() {
  const storage = memoryAdapter({ ...emptyProgress(), xp: 60 });
  const store = createProgressStore({ storage, course: testCourse });
  await store.getState().hydrate();
  const screen = await render(
    <ProgressProvider storage={storage} course={testCourse} store={store}>
      <button type="button">Somewhere else</button>
      <LevelUpDialog />
    </ProgressProvider>,
  );
  await screen.getByRole('button', { name: 'Somewhere else' }).click();
  store.getState().completeLesson('0/a1'); // 60 + 50 → rank 2
  return { screen, store };
}

describe('<LevelUpDialog>', () => {
  it('opens on a rank-up as a focused modal naming the new rank', async () => {
    await renderAndRankUp();
    await expect.element(page.getByRole('dialog', { name: /Rank 2 · Apprentice/ })).toBeVisible();
    await expect.element(page.getByRole('button', { name: 'Keep going' })).toHaveFocus();
    await expect.element(page.getByTestId('particle-burst')).toBeInTheDocument();
  });

  it('closes on Escape, clears the celebration and returns focus', async () => {
    const { store } = await renderAndRankUp();
    await expect.element(page.getByRole('dialog')).toBeVisible();
    await userEvent.keyboard('{Escape}');

    await expect.element(page.getByRole('dialog')).not.toBeInTheDocument();
    expect(store.getState().celebrations.some((c) => c.kind === 'rank-up')).toBe(false);
    await expect.element(page.getByRole('button', { name: 'Somewhere else' })).toHaveFocus();
  });

  it('closes from its button', async () => {
    await renderAndRankUp();
    await page.getByRole('button', { name: 'Keep going' }).click();
    await expect.element(page.getByRole('dialog')).not.toBeInTheDocument();
  });

  it('skips the particle burst under reduced motion but still celebrates', async () => {
    await commands.setReducedMotion(true);
    await renderAndRankUp();
    await expect.element(page.getByRole('dialog', { name: /Rank 2/ })).toBeVisible();
    await expect.element(page.getByTestId('particle-burst')).not.toBeInTheDocument();
  });
});
