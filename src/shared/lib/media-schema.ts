// Schema for assets/media.json. Pure (no Vite, no React) so the app and
// scripts/media-check.ts validate the file with the same rules.
import { z } from 'zod';

const id = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'ids are kebab-case, e.g. "mda-diagram"');

const youtubeItem = z.strictObject({
  id,
  type: z.literal('youtube'),
  title: z.string().min(1),
  youtubeId: z.string().regex(/^[\w-]{11}$/, 'YouTube ids are 11 characters'),
  start: z.int().nonnegative().optional(),
  source: z.string().optional(),
  module: z.string().optional(),
  note: z.string().optional(),
  verified: z.boolean(),
});

const linkFields = {
  id,
  title: z.string().min(1),
  url: z.url({ protocol: /^https$/ }),
  source: z.string().optional(),
  module: z.string().optional(),
  note: z.string().optional(),
  verified: z.boolean(),
};

const linkItem = z.strictObject({ ...linkFields, type: z.literal('link') });
const pdfItem = z.strictObject({ ...linkFields, type: z.literal('pdf') });

const diagramItem = z.strictObject({
  id,
  type: z.literal('diagram'),
  file: z.string().regex(/^images\/.+\.svg$/, 'diagrams live in images/ and are .svg'),
  alt: z.string().min(1),
  module: z.string().optional(),
  note: z.string().optional(),
});

const mediaItem = z.discriminatedUnion('type', [youtubeItem, linkItem, pdfItem, diagramItem]);

const unityTrackItem = z.strictObject({
  ...linkFields,
  type: z.literal('link'),
  level: z.int().min(0).max(6),
});

const mediaFile = z
  .strictObject({
    $comment: z.string().optional(),
    version: z.literal(1),
    levels: z.array(
      z.strictObject({
        level: z.int().min(0).max(6),
        title: z.string().min(1),
        media: z.array(mediaItem),
      }),
    ),
    unityTrack: z.array(unityTrackItem),
  })
  .superRefine((file, ctx) => {
    const seen = new Set<string>();
    const all = [...file.levels.flatMap((level) => level.media), ...file.unityTrack];
    for (const item of all) {
      if (seen.has(item.id)) {
        ctx.addIssue({ code: 'custom', message: `Duplicate media id "${item.id}"` });
      }
      seen.add(item.id);
    }
  });

export type MediaItem = z.infer<typeof mediaItem>;
export type YoutubeItem = z.infer<typeof youtubeItem>;
export type UnityTrackItem = z.infer<typeof unityTrackItem>;
export type MediaFile = z.infer<typeof mediaFile>;

export function parseMediaFile(raw: unknown): MediaFile {
  const result = mediaFile.safeParse(raw);
  if (!result.success) {
    throw new Error(`assets/media.json is invalid:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}

const checkResult = z.strictObject({
  youtubeId: z.string(),
  ok: z.boolean(),
  detail: z.string(),
});

const checkFile = z.strictObject({
  $comment: z.string().optional(),
  checkedAt: z.string().nullable(),
  results: z.record(z.string(), checkResult),
});

export type MediaCheckResult = z.infer<typeof checkResult>;
export type MediaCheckFile = z.infer<typeof checkFile>;

export function parseMediaCheckFile(raw: unknown): MediaCheckFile {
  const result = checkFile.safeParse(raw);
  if (!result.success) {
    throw new Error(
      `media-check.generated.json is invalid (re-run npm run media:check):\n${z.prettifyError(result.error)}`,
    );
  }
  return result.data;
}

/** A YouTube item may embed if it was hand-verified or passed media:check for its current id. */
export function isEmbeddable(item: YoutubeItem, checks: MediaCheckFile): boolean {
  if (item.verified) return true;
  const check = checks.results[item.id];
  return check?.ok === true && check.youtubeId === item.youtubeId;
}
