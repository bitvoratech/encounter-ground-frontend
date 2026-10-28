"use client";

import { useSyncExternalStore } from "react";
import type { Enrolment, QuizResult } from "@/types/school";
import { api } from "./api";
import { authHeader, createClient } from "./supabase/client";

// The member's Beth-El classes and progress, from the API (/me/courses). One shared store,
// loaded once and refreshed on sign-in, sign-out and after every change, so the header,
// class pages, lessons and dashboard all agree.

export type Learning =
  | { status: "loading" }
  | { status: "signed-out" }
  | { status: "error" }
  | { status: "ready"; enrolments: Enrolment[] };

const LOADING: Learning = { status: "loading" };
let state: Learning = LOADING;
const listeners = new Set<() => void>();
let started = false;

function set(next: Learning) {
  state = next;
  listeners.forEach((l) => l());
}

async function load() {
  const headers = await authHeader();
  if (!headers.Authorization) return set({ status: "signed-out" });
  try {
    set({ status: "ready", enrolments: await api<Enrolment[]>("/me/courses", { headers }) });
  } catch {
    set({ status: "error" });
  }
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  if (!started) {
    started = true;
    // Fires once with the current session, then on every sign-in or sign-out.
    createClient().auth.onAuthStateChange((event) => {
      if (event === "INITIAL_SESSION" || event === "SIGNED_IN" || event === "SIGNED_OUT") void load();
    });
  }
  return () => listeners.delete(onChange);
}

export function useLearning(): Learning {
  return useSyncExternalStore(subscribe, () => state, () => LOADING);
}

/** The member's enrolment in a class, or null (also null while loading or signed out). */
export function enrolmentFor(learning: Learning, slug: string) {
  return learning.status === "ready" ? (learning.enrolments.find((e) => e.slug === slug) ?? null) : null;
}

async function send<T>(path: string, method: string, body?: unknown) {
  const result = await api<T>(path, {
    method,
    headers: await authHeader(),
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  await load();
  return result;
}

const lessonPath = (course: string, lesson: string) =>
  `/me/courses/${encodeURIComponent(course)}/lessons/${encodeURIComponent(lesson)}`;

export const enrol = (course: string) => send(`/me/courses/${encodeURIComponent(course)}/enrol`, "POST");

export const setLessonComplete = (course: string, lesson: string, done: boolean) =>
  send(`${lessonPath(course, lesson)}/complete`, "PUT", { done });

export const submitCheckpoint = (course: string, lesson: string, body: string) =>
  send(`${lessonPath(course, lesson)}/checkpoint`, "POST", { body });

export const submitQuiz = (course: string, lesson: string, answers: number[]) =>
  send<QuizResult>(`${lessonPath(course, lesson)}/quiz`, "POST", { answers });
