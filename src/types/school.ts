// Shapes returned by the API's /courses and /me/courses endpoints.

export type LessonKind = "video" | "audio" | "text" | "pdf" | "checkpoint" | "quiz";

export type Lesson = {
  slug: string;
  title: string;
  kind: LessonKind;
  minutes: number;
  /** Open to everyone, enrolled or not. */
  preview: boolean;
  /** For checkpoints: what the student is asked to write about. */
  prompt: string | null;
};

export type CourseModule = { title: string; summary: string | null; lessons: Lesson[] };

/** A final-check question; the API keeps the answers. */
export type QuizQuestion = { question: string; options: string[] };

type CourseBase = {
  slug: string;
  /** The class name, e.g. "Halak". */
  name: string;
  summary: string | null;
  meaning: string | null;
  badge: string | null;
  outcomes: string[];
  free: boolean;
};

export type CourseSummary = CourseBase & { module_count: number; lesson_count: number; minutes: number };

export type Course = CourseBase & { modules: CourseModule[]; quiz: QuizQuestion[] };

/** A class the member is enrolled in, with the slugs of the lessons they've finished. */
export type Enrolment = { slug: string; enrolled_at: string; completed: string[] };

export type QuizResult = {
  score: number;
  total: number;
  passed: boolean;
  results: { correct: boolean; answer: number; explanation: string | null }[];
};
