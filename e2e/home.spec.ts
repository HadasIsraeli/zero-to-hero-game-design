import { expect, test } from '@playwright/test';

test('home page shows the course title', async ({ page }) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', { level: 1, name: 'Game Design: Zero to Hero' }),
  ).toBeVisible();
});

test('course diagrams are copied from assets/ into the build', async ({ request }) => {
  const response = await request.get('/assets/images/diagrams/mda-framework.svg');
  expect(response.ok()).toBe(true);
});
