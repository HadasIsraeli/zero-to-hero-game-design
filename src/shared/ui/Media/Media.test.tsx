import { afterEach, describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import { getMedia } from '@shared/lib/media';
import { Media } from './Media';

// Each case reads a real entry from assets/media.json, so these double as a smoke test of the file.
// Unknown ids throwing in dev is covered at the loader level in src/shared/lib/media.test.ts.

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe('<Media>', () => {
  it('renders a diagram as an image with its alt text, served from the copied assets', async () => {
    const diagram = getMedia('mda-diagram');
    if (diagram?.type !== 'diagram') throw new Error('expected a diagram');
    const screen = await render(<Media id="mda-diagram" />);
    const image = screen.getByRole('img', { name: diagram.alt });
    await expect.element(image).toHaveAttribute('src', '/assets/images/diagrams/mda-framework.svg');
  });

  it('renders a pdf as a link card that opens in a new tab', async () => {
    const screen = await render(<Media id="mda-paper" />);
    const link = screen.getByRole('link', { name: /MDA: A Formal Approach/ });
    await expect.element(link).toHaveAttribute('target', '_blank');
    await expect.element(link).toHaveAttribute('rel', 'noopener noreferrer');
    await expect.element(link).toHaveAccessibleName(/\(opens in new tab\)/);
    await expect.element(link).toMatchTextContent(/PDF/);
  });

  it('renders a link with its source', async () => {
    const screen = await render(<Media id="minecraft-design" />);
    await expect
      .element(screen.getByRole('link', { name: /Minecraft game design/ }))
      .toMatchTextContent(/Game Design Skills/);
  });

  it('renders an unknown id as nothing in production', async () => {
    vi.stubEnv('DEV', false);
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const screen = await render(<Media id="does-not-exist" />);
    expect(screen.container.innerHTML).toBe('');
    expect(error).toHaveBeenCalledWith(expect.stringContaining('Unknown media id'));
  });
});
