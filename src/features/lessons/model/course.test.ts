import type { Course } from '@content/course.manifest';
import { describe, expect, it } from 'vitest';
import {
  allLessons,
  findLesson,
  findLevel,
  lessonCount,
  lessonNeighbours,
  lessonPath,
  levelPath,
} from './course';

const lesson = (slug: string) => ({
  slug,
  title: slug,
  load: () => Promise.resolve({ default: () => null }),
});

const level = (number: number, slugs: string[][]) => ({
  level: number,
  title: `Level ${String(number)}`,
  theme: '',
  anchors: '',
  bossFight: '',
  modules: slugs.map((moduleSlugs, i) => ({
    title: `Module ${String(i)}`,
    lessons: moduleSlugs.map(lesson),
  })),
});

const course: Course = {
  title: 'Test course',
  levels: [level(0, [['a', 'b'], ['c']]), level(1, [[]]), level(2, [['d']])],
};

describe('findLevel', () => {
  it('parses a numeric route param', () => {
    expect(findLevel(course, '2')?.level).toBe(2);
  });

  it.each([undefined, '', '9', '-1', '1.0', ' 1', 'one'])('rejects %j', (param) => {
    expect(findLevel(course, param)).toBeUndefined();
  });
});

describe('findLesson', () => {
  it('finds a lesson by level and slug', () => {
    expect(findLesson(course, '0', 'c')?.module.title).toBe('Module 1');
  });

  it('does not find a lesson under the wrong level', () => {
    expect(findLesson(course, '2', 'a')).toBeUndefined();
    expect(findLesson(course, '0', undefined)).toBeUndefined();
  });
});

describe('lessonNeighbours', () => {
  const at = (levelParam: string, slug: string) => {
    const ref = findLesson(course, levelParam, slug);
    if (!ref) throw new Error(`missing ${slug}`);
    return lessonNeighbours(course, ref);
  };

  it('links lessons in order, across modules', () => {
    const { previous, next } = at('0', 'b');
    expect(previous?.lesson.slug).toBe('a');
    expect(next?.lesson.slug).toBe('c');
  });

  it('crosses into the next level with lessons, skipping empty levels', () => {
    expect(at('0', 'c').next?.lesson.slug).toBe('d');
    expect(at('2', 'd').previous?.lesson.slug).toBe('c');
  });

  it('has no previous at the start or next at the end', () => {
    expect(at('0', 'a').previous).toBeUndefined();
    expect(at('2', 'd').next).toBeUndefined();
  });
});

describe('paths and counts', () => {
  it('builds level and lesson URLs', () => {
    const [first] = allLessons(course);
    if (!first) throw new Error('no lessons');
    expect(levelPath(first.level)).toBe('/level/0');
    expect(lessonPath(first)).toBe('/level/0/a');
  });

  it('counts lessons across modules', () => {
    expect(course.levels.map(lessonCount)).toEqual([3, 0, 1]);
  });
});
