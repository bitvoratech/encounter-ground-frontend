"use client";

import { IconCircleCheck } from "@tabler/icons-react";
import { useId, useRef, useState } from "react";
import { submitCheckpoint } from "@/lib/learning";

/**
 * A written checkpoint at the end of a module, saved for a teacher to read (after GOMYCODE's
 * checkpoints). Submitting completes the lesson; writing it again replaces the earlier text.
 */
export function Checkpoint({
  courseSlug,
  lessonSlug,
  prompt,
  submitted,
}: {
  courseSlug: string;
  lessonSlug: string;
  prompt: string;
  submitted: boolean;
}) {
  const id = useId();
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const statusRef = useRef<HTMLDivElement>(null);

  if (submitted && !editing) {
    return (
      <div ref={statusRef} tabIndex={-1} role="status" className="flex items-start gap-3 rounded-2xl border border-rule bg-chalk p-6 outline-none">
        <IconCircleCheck aria-hidden="true" size={26} stroke={1.75} className="shrink-0 text-amber" />
        <div>
          <p className="font-semibold text-slate-ink">Checkpoint submitted</p>
          <p className="mt-1 text-stone-muted">A teacher will read it and may reply on your dashboard.</p>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="mt-3 text-sm font-semibold text-stone-muted underline-offset-4 hover:text-slate-ink hover:underline"
          >
            Write it again
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        if (text.trim().length < 20) {
          setError("Write at least a couple of sentences before you submit.");
          return;
        }
        setError("");
        setPending(true);
        try {
          await submitCheckpoint(courseSlug, lessonSlug, text.trim());
          setEditing(false);
          setText("");
          requestAnimationFrame(() => statusRef.current?.focus());
        } catch (err) {
          setError(err instanceof Error ? err.message : "Your checkpoint didn’t send. Please try again.");
        } finally {
          setPending(false);
        }
      }}
      className="rounded-2xl border border-rule bg-chalk p-6"
    >
      <label htmlFor={id} className="block font-display text-xl leading-snug text-slate-ink">
        {prompt}
      </label>
      <p id={`${id}-hint`} className="mt-2 text-sm text-stone-muted">
        There are no wrong answers. A teacher reads every checkpoint.
      </p>
      <textarea
        id={id}
        rows={6}
        maxLength={5000}
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={pending}
        aria-describedby={`${id}-hint${error ? ` ${id}-error` : ""}`}
        aria-invalid={!!error}
        className="mt-4 w-full rounded-xl border border-rule bg-limestone p-4 text-slate-ink"
      />
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-2 text-sm font-semibold text-amber">
          {error}
        </p>
      )}
      <button type="submit" disabled={pending} className="btn btn-fire mt-4">
        {pending ? "Sending…" : "Submit checkpoint"}
      </button>
    </form>
  );
}
