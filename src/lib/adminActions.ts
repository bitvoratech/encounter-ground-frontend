"use client";

import type { Role } from "@/types/admin";
import { api } from "./api";
import { authHeader } from "./supabase/client";

// Changes made from the admin dashboard. Callers refresh the page afterwards so the
// server-rendered lists and counts update.

const send = async (path: string, body: unknown) =>
  api<{ ok: true }>(`/admin${path}`, { method: "PUT", headers: await authHeader(), body: JSON.stringify(body) });

export const replyToCheckpoint = (id: string, feedback: string) => send(`/checkpoints/${id}`, { feedback });

export const setMessageHandled = (id: string, handled: boolean) => send(`/messages/${id}`, { handled });

export const setMemberRole = (id: string, role: Role) => send(`/members/${id}`, { role });
