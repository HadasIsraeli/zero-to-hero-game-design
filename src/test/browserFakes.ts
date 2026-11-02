// Browser APIs jsdom lacks, replaced with controllable fakes. Installed by setup.ts.
import { act } from '@testing-library/react';

const observers = new Set<FakeIntersectionObserver>();

class FakeIntersectionObserver {
  readonly root = null;
  readonly rootMargin = '0px';
  readonly thresholds = [0];
  private readonly targets = new Set<Element>();
  private readonly callback: IntersectionObserverCallback;

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
    observers.add(this);
  }
  observe(target: Element) {
    this.targets.add(target);
  }
  unobserve(target: Element) {
    this.targets.delete(target);
  }
  disconnect() {
    this.targets.clear();
    observers.delete(this);
  }
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
  /** Reports every observed target as visible. */
  reveal() {
    const entries = [...this.targets].map(
      (target) => ({ target, isIntersecting: true }) as IntersectionObserverEntry,
    );
    if (entries.length > 0) this.callback(entries, this as unknown as IntersectionObserver);
  }
}

/** Simulates scrolling everything observed into view, e.g. the end of a lesson. */
export function revealObserved(): void {
  act(() => {
    for (const observer of [...observers]) observer.reveal();
  });
}

let reducedMotion = false;

/** Makes `(prefers-reduced-motion: reduce)` match (or not) for the rest of the test. */
export function setReducedMotion(value: boolean): void {
  reducedMotion = value;
}

export function installBrowserFakes(): void {
  window.IntersectionObserver = FakeIntersectionObserver as unknown as typeof IntersectionObserver;
  observers.clear();
  reducedMotion = false;

  window.matchMedia = (query: string) =>
    ({
      matches: query.includes('prefers-reduced-motion') && reducedMotion,
      media: query,
      onchange: null,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList;

  // jsdom renders <dialog> but cannot open it as a modal.
  HTMLDialogElement.prototype.showModal = function showModal(this: HTMLDialogElement) {
    this.open = true;
  };
  HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement) {
    if (!this.open) return;
    this.open = false;
    this.dispatchEvent(new Event('close'));
  };

  // jsdom has no canvas; returning null makes effects skip drawing without console noise.
  HTMLCanvasElement.prototype.getContext = (() =>
    null) as typeof HTMLCanvasElement.prototype.getContext;

  // jsdom has no layout, so scrolling is a no-op (React Router's ScrollRestoration calls it).
  window.scrollTo = () => undefined;
}
