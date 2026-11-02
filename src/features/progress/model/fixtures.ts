// A small course for model tests: Level 0 is fully authored, Level 1 has an empty module.
import type { Course } from '@content/course.manifest';

const lesson = (slug: string) => ({
  slug,
  title: slug,
  load: () => Promise.resolve({ default: () => null }),
});

export const testCourse: Course = {
  title: 'Test',
  levels: [
    {
      level: 0,
      title: 'Zero',
      theme: '',
      anchors: '',
      bossFight: '',
      modules: [
        { title: 'A', lessons: [lesson('a1'), lesson('a2')] },
        { title: 'B', lessons: [lesson('b1')] },
      ],
    },
    {
      level: 1,
      title: 'One',
      theme: '',
      anchors: '',
      bossFight: '',
      modules: [
        { title: 'C', lessons: [lesson('c1')] },
        { title: 'D', lessons: [] },
      ],
    },
  ],
};

export const NOW = new Date('2026-11-02T12:00:00Z');
