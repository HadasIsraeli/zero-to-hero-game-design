import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { getMedia, type MediaItem } from '@shared/lib/media';
import { Media } from './Media';

// Each case reads a real entry from assets/media.json, so these double as a smoke test of the file.
function item(id: string): MediaItem {
  const found = getMedia(id);
  if (!found) throw new Error(`assets/media.json is missing ${id}`);
  return found;
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe('<Media>', () => {
  it('renders a diagram as an image with its alt text', () => {
    render(<Media id="mda-diagram" />);
    const diagram = item('mda-diagram');
    if (diagram.type !== 'diagram') throw new Error('expected a diagram');
    expect(screen.getByRole('img', { name: diagram.alt })).toHaveAttribute(
      'src',
      '/assets/images/diagrams/mda-framework.svg',
    );
  });

  it('renders a pdf as a link card that opens in a new tab', () => {
    render(<Media id="mda-paper" />);
    const link = screen.getByRole('link', { name: /MDA: A Formal Approach/ });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(link).toHaveAccessibleName(/\(opens in new tab\)/);
    expect(link).toHaveTextContent('PDF');
  });

  it('renders a link with its source', () => {
    render(<Media id="minecraft-design" />);
    expect(screen.getByRole('link', { name: /Minecraft game design/ })).toHaveTextContent(
      'Game Design Skills',
    );
  });

  it('renders an unknown id as nothing in production', () => {
    vi.stubEnv('DEV', false);
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const { container } = render(<Media id="does-not-exist" />);
    expect(container).toBeEmptyDOMElement();
  });

  it('throws for an unknown id in dev', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() => render(<Media id="does-not-exist" />)).toThrow(/Unknown media id/);
  });
});
