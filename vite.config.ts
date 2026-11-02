/// <reference types="vitest/config" />
import { fileURLToPath, URL } from 'node:url';
import mdx from '@mdx-js/rollup';
import babel from '@rolldown/plugin-babel';
import { playwright } from '@vitest/browser-playwright';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import type { BrowserCommand } from 'vitest/node';

const fromRoot = (path: string) => fileURLToPath(new URL(path, import.meta.url));

/** Browser-test command: toggles `prefers-reduced-motion` for the test page. */
const setReducedMotion: BrowserCommand<[reduce: boolean]> = async ({ page }, reduce) => {
  await page.emulateMedia({ reducedMotion: reduce ? 'reduce' : 'no-preference' });
};

export default defineConfig({
  plugins: [
    { enforce: 'pre', ...mdx({ providerImportSource: '@mdx-js/react' }) },
    react({ include: /\.(mdx|[jt]sx?)$/ }),
    babel({ presets: [reactCompilerPreset()] }),
  ],
  resolve: {
    alias: {
      '@app': fromRoot('./src/app'),
      '@features': fromRoot('./src/features'),
      '@shared': fromRoot('./src/shared'),
      '@content': fromRoot('./content'),
      '@assets': fromRoot('./assets'),
    },
  },
  test: {
    // Pure logic (*.test.ts) runs in Node; anything rendering React (*.test.tsx) runs in a
    // real browser. See "Tests" in CLAUDE.md.
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          environment: 'node',
          include: ['src/**/*.test.ts', 'content/**/*.test.ts', 'scripts/**/*.test.ts'],
        },
      },
      {
        extends: true,
        test: {
          name: 'browser',
          include: ['src/**/*.test.tsx'],
          setupFiles: ['./src/test/browserSetup.ts'],
          // Real clicks need the test's iframe on screen; parallel files would hide each other.
          fileParallelism: false,
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [{ browser: 'chromium' }],
            commands: { setReducedMotion },
            screenshotFailures: false,
          },
        },
      },
    ],
  },
});
