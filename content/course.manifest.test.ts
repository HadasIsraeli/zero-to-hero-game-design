import rawMedia from '@assets/media.json';
import { parseMediaFile } from '@shared/lib/media-schema';
import { describe, expect, it } from 'vitest';
import { course } from './course.manifest';

const lessons = course.levels.flatMap((level) =>
  level.modules.flatMap((module) => module.lessons.map((lesson) => ({ level, lesson }))),
);

describe('course manifest', () => {
  it('has levels 0 to 6 in order', () => {
    expect(course.levels.map((level) => level.level)).toEqual([0, 1, 2, 3, 4, 5, 6]);
  });

  it('gives every level a title, theme, anchors, boss fight and modules', () => {
    for (const level of course.levels) {
      expect(level.title, `level ${String(level.level)}`).not.toBe('');
      expect(level.theme, `level ${String(level.level)}`).not.toBe('');
      expect(level.anchors, `level ${String(level.level)}`).not.toBe('');
      expect(level.bossFight, `level ${String(level.level)}`).not.toBe('');
      expect(level.modules.length, `level ${String(level.level)}`).toBeGreaterThan(0);
    }
  });

  it('uses URL-safe lesson slugs that are unique within each level', () => {
    for (const level of course.levels) {
      const slugs = level.modules.flatMap((module) => module.lessons.map((lesson) => lesson.slug));
      expect(new Set(slugs).size, `duplicate slug in level ${String(level.level)}`).toBe(
        slugs.length,
      );
      for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });

  it.each(lessons.map(({ level, lesson }) => [level.level, lesson.slug, lesson]))(
    'level %i lesson "%s" loads an MDX component',
    async (_, __, lesson) => {
      const loaded = await lesson.load();
      expect(loaded.default).toBeTypeOf('function');
    },
  );
});

describe('assets/media.json modules', () => {
  const media = parseMediaFile(rawMedia);

  it.each(media.levels.flatMap((level) => level.media.map((item) => [level.level, item])))(
    'level %i: "%s" names a real module of that level',
    (levelNumber, item) => {
      if (typeof item === 'number' || item.module === undefined) return;
      const level = course.levels.find((entry) => entry.level === levelNumber);
      expect(level?.modules.map((module) => module.title)).toContain(item.module);
    },
  );
});
