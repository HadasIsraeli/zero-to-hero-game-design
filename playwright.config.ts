import { defineConfig, devices } from '@playwright/test';

const port = 4173;
const isCI = Boolean(process.env['CI']);

// Runs against the production build: `npm run test:e2e` builds first.
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  reporter: isCI ? 'github' : 'list',
  use: {
    baseURL: `http://localhost:${String(port)}`,
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: `npm run preview -- --port ${String(port)} --strictPort`,
    port,
    reuseExistingServer: !isCI,
  },
});
