"use client";

import { useState } from "react";
import { inputClass as field } from "@/components/ui/form";
import { api } from "@/lib/api";
import { authHeader } from "@/lib/supabase/client";

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "sent" } | { kind: "error"; message: string };

export function ContactForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    setStatus({ kind: "sending" });
    try {
      await api("/contact", { method: "POST", headers: await authHeader(), body: JSON.stringify(data) });
      form.reset();
      setStatus({ kind: "sent" });
    } catch (err) {
      setStatus({
        kind: "error",
        message: err instanceof Error ? err.message : "Your message didn’t send. Please try again.",
      });
    }
  }

  if (status.kind === "sent") {
    return (
      <div role="status" className="rounded-3xl border border-rule bg-chalk p-8">
        <h3 className="text-h3 text-slate-ink">Thank you, your message is on its way</h3>
        <p className="mt-3 text-stone-muted">We’ll get back to you by email or phone.</p>
        <button type="button" className="btn btn-quiet mt-6 text-slate-ink" onClick={() => setStatus({ kind: "idle" })}>
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
      <label className="sm:col-span-2">
        <span className="font-semibold text-slate-ink">Your name</span>
        <input name="full_name" required maxLength={120} autoComplete="name" className={field} />
      </label>
      <label>
        <span className="font-semibold text-slate-ink">Email</span>
        <input name="email" type="email" required maxLength={254} autoComplete="email" className={field} />
      </label>
      <label>
        <span className="font-semibold text-slate-ink">
          Phone <span className="font-normal text-stone-muted">(optional)</span>
        </span>
        <input name="phone" type="tel" maxLength={30} autoComplete="tel" className={field} />
      </label>
      <label className="sm:col-span-2">
        <span className="font-semibold text-slate-ink">Subject</span>
        <input name="subject" required maxLength={160} className={field} />
      </label>
      <label className="sm:col-span-2">
        <span className="font-semibold text-slate-ink">Message</span>
        <textarea name="message" required rows={6} maxLength={5000} className={field} />
      </label>
      {/* Honeypot for bots; hidden from people and screen readers. */}
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

      {status.kind === "error" && (
        <p role="alert" className="font-semibold text-amber sm:col-span-2">
          {status.message}
        </p>
      )}
      <div className="sm:col-span-2">
        <button type="submit" className="btn btn-fire" disabled={status.kind === "sending"}>
          {status.kind === "sending" ? "Sending…" : "Send message"}
        </button>
      </div>
    </form>
  );
}
