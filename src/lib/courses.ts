import type { Course, CourseSummary } from "@/types/school";
import { api, ApiError } from "./api";

// Beth-El Institute classes, from the API. Pages fetch at request time (like the self-tests)
// so a build never depends on the API being reachable. The outline helpers below are plain
// functions, used by server pages and client components alike.

export const getCourses = () => api<CourseSummary[]>("/courses");

export const getCourse = (slug: string) => api<Course>(`/courses/${encodeURIComponent(slug)}`);

/** Every class with its full outline, for the dashboard and My courses. */
export async function getAllCourses() {
  const list = await getCourses();
  return Promise.all(list.map((c) => getCourse(c.slug)));
}

/** Every lesson of a class in order, with its module. */
export function courseLessons(course: Course) {
  return course.modules.flatMap((module, moduleIndex) => module.lessons.map((lesson) => ({ lesson, module, moduleIndex })));
}

export function findLesson(course: Course, lessonSlug: string) {
  const all = courseLessons(course);
  const index = all.findIndex((l) => l.lesson.slug === lessonSlug);
  if (index < 0) return null;
  return { ...all[index]!, index, prev: all[index - 1] ?? null, next: all[index + 1] ?? null, total: all.length };
}

/** Progress through a class, and the lesson to continue from. */
export function courseProgress(course: Course, completed: string[]) {
  const lessons = courseLessons(course);
  const finished = lessons.filter((l) => completed.includes(l.lesson.slug)).length;
  const next = lessons.find((l) => !completed.includes(l.lesson.slug)) ?? lessons[0]!;
  return {
    finished,
    total: lessons.length,
    percent: lessons.length ? Math.round((finished / lessons.length) * 100) : 0,
    next,
    complete: lessons.length > 0 && finished === lessons.length,
  };
}

/**
 * Load one class for a page: the class, "missing" (send a 404), or "unavailable" when the
 * API can't be reached (show a friendly message instead of an error page).
 */
export async function loadCourse(slug: string): Promise<Course | "missing" | "unavailable"> {
  try {
    return await getCourse(slug);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return "missing";
    console.error(`Class "${slug}" unavailable:`, err);
    return "unavailable";
  }
}
