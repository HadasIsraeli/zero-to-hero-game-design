import { expect, test } from '@playwright/test';

test('a learner walks from the level map into Level 0 and through two lessons', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Game Design: Zero to Hero');
  await expect(page.getByRole('list', { name: 'Level map' }).getByRole('link')).toHaveCount(7);

  await page.getByRole('link', { name: /Level 0.*Press Start/ }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Press Start' })).toBeVisible();

  await page.getByRole('link', { name: 'What is a game' }).click();
  await expect(page).toHaveURL('/level/0/what-is-a-game');
  const loop = page.getByRole('img', { name: /Act, feedback, reward/ });
  await expect(loop).toBeVisible();
  // The diagram is served from the copied assets folder, not just referenced.
  expect(await loop.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);

  await page
    .getByRole('navigation', { name: 'Lesson' })
    .getByRole('link', { name: /Next/ })
    .click();
  await expect(page).toHaveURL('/level/0/mda-framework');
  await expect(page.getByRole('heading', { level: 1, name: 'The MDA framework' })).toBeVisible();
  await expect(page.getByRole('img', { name: /Mechanics produce dynamics/ })).toBeVisible();
});

test('a deep link to a lesson works on a fresh load', async ({ page }) => {
  await page.goto('/level/0/mda-framework');
  await expect(page.getByRole('heading', { level: 1, name: 'The MDA framework' })).toBeVisible();
});

test('an unknown lesson shows the 404 page', async ({ page }) => {
  await page.goto('/level/0/nope');
  await expect(page.getByRole('heading', { level: 1, name: 'Page not found' })).toBeVisible();
});
