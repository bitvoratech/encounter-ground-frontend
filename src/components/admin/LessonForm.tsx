"use client";

import { IconFile, IconTrash, IconUpload } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { lessonKinds } from "@/components/school/lessonKinds";
import { createLesson, deleteLesson, updateLesson, uploadLessonFile } from "@/lib/adminActions";
import { videoEmbedUrl } from "@/lib/videoEmbed";
import type { AdminLesson, AdminLessonKind } from "@/types/admin";
import { errorText, FormMessage, SelectField, TextArea, TextField } from "./fields";
import { card } from "./ui";

const kindOptions = (Object.keys(lessonKinds) as AdminLessonKind[]).map((k) => ({ value: k, label: lessonKinds[k].label }));

const kindHelp: Record<AdminLessonKind, string> = {
  video: "A YouTube or Vimeo video, with optional notes underneath.",
  audio: "An audio file (MP3 or M4A) students play on the page, with optional notes.",
  text: "Written teaching that students read on the page.",
  pdf: "A PDF study guide students open or download, with optional notes.",
  checkpoint: "Students write a short reflection; a teacher replies from the Checkpoints page.",
  quiz: "The class’s final check. Its questions are set on the class page.",
};

const fileTypes: Partial<Record<AdminLessonKind, { accept: string; label: string }>> = {
  pdf: { accept: "application/pdf", label: "PDF" },
  audio: { accept: "audio/mpeg,audio/mp4,audio/x-m4a,audio/aac,audio/wav,audio/ogg", label: "audio file" },
};

const MAX_FILE = 100 * 1024 * 1024;

const fileName = (path: string) => path.split("/").pop() ?? path;

/** Add or edit one lesson: its kind, title and content. */
export function LessonForm({ courseId, moduleId, lesson }: { courseId: string; moduleId?: string; lesson?: AdminLesson }) {
  const router = useRouter();
  const [title, setTitle] = useState(lesson?.title ?? "");
  const [kind, setKind] = useState<AdminLessonKind>(lesson?.kind ?? "video");
  const [body, setBody] = useState(lesson?.body ?? "");
  const [video, setVideo] = useState(lesson?.video_url ?? "");
  const [file, setFile] = useState(lesson?.attachment_path ?? "");
  const [prompt, setPrompt] = useState(lesson?.prompt ?? "");
  const [minutes, setMinutes] = useState(lesson?.minutes ? String(lesson.minutes) : "");
  const [preview, setPreview] = useState(lesson?.preview ?? false);
  const [uploading, setUploading] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const fileType = fileTypes[kind];
  const back = `/admin/classes/${courseId}`;

  return (
    <form
      noValidate
      onSubmit={async (e) => {
        e.preventDefault();
        setError("");
        setSaved("");
        if (kind === "video" && video && !videoEmbedUrl(video)) return setError("That doesn’t look like a YouTube or Vimeo video link.");
        if (kind === "checkpoint" && !prompt.trim()) return setError("Write the question students answer in this checkpoint.");
        setPending(true);
        const data = {
          title,
          kind,
          body,
          video_url: kind === "video" ? video : "",
          attachment_path: fileType ? file : "",
          prompt: kind === "checkpoint" ? prompt : "",
          minutes: Number(minutes) || 0,
          preview,
        };
        try {
          if (lesson) {
            await updateLesson(lesson.id, data);
            setSaved("Saved.");
            router.refresh();
          } else {
            await createLesson(moduleId!, data);
            router.push(back);
            router.refresh();
          }
        } catch (err) {
          setError(errorText(err));
        } finally {
          setPending(false);
        }
      }}
      className="grid gap-6"
    >
      <section aria-label="Lesson" className={`${card} grid gap-5`}>
        <TextField label="Title" required maxLength={200} value={title} onChange={setTitle} />
        <div className="grid gap-5 sm:grid-cols-2">
          <SelectField label="Kind of lesson" value={kind} onChange={setKind} options={kindOptions} hint={kindHelp[kind]} />
          <TextField
            label="Length in minutes"
            optional
            type="number"
            min={0}
            max={600}
            inputMode="numeric"
            value={minutes}
            onChange={setMinutes}
          />
        </div>
        <label className="flex items-start gap-3">
          <input type="checkbox" checked={preview} onChange={(e) => setPreview(e.target.checked)} className="mt-1 size-5 accent-[var(--color-slate)]" />
          <span>
            <span className="font-semibold text-slate-ink">Free preview</span>
            <span className="block text-sm text-stone-muted">Anyone can open this lesson without enrolling.</span>
          </span>
        </label>
      </section>

      {kind !== "quiz" && (
        <section aria-labelledby="lesson-content" className={`${card} grid gap-5`}>
          <h2 id="lesson-content" className="font-display text-xl text-slate-ink">
            Content
          </h2>

          {kind === "video" && (
            <TextField
              label="Video link"
              type="url"
              placeholder="https://www.youtube.com/watch?v=…"
              value={video}
              onChange={setVideo}
              hint="Paste the YouTube or Vimeo address. Unlisted YouTube videos work and stay off the channel’s page."
            />
          )}

          {fileType && (
            <div>
              <p className="font-semibold text-slate-ink">The {fileType.label}</p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                {file && (
                  <span className="inline-flex min-w-0 items-center gap-2 rounded-xl bg-limestone px-3 py-2 text-sm text-slate-ink">
                    <IconFile aria-hidden="true" size={18} stroke={1.75} className="shrink-0 text-amber" />
                    <span className="truncate">{fileName(file)}</span>
                  </span>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept={fileType.accept}
                  className="sr-only"
                  tabIndex={-1}
                  aria-hidden="true"
                  onChange={async (e) => {
                    const chosen = e.target.files?.[0];
                    e.target.value = "";
                    if (!chosen) return;
                    if (chosen.size > MAX_FILE) return setError("The file must be smaller than 100 MB.");
                    setError("");
                    setUploading(true);
                    try {
                      setFile(await uploadLessonFile(chosen));
                      setSaved(lesson ? "File uploaded. Save the lesson to keep it." : "File uploaded.");
                    } catch (err) {
                      setError(errorText(err));
                    } finally {
                      setUploading(false);
                    }
                  }}
                />
                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => fileRef.current?.click()}
                  className="btn btn-quiet min-h-11 px-5 py-2 text-slate-ink"
                >
                  <IconUpload aria-hidden="true" size={18} stroke={1.75} />
                  {uploading ? "Uploading…" : file ? "Replace file" : `Upload a ${fileType.label}`}
                </button>
              </div>
              <p className="mt-1 text-sm text-stone-muted">Up to 100 MB. Only enrolled students can open it.</p>
            </div>
          )}

          {kind === "checkpoint" && (
            <TextArea
              label="What students write about"
              rows={3}
              maxLength={1000}
              value={prompt}
              onChange={setPrompt}
              placeholder="Share a passage you read this week and one thing you will do because of it."
            />
          )}

          <TextArea
            label={kind === "text" ? "The teaching" : "Notes"}
            optional={kind !== "text"}
            rows={kind === "text" ? 16 : 6}
            maxLength={50000}
            value={body}
            onChange={setBody}
            hint="Leave a blank line between paragraphs."
          />
        </section>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={pending || uploading} className="btn btn-fire min-h-11 px-6 py-2">
          {pending ? "Saving…" : lesson ? "Save lesson" : "Add the lesson"}
        </button>
        <FormMessage error={error} saved={saved} />
        {lesson && <DeleteLesson lesson={lesson} back={back} />}
      </div>
    </form>
  );
}

function DeleteLesson({ lesson, back }: { lesson: AdminLesson; back: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  return (
    <div className="ms-auto text-right">
      <button
        type="button"
        onClick={async () => {
          if (!window.confirm(`Delete “${lesson.title}”? Students’ progress and answers on this lesson are deleted too.`)) return;
          setError("");
          try {
            await deleteLesson(lesson.id);
            router.push(back);
            router.refresh();
          } catch (err) {
            setError(errorText(err));
          }
        }}
        className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold text-stone-muted hover:text-slate-ink"
      >
        <IconTrash aria-hidden="true" size={18} stroke={1.75} />
        Delete lesson
      </button>
      {error && (
        <p role="alert" className="mt-1 max-w-xs text-sm font-semibold text-amber">
          {error}
        </p>
      )}
    </div>
  );
}
