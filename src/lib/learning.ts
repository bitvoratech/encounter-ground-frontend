"use client";

import { courseLessons, findCourse, isLessonId, type Course } from "@/content/courses";
import { createSlugStore } from "./slugStore";

// STAND-IN until the school backend: enrolments, finished lessons and submitted checkpoints
// live in this browser only. With the backend they come from the enrollments and
// lesson_progress tables, and lesson content is only served to enrolled students.

const enrolments = createSlugStore("eg-enrolments-sample-v1", (slug) => !!findCourse(slug));
const completed = createSlugStore("eg-progress-sample-v1", isLessonId);

export const useEnrolments = enrolments.useSlugs;
export const useCompleted = completed.useSlugs;

export function enrol(courseSlug: string) {
  const current = enrolments.read();
  if (findCourse(courseSlug) && !current.includes(courseSlug)) enrolments.write([...current, courseSlug]);
}

export function setLessonComplete(lessonId: string, done: boolean) {
  const current = completed.read();
  if (done && !current.includes(lessonId)) completed.write([...current, lessonId]);
  if (!done) completed.write(current.filter((id) => id !== lessonId));
}

/** Progress through a course, and the lesson to continue from. */
export function courseProgress(course: Course, done: string[] | null) {
  const lessons = courseLessons(course);
  const finished = lessons.filter((l) => done?.includes(l.id)).length;
  const next = lessons.find((l) => !done?.includes(l.id)) ?? lessons[0]!;
  return {
    finished,
    total: lessons.length,
    percent: Math.round((finished / lessons.length) * 100),
    next,
    complete: finished === lessons.length,
  };
}
