// The only way the app reads course media. Lessons and components ask for an id;
// URLs and file paths are derived here from assets/media.json.
import rawMedia from '@assets/media.json';
import rawChecks from './media-check.generated.json';
import {
  isEmbeddable,
  parseMediaCheckFile,
  parseMediaFile,
  type MediaCheckFile,
  type MediaFile,
  type MediaItem,
  type UnityTrackItem,
  type YoutubeItem,
} from './media-schema';

export type { MediaItem, UnityTrackItem, YoutubeItem } from './media-schema';

export type MediaView =
  | { kind: 'image'; id: string; src: string; alt: string }
  | { kind: 'video'; id: string; title: string; embedUrl: string }
  | {
      kind: 'card';
      id: string;
      title: string;
      href: string;
      label: 'Video' | 'Link' | 'PDF';
      source?: string;
    };

export function createMediaLibrary(file: MediaFile, checks: MediaCheckFile) {
  const items = new Map<string, MediaItem>();
  for (const level of file.levels) {
    for (const item of level.media) items.set(item.id, item);
  }

  function getMedia(id: string): MediaItem | undefined {
    const item = items.get(id);
    if (item) return item;

    const suggestions = closestIds(id, [...items.keys()]);
    const message =
      `Unknown media id "${id}". Add it to assets/media.json` +
      (suggestions.length > 0 ? ` or use one of: ${suggestions.join(', ')}` : '') +
      '.';
    if (import.meta.env.DEV) throw new Error(message);
    console.error(message);
    return undefined;
  }

  function getMediaForLevel(level: number): MediaItem[] {
    return file.levels.find((entry) => entry.level === level)?.media ?? [];
  }

  function getUnityTrack(): UnityTrackItem[] {
    return file.unityTrack;
  }

  function toMediaView(item: MediaItem): MediaView {
    switch (item.type) {
      case 'diagram':
        return { kind: 'image', id: item.id, src: assetUrl(item.file), alt: item.alt };
      case 'youtube':
        return isEmbeddable(item, checks)
          ? { kind: 'video', id: item.id, title: item.title, embedUrl: youtubeEmbedUrl(item) }
          : card(item.id, item.title, youtubeWatchUrl(item), 'Video', item.source);
      case 'link':
        return card(item.id, item.title, item.url, 'Link', item.source);
      case 'pdf':
        return card(item.id, item.title, item.url, 'PDF', item.source);
    }
  }

  return { getMedia, getMediaForLevel, getUnityTrack, toMediaView };
}

function card(
  id: string,
  title: string,
  href: string,
  label: 'Video' | 'Link' | 'PDF',
  source: string | undefined,
): MediaView {
  return source === undefined
    ? { kind: 'card', id, title, href, label }
    : { kind: 'card', id, title, href, label, source };
}

function assetUrl(file: string): string {
  return `${import.meta.env.BASE_URL}assets/${file}`;
}

export function youtubeEmbedUrl(item: YoutubeItem): string {
  const start = item.start ? `?start=${String(item.start)}` : '';
  return `https://www.youtube-nocookie.com/embed/${item.youtubeId}${start}`;
}

export function youtubeWatchUrl(item: YoutubeItem): string {
  const start = item.start ? `&t=${String(item.start)}s` : '';
  return `https://www.youtube.com/watch?v=${item.youtubeId}${start}`;
}

/** Up to three known ids closest to a mistyped one (Levenshtein distance ≤ 4). */
export function closestIds(target: string, ids: string[]): string[] {
  return ids
    .map((id) => ({ id, distance: levenshtein(target, id) }))
    .filter(({ distance }) => distance <= 4)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 3)
    .map(({ id }) => id);
}

function levenshtein(a: string, b: string): number {
  let previous = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const current = [i];
    for (let j = 1; j <= b.length; j++) {
      const substitution = (previous[j - 1] ?? 0) + (a[i - 1] === b[j - 1] ? 0 : 1);
      current[j] = Math.min((previous[j] ?? 0) + 1, (current[j - 1] ?? 0) + 1, substitution);
    }
    previous = current;
  }
  return previous[b.length] ?? 0;
}

const library = createMediaLibrary(parseMediaFile(rawMedia), parseMediaCheckFile(rawChecks));

export const { getMedia, getMediaForLevel, getUnityTrack, toMediaView } = library;
