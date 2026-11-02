import { expect, test, type Page } from '@playwright/test';

// A short viewport so the end of a lesson starts below the fold.
test.use({ viewport: { width: 1000, height: 500 } });

const xpBar = (page: Page) =>
  page.getByRole('banner').getByRole('progressbar', { name: 'XP to next rank' });

async function readAndComplete(page: Page, path: string) {
  await page.goto(path);
  const complete = page.getByRole('button', { name: 'Complete lesson' });
  await expect(complete).toBeDisabled();
  await expect(page.getByText('Read to the end to complete this lesson')).toBeVisible();

  await page.getByTestId('lesson-end').scrollIntoViewIfNeeded();
  await expect(complete).toBeEnabled();
  await complete.click();
  await expect(page.getByRole('status').filter({ hasText: 'Lesson completed' })).toBeVisible();
}

test('completing a lesson awards XP that survives a reload', async ({ page }) => {
  await readAndComplete(page, '/level/0/what-is-a-game');
  await expect(xpBar(page)).toHaveAttribute('aria-valuenow', '50');
  await expect(page.getByText('Badge unlocked: First Steps')).toBeVisible();

  await page.reload();
  await expect(xpBar(page)).toHaveAttribute('aria-valuenow', '50');
  await expect(page.getByRole('status').filter({ hasText: 'Lesson completed' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Complete lesson' })).toHaveCount(0);
});

test('finishing Level 0 ranks up with a dialog that Esc closes', async ({ page }) => {
  await readAndComplete(page, '/level/0/what-is-a-game');
  await readAndComplete(page, '/level/0/mda-framework');

  const dialog = page.getByRole('dialog', { name: /Rank 2 · Apprentice/ });
  await expect(dialog).toBeVisible();
  await expect(page.getByRole('button', { name: 'Keep going' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();

  await page.goto('/progress');
  await expect(page.getByRole('heading', { level: 1, name: 'Rank 2 · Apprentice' })).toBeVisible();
  await expect(page.getByText('Press Start', { exact: true }).locator('..')).toContainText(
    'Earned',
  );
});

test('reduced motion still celebrates, without the particle burst', async ({ browser }) => {
  const context = await browser.newContext({
    reducedMotion: 'reduce',
    viewport: { width: 1000, height: 500 },
  });
  const page = await context.newPage();
  await readAndComplete(page, '/level/0/what-is-a-game');
  await readAndComplete(page, '/level/0/mda-framework');

  await expect(page.getByRole('dialog', { name: /Rank 2/ })).toBeVisible();
  await expect(page.getByTestId('particle-burst')).toHaveCount(0);
  await context.close();
});
