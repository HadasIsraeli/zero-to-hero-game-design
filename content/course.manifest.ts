// Typed course outline: levels → modules → lessons. Filled in during Step 3.

export type Lesson = {
  slug: string;
  title: string;
};

export type Module = {
  title: string;
  lessons: Lesson[];
};

export type Level = {
  level: number;
  title: string;
  modules: Module[];
};

export type Course = {
  title: string;
  levels: Level[];
};

export const course: Course = {
  title: 'Game Design: Zero to Hero',
  levels: [],
};
