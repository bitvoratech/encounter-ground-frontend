"use client";

import { useId } from "react";
import type { PublishStatus } from "@/types/admin";

// Form fields for the admin editors (books, classes, lessons). Labels sit above fields, and
// hints and errors are tied to their field for screen readers.

/** A field's box, without spacing. */
export const fieldBase =
  "block w-full rounded-lg border border-rule bg-white px-3 py-2.5 text-slate-ink shadow-[inset_0_1px_1px_rgb(29_38_48/0.04)] transition-colors placeholder:text-stone hover:border-stone focus:border-slate";

export const fieldClass = `mt-2 ${fieldBase}`;

type Common = { label: string; hint?: React.ReactNode; optional?: boolean; className?: string };

function Label({ htmlFor, label, optional }: { htmlFor: string; label: string; optional?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="font-semibold text-slate-ink">
      {label}
      {optional && <span className="font-normal text-stone-muted"> (optional)</span>}
    </label>
  );
}

function Hint({ id, hint }: { id: string; hint?: React.ReactNode }) {
  return hint ? (
    <p id={id} className="mt-1 text-sm text-stone-muted">
      {hint}
    </p>
  ) : null;
}

export function TextField({
  label,
  hint,
  optional,
  className,
  value,
  onChange,
  ...rest
}: Common & { value: string; onChange: (value: string) => void } & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">) {
  const id = useId();
  return (
    <div className={className}>
      <Label htmlFor={id} label={label} optional={optional} />
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-describedby={hint ? `${id}-hint` : undefined}
        className={fieldClass}
        {...rest}
      />
      <Hint id={`${id}-hint`} hint={hint} />
    </div>
  );
}

export function TextArea({
  label,
  hint,
  optional,
  className,
  value,
  onChange,
  rows = 4,
  ...rest
}: Common & { value: string; onChange: (value: string) => void; rows?: number } & Omit<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    "value" | "onChange"
  >) {
  const id = useId();
  return (
    <div className={className}>
      <Label htmlFor={id} label={label} optional={optional} />
      <textarea
        id={id}
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-describedby={hint ? `${id}-hint` : undefined}
        className={fieldClass}
        {...rest}
      />
      <Hint id={`${id}-hint`} hint={hint} />
    </div>
  );
}

export function SelectField<T extends string>({
  label,
  hint,
  className,
  value,
  onChange,
  options,
}: Common & { value: T; onChange: (value: T) => void; options: { value: T; label: string }[] }) {
  const id = useId();
  return (
    <div className={className}>
      <Label htmlFor={id} label={label} />
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        aria-describedby={hint ? `${id}-hint` : undefined}
        className={`${fieldClass} min-h-11`}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <Hint id={`${id}-hint`} hint={hint} />
    </div>
  );
}

export const statusOptions: { value: PublishStatus; label: string }[] = [
  { value: "draft", label: "Draft: only the team can see it" },
  { value: "published", label: "Published: on the website" },
  { value: "archived", label: "Archived: taken off the website" },
];

export const statusLabel: Record<PublishStatus, string> = { draft: "Draft", published: "Published", archived: "Archived" };

export function StatusBadge({ status }: { status: PublishStatus }) {
  const tone =
    status === "published" ? "bg-flame/20 text-amber" : status === "draft" ? "bg-slate/10 text-slate" : "bg-rule text-stone-muted";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${tone}`}>
      <span aria-hidden="true" className={`size-1.5 rounded-full ${status === "published" ? "bg-amber-logo" : "bg-current opacity-60"}`} />
      {statusLabel[status]}
    </span>
  );
}

/** "Walking it out!" → "walking-it-out", for web addresses. */
export function slugify(text: string) {
  return text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/, "");
}

/** A form's error or success line, announced to screen readers. */
export function FormMessage({ error, saved }: { error: string; saved?: string }) {
  if (error)
    return (
      <p role="alert" className="text-sm font-semibold text-amber">
        {error}
      </p>
    );
  return (
    <p role="status" className="text-sm font-semibold text-slate">
      {saved}
    </p>
  );
}

export const errorText = (err: unknown) => (err instanceof Error ? err.message : "That didn’t save. Please try again.");
