import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import type { MediaView } from '@shared/lib/media';
import { Media } from './Media';

// Whether a real video embeds depends on media-check.generated.json, so the view is stubbed here.
const views: Record<string, MediaView> = {
  embedded: {
    kind: 'video',
    id: 'embedded',
    title: 'The Art of Screenshake',
    embedUrl: 'https://www.youtube-nocookie.com/embed/AJdEqssNZ-U',
  },
  unchecked: {
    kind: 'card',
    id: 'unchecked',
    title: 'Juice it or lose it',
    href: 'https://www.youtube.com/watch?v=Fy0aCDmgnxg',
    label: 'Video',
  },
};

vi.mock('@shared/lib/media', () => ({
  getMedia: (id: string) => ({ id }),
  toMediaView: ({ id }: { id: string }) => views[id],
}));

describe('<Media> videos', () => {
  it('embeds a playable video lazily from youtube-nocookie, labelled by its title', async () => {
    // Hidden, so Chrome never fetches the lazy iframe: tests stay off the network.
    const screen = await render(
      <div hidden>
        <Media id="embedded" />
      </div>,
    );
    const frame = screen.container.querySelector('iframe');
    expect(frame?.title).toBe('The Art of Screenshake');
    expect(frame?.getAttribute('loading')).toBe('lazy');
    expect(frame?.src).toMatch(/^https:\/\/www\.youtube-nocookie\.com\/embed\//);
  });

  it('shows an unchecked video as a link card instead of an embed', async () => {
    const screen = await render(<Media id="unchecked" />);
    expect(screen.container.querySelector('iframe')).toBeNull();
    await expect
      .element(screen.getByRole('link', { name: /Juice it or lose it/ }))
      .toMatchTextContent(/Video/);
  });
});
