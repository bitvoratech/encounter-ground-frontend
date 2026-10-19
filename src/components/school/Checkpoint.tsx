"use client";

import { IconCircleCheck } from "@tabler/icons-react";
import { useId, useRef, useState } from "react";
import { setLessonComplete, useCompleted } from "@/lib/learning";

/**
 * A written checkpoint at the end of a module, reviewed by a teacher (after GOMYCODE's
 * checkpoints). Submitting completes the lesson. With the backend, the text is saved for the
 * teacher; for now only the "submitted" state is kept.
 */
export function Checkpoint({ lessonId, prompt }: { lessonId: string; prompt: string }) {
  const id = useId();
  const submitted = useCompleted()?.includes(lessonId) ?? false;
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const statusRef = useRef<HTMLDivElement>(null);

  if (submitted) {
    return (
      <div ref={statusRef} tabIndex={-1} role="status" className="flex items-start gap-3 rounded-2xl border border-rule bg-chalk p-6 outline-none">
        <IconCircleCheck aria-hidden="true" size={26} stroke={1.75} className="shrink-0 text-amber" />
        <div>
          <p className="font-semibold text-slate-ink">Checkpoint submitted</p>
          <p className="mt-1 text-stone-muted">A teacher will read it and may reply on your dashboard.</p>
          <button
            type="button"
            onClick={() => setLessonComplete(lessonId, false)}
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
      onSubmit={(e) => {
        e.preventDefault();
        if (text.trim().length < 20) {
          setError("Write at least a couple of sentences before you submit.");
          return;
        }
        setError("");
        setLessonComplete(lessonId, true);
        requestAnimationFrame(() => statusRef.current?.focus());
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
        value={text}
        onChange={(e) => setText(e.target.value)}
        aria-describedby={`${id}-hint${error ? ` ${id}-error` : ""}`}
        aria-invalid={!!error}
        className="mt-4 w-full rounded-xl border border-rule bg-limestone p-4 text-slate-ink"
      />
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-2 text-sm font-semibold text-amber">
          {error}
        </p>
      )}
      <button type="submit" className="btn btn-fire mt-4">
        Submit checkpoint
      </button>
    </form>
  );
}
