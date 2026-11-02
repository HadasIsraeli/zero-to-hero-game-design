import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// jsdom has no layout, so scrolling is a no-op (React Router's ScrollRestoration calls it).
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'scrollTo', { value: () => undefined, writable: true });
}

afterEach(() => {
  cleanup();
});
