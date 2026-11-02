/// <reference types="vitest/config" />
import { fileURLToPath, URL } from 'node:url';
import mdx from '@mdx-js/rollup';
import babel from '@rolldown/plugin-babel';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const fromRoot = (path: string) => fileURLToPath(new URL(path, import.meta.url));

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
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'content/**/*.test.{ts,tsx}', 'scripts/**/*.test.{ts,mjs}'],
    css: true,
  },
});
