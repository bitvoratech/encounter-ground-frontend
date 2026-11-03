"use client";

import type { AdminLessonKind, AdminPrices, AdminQuizQuestion, PublishStatus, Role } from "@/types/admin";
import { api } from "./api";
import { authHeader, createClient } from "./supabase/client";

// Changes made from the admin dashboard. Callers refresh the page afterwards so the
// server-rendered lists and counts update.

async function send<T = { ok: true }>(path: string, body?: unknown, method = "PUT") {
  return api<T>(`/admin${path}`, {
    method,
    headers: await authHeader(),
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

export const replyToCheckpoint = (id: string, feedback: string) => send(`/checkpoints/${id}`, { feedback });

export const setMessageHandled = (id: string, handled: boolean) => send(`/messages/${id}`, { handled });

export const setMemberRole = (id: string, role: Role) => send(`/members/${id}`, { role });

// ---------------------------------------------------------------------------
// Books
// ---------------------------------------------------------------------------

export type BookInput = {
  title: string;
  slug: string;
  subtitle: string;
  author: string;
  audience: string;
  description: string;
  cover_image_url: string;
  amazon_url: string;
  page_count: number | null;
  sort_order: number;
  status: PublishStatus;
  prices: AdminPrices;
};

export const createBook = (book: BookInput) => send<{ id: string }>("/books", book, "POST");
export const updateBook = (id: string, book: BookInput) => send<{ id: string }>(`/books/${id}`, book);
export const deleteBook = (id: string) => send(`/books/${id}`, undefined, "DELETE");

// ---------------------------------------------------------------------------
// Classes, modules, lessons
// ---------------------------------------------------------------------------

export type CourseInput = {
  title: string;
  slug: string;
  summary: string;
  description: string;
  meaning: string;
  badge: string;
  outcomes: string[];
  sort_order: number;
  status: PublishStatus;
};

export const createCourse = (course: CourseInput) => send<{ id: string }>("/courses", course, "POST");
export const updateCourse = (id: string, course: CourseInput) => send<{ id: string }>(`/courses/${id}`, course);
export const deleteCourse = (id: string) => send(`/courses/${id}`, undefined, "DELETE");

export const reorderCourse = (id: string, modules: { id: string; lessons: string[] }[]) => send(`/courses/${id}/order`, { modules });
export const saveQuiz = (id: string, questions: AdminQuizQuestion[]) => send(`/courses/${id}/quiz`, { questions });

export type ModuleInput = { title: string; summary: string };
export const createModule = (courseId: string, module: ModuleInput) =>
  send<{ id: string }>(`/courses/${courseId}/modules`, module, "POST");
export const updateModule = (id: string, module: ModuleInput) => send<{ id: string }>(`/modules/${id}`, module);
export const deleteModule = (id: string) => send(`/modules/${id}`, undefined, "DELETE");

export type LessonInput = {
  title: string;
  kind: AdminLessonKind;
  body: string;
  video_url: string;
  attachment_path: string;
  prompt: string;
  minutes: number;
  preview: boolean;
};
export const createLesson = (moduleId: string, lesson: LessonInput) =>
  send<{ id: string; slug: string }>(`/modules/${moduleId}/lessons`, lesson, "POST");
export const updateLesson = (id: string, lesson: LessonInput) => send<{ id: string }>(`/lessons/${id}`, lesson);
export const deleteLesson = (id: string) => send(`/lessons/${id}`, undefined, "DELETE");

// ---------------------------------------------------------------------------
// Uploads, straight to Supabase Storage (only staff may write to these buckets)
// ---------------------------------------------------------------------------

const extension = (file: File) => (file.name.match(/\.([a-z0-9]{1,5})$/i)?.[1] ?? "bin").toLowerCase();

async function upload(bucket: "covers" | "lesson-files", path: string, file: File) {
  const storage = createClient().storage.from(bucket);
  const { error } = await storage.upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw new Error(`The upload didn’t work: ${error.message}`);
  return storage;
}

/** Uploads a book cover and returns its public address. */
export async function uploadCover(file: File) {
  const path = `books/${crypto.randomUUID()}.${extension(file)}`;
  const storage = await upload("covers", path, file);
  return storage.getPublicUrl(path).data.publicUrl;
}

/** Uploads a lesson's PDF or audio file and returns its private storage path. */
export async function uploadLessonFile(file: File) {
  const safeName = file.name.replace(/\.[^.]+$/, "").replace(/[^\w-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "file";
  const path = `lessons/${crypto.randomUUID()}/${safeName}.${extension(file)}`;
  await upload("lesson-files", path, file);
  return path;
}

// ---------------------------------------------------------------------------
// Book pages for the reader, and who owns a book
// ---------------------------------------------------------------------------

export const setBookPages = (id: string, folder: string, pages: { file: string; width: number; height: number }[]) =>
  send<{ page_count: number }>(`/books/${id}/pages`, { folder, pages });

export const giveBook = (id: string, email: string) => send(`/books/${id}/owners`, { email }, "POST");
export const takeBackBook = (id: string, userId: string) => send(`/books/${id}/owners/${userId}`, undefined, "DELETE");

// ---------------------------------------------------------------------------
// Website content
// ---------------------------------------------------------------------------

export const saveSiteContent = (key: "contact" | "yada" | "home", value: Record<string, string>) =>
  send(`/site-content/${key}`, value);
