"use client";

import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { replyToCheckpoint } from "@/lib/adminActions";

/**
 * A teacher's reply to a checkpoint. The student sees it on the lesson and their dashboard.
 * Once sent it shows as a note, with a way to change it.
 */
export function CheckpointReply({
  id,
  studentName,
  feedback,
  repliedBy,
}: {
  id: string;
  studentName: string;
  feedback: string | null;
  /** "Replied by Toyin Bello · 2 days ago", rendered on the server. */
  repliedBy: React.ReactNode;
}) {
  const router = useRouter();
  const fieldId = useId();
  const [editing, setEditing] = useState(!feedback);
  const [text, setText] = useState(feedback ?? "");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  if (feedback && !editing) {
    return (
      <div className="rounded-2xl bg-flame/10 p-4">
        <p className="text-sm font-semibold text-amber">{repliedBy}</p>
        <p className="mt-1 whitespace-pre-line text-slate-ink">{feedback}</p>
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="mt-2 text-sm font-semibold text-stone-muted underline-offset-4 hover:text-slate-ink hover:underline"
        >
          Change reply
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        if (!text.trim()) {
          setError("Write a reply before you send it.");
          return;
        }
        setError("");
        setPending(true);
        try {
          await replyToCheckpoint(id, text.trim());
          setEditing(false);
          router.refresh();
        } catch (err) {
          setError(err instanceof Error ? err.message : "Your reply didn’t send. Please try again.");
        } finally {
          setPending(false);
        }
      }}
    >
      <label htmlFor={fieldId} className="font-semibold text-slate-ink">
        Your reply to {studentName}
      </label>
      <textarea
        id={fieldId}
        rows={3}
        maxLength={2000}
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={pending}
        aria-invalid={!!error}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        placeholder="Encourage them, answer a question, or point them to a scripture."
        className="mt-2 w-full rounded-xl border border-rule bg-limestone p-3 text-slate-ink"
      />
      {error && (
        <p id={`${fieldId}-error`} role="alert" className="mt-1 text-sm font-semibold text-amber">
          {error}
        </p>
      )}
      <div className="mt-3 flex flex-wrap gap-3">
        <button type="submit" disabled={pending} className="btn btn-fire min-h-11 px-5 py-2">
          {pending ? "Sending…" : feedback ? "Save reply" : "Send reply"}
        </button>
        {feedback && (
          <button
            type="button"
            onClick={() => {
              setText(feedback);
              setError("");
              setEditing(false);
            }}
            className="btn btn-quiet min-h-11 px-5 py-2 text-slate-ink"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
