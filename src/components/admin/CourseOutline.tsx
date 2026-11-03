"use client";

import { IconArrowDown, IconArrowUp, IconEye, IconPencil, IconPlus, IconTrash } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatMinutes, lessonKinds } from "@/components/school/lessonKinds";
import { createModule, deleteModule, reorderCourse, updateModule } from "@/lib/adminActions";
import type { AdminCourse, AdminLesson, AdminModule } from "@/types/admin";
import { errorText, TextArea, TextField } from "./fields";
import { card } from "./ui";

const iconButton =
  "grid size-10 shrink-0 place-items-center rounded-full text-stone-muted transition-colors hover:bg-limestone hover:text-slate-ink disabled:pointer-events-none disabled:opacity-30";

type Outline = AdminModule[];

const orderOf = (outline: Outline) => outline.map((m) => ({ id: m.id, lessons: m.lessons.map((l) => l.id) }));

/** Move a module up or down. */
function moveModule(outline: Outline, index: number, by: -1 | 1): Outline {
  const next = [...outline];
  const [m] = next.splice(index, 1);
  next.splice(index + by, 0, m!);
  return next;
}

/** Move a lesson up or down; at the edge of a module it moves into the neighbouring one. */
function moveLesson(outline: Outline, mi: number, li: number, by: -1 | 1): Outline {
  const next = outline.map((m) => ({ ...m, lessons: [...m.lessons] }));
  const from = next[mi]!;
  const [lesson] = from.lessons.splice(li, 1);
  const target = li + by;
  if (target >= 0 && target <= from.lessons.length) from.lessons.splice(target, 0, lesson!);
  else if (by < 0) next[mi - 1]!.lessons.push(lesson!);
  else next[mi + 1]!.lessons.unshift(lesson!);
  return next;
}

/** The class's modules and lessons: add, rename, reorder and remove them. */
export function CourseOutline({ course }: { course: AdminCourse }) {
  const router = useRouter();
  const [outline, setOutline] = useState(course.modules);
  const [synced, setSynced] = useState(course.modules);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  // A fresh outline from the server (after an edit or a refresh) replaces the local one.
  if (course.modules !== synced) {
    setSynced(course.modules);
    setOutline(course.modules);
  }

  async function reorder(next: Outline) {
    const previous = outline;
    setOutline(next);
    setPending(true);
    setError("");
    try {
      await reorderCourse(course.id, orderOf(next));
      router.refresh();
    } catch (err) {
      setOutline(previous);
      setError(errorText(err));
    } finally {
      setPending(false);
    }
  }

  const lessonCount = outline.reduce((n, m) => n + m.lessons.length, 0);

  return (
    <section aria-labelledby="class-outline" className="grid gap-4">
      <div>
        <h2 id="class-outline" className="font-display text-2xl text-slate-ink">
          Modules and lessons
        </h2>
        <p className="mt-1 text-stone-muted">
          {outline.length === 1 ? "1 module" : `${outline.length} modules`}, {lessonCount === 1 ? "1 lesson" : `${lessonCount} lessons`}. Use
          the arrows to change the order; a lesson at the top or bottom of a module moves into the next one.
        </p>
      </div>
      {error && (
        <p role="alert" className="font-semibold text-amber">
          {error}
        </p>
      )}

      <ol className="grid gap-4" aria-busy={pending}>
        {outline.map((module, mi) => (
          <li key={module.id} className={`${card} grid gap-4`}>
            <ModuleHeader
              module={module}
              index={mi}
              count={outline.length}
              disabled={pending}
              onMove={(by) => reorder(moveModule(outline, mi, by))}
            />
            {module.lessons.length > 0 ? (
              <ol className="grid divide-y divide-rule rounded-2xl border border-rule">
                {module.lessons.map((lesson, li) => (
                  <LessonRow
                    key={lesson.id}
                    courseId={course.id}
                    lesson={lesson}
                    canUp={li > 0 || mi > 0}
                    canDown={li < module.lessons.length - 1 || mi < outline.length - 1}
                    disabled={pending}
                    onMove={(by) => reorder(moveLesson(outline, mi, li, by))}
                  />
                ))}
              </ol>
            ) : (
              <p className="rounded-2xl border border-dashed border-rule p-4 text-sm text-stone-muted">No lessons in this module yet.</p>
            )}
            <Link
              href={`/admin/classes/${course.id}/lessons/new?module=${module.id}`}
              className="btn btn-quiet min-h-11 justify-self-start px-5 py-2 text-slate-ink"
            >
              <IconPlus aria-hidden="true" size={18} stroke={2} />
              Add a lesson
            </Link>
          </li>
        ))}
      </ol>

      <AddModule courseId={course.id} />
    </section>
  );
}

function ModuleHeader({
  module,
  index,
  count,
  disabled,
  onMove,
}: {
  module: AdminModule;
  index: number;
  count: number;
  disabled: boolean;
  onMove: (by: -1 | 1) => void;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(module.title);
  const [summary, setSummary] = useState(module.summary ?? "");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  if (editing)
    return (
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setPending(true);
          setError("");
          try {
            await updateModule(module.id, { title, summary });
            setEditing(false);
            router.refresh();
          } catch (err) {
            setError(errorText(err));
          } finally {
            setPending(false);
          }
        }}
        className="grid gap-4"
      >
        <TextField label={`Module ${index + 1} title`} required maxLength={200} value={title} onChange={setTitle} />
        <TextArea label="Summary" optional rows={2} maxLength={1000} value={summary} onChange={setSummary} />
        <div className="flex flex-wrap items-center gap-3">
          <button type="submit" disabled={pending} className="btn btn-fire min-h-11 px-5 py-2">
            {pending ? "Saving…" : "Save module"}
          </button>
          <button type="button" onClick={() => setEditing(false)} className="btn btn-quiet min-h-11 px-5 py-2 text-slate-ink">
            Cancel
          </button>
          {error && (
            <p role="alert" className="text-sm font-semibold text-amber">
              {error}
            </p>
          )}
        </div>
      </form>
    );

  return (
    <div className="flex flex-wrap items-start gap-3">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-amber">Module {index + 1}</p>
        <h3 className="font-display text-xl text-slate-ink">{module.title}</h3>
        {module.summary && <p className="mt-1 text-sm text-stone-muted">{module.summary}</p>}
        {error && (
          <p role="alert" className="mt-1 text-sm font-semibold text-amber">
            {error}
          </p>
        )}
      </div>
      <div className="flex items-center">
        <button type="button" className={iconButton} disabled={disabled || index === 0} onClick={() => onMove(-1)} aria-label={`Move module ${module.title} up`}>
          <IconArrowUp aria-hidden="true" size={18} stroke={2} />
        </button>
        <button
          type="button"
          className={iconButton}
          disabled={disabled || index === count - 1}
          onClick={() => onMove(1)}
          aria-label={`Move module ${module.title} down`}
        >
          <IconArrowDown aria-hidden="true" size={18} stroke={2} />
        </button>
        <button type="button" className={iconButton} onClick={() => setEditing(true)} aria-label={`Rename module ${module.title}`}>
          <IconPencil aria-hidden="true" size={18} stroke={1.75} />
        </button>
        <button
          type="button"
          className={iconButton}
          disabled={disabled}
          aria-label={`Delete module ${module.title}`}
          onClick={async () => {
            if (module.lessons.length > 0) return setError("Move or delete this module’s lessons first.");
            if (!window.confirm(`Delete the module “${module.title}”?`)) return;
            setError("");
            try {
              await deleteModule(module.id);
              router.refresh();
            } catch (err) {
              setError(errorText(err));
            }
          }}
        >
          <IconTrash aria-hidden="true" size={18} stroke={1.75} />
        </button>
      </div>
    </div>
  );
}

function LessonRow({
  courseId,
  lesson,
  canUp,
  canDown,
  disabled,
  onMove,
}: {
  courseId: string;
  lesson: AdminLesson;
  canUp: boolean;
  canDown: boolean;
  disabled: boolean;
  onMove: (by: -1 | 1) => void;
}) {
  const { label, Icon } = lessonKinds[lesson.kind];
  const hasContent =
    lesson.kind === "checkpoint" || lesson.kind === "quiz" || !!(lesson.body || lesson.video_url || lesson.attachment_path);
  return (
    <li className="flex items-center gap-2 p-2 pl-4">
      <Icon aria-hidden="true" size={20} stroke={1.75} className="shrink-0 text-amber" />
      <Link href={`/admin/classes/${courseId}/lessons/${lesson.id}`} className="min-w-0 flex-1 py-1 hover:underline">
        <span className="block truncate font-semibold text-slate-ink">{lesson.title}</span>
        <span className="flex flex-wrap gap-x-3 text-sm text-stone-muted">
          <span>{label}</span>
          {lesson.minutes > 0 && <span>{formatMinutes(lesson.minutes)}</span>}
          {lesson.preview && (
            <span className="inline-flex items-center gap-1">
              <IconEye aria-hidden="true" size={14} stroke={2} />
              Free preview
            </span>
          )}
          {!hasContent && <span className="font-semibold text-amber">No content yet</span>}
        </span>
      </Link>
      <button type="button" className={iconButton} disabled={disabled || !canUp} onClick={() => onMove(-1)} aria-label={`Move ${lesson.title} up`}>
        <IconArrowUp aria-hidden="true" size={18} stroke={2} />
      </button>
      <button type="button" className={iconButton} disabled={disabled || !canDown} onClick={() => onMove(1)} aria-label={`Move ${lesson.title} down`}>
        <IconArrowDown aria-hidden="true" size={18} stroke={2} />
      </button>
    </li>
  );
}

function AddModule({ courseId }: { courseId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  if (!open)
    return (
      <button type="button" onClick={() => setOpen(true)} className="btn btn-quiet min-h-11 justify-self-start px-5 py-2 text-slate-ink">
        <IconPlus aria-hidden="true" size={18} stroke={2} />
        Add a module
      </button>
    );

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setPending(true);
        setError("");
        try {
          await createModule(courseId, { title, summary });
          setTitle("");
          setSummary("");
          setOpen(false);
          router.refresh();
        } catch (err) {
          setError(errorText(err));
        } finally {
          setPending(false);
        }
      }}
      className={`${card} grid gap-4`}
    >
      <TextField label="New module title" required maxLength={200} value={title} onChange={setTitle} autoFocus />
      <TextArea label="Summary" optional rows={2} maxLength={1000} value={summary} onChange={setSummary} />
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={pending} className="btn btn-fire min-h-11 px-5 py-2">
          {pending ? "Adding…" : "Add module"}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="btn btn-quiet min-h-11 px-5 py-2 text-slate-ink">
          Cancel
        </button>
        {error && (
          <p role="alert" className="text-sm font-semibold text-amber">
            {error}
          </p>
        )}
      </div>
    </form>
  );
}
