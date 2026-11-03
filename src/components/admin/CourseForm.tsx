"use client";

import { IconTrash } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createCourse, deleteCourse, updateCourse } from "@/lib/adminActions";
import type { AdminCourse } from "@/types/admin";
import { errorText, FormMessage, SelectField, slugify, statusOptions, TextArea, TextField } from "./fields";
import { card } from "./ui";

/** A class's details: name, address, what it is about, and whether it is on the website. */
export function CourseForm({ course }: { course?: AdminCourse }) {
  const router = useRouter();
  const [title, setTitle] = useState(course?.title ?? "");
  const [slug, setSlug] = useState(course?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!course);
  const [summary, setSummary] = useState(course?.summary ?? "");
  const [description, setDescription] = useState(course?.description ?? "");
  const [meaning, setMeaning] = useState(course?.meaning ?? "");
  const [badge, setBadge] = useState(course?.badge ?? "");
  const [outcomes, setOutcomes] = useState((course?.outcomes ?? []).join("\n"));
  const [order, setOrder] = useState(String(course?.sort_order ?? 0));
  const [status, setStatus] = useState(course?.status ?? "draft");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState("");

  return (
    <form
      noValidate
      onSubmit={async (e) => {
        e.preventDefault();
        setError("");
        setSaved("");
        const lessons = course?.modules.reduce((n, m) => n + m.lessons.length, 0) ?? 0;
        if (status === "published" && lessons === 0)
          return setError(course ? "Add at least one lesson before publishing the class." : "Save the class as a draft, add its lessons, then publish it.");
        setPending(true);
        const data = {
          title,
          slug,
          summary,
          description,
          meaning,
          badge,
          outcomes: outcomes
            .split("\n")
            .map((o) => o.trim())
            .filter(Boolean),
          sort_order: Number(order) || 0,
          status,
        };
        try {
          if (course) {
            await updateCourse(course.id, data);
            setSaved("Saved.");
            router.refresh();
          } else {
            const { id } = await createCourse(data);
            router.push(`/admin/classes/${id}`);
          }
        } catch (err) {
          setError(errorText(err));
        } finally {
          setPending(false);
        }
      }}
      className={`${card} grid gap-5`}
      aria-labelledby="class-details"
    >
      <h2 id="class-details" className="font-display text-xl text-slate-ink">
        Class details
      </h2>
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Class name"
          required
          maxLength={120}
          value={title}
          onChange={(v) => {
            setTitle(v);
            if (!slugTouched) setSlug(slugify(v));
          }}
        />
        <TextField
          label="Web address"
          required
          maxLength={80}
          value={slug}
          onChange={(v) => {
            setSlugTouched(true);
            setSlug(v.toLowerCase().replace(/\s+/g, "-"));
          }}
          hint={
            <>
              At <span className="font-mono">/school/classes/{slug || "…"}</span>
            </>
          }
        />
        <TextField
          label="Meaning of the name"
          optional
          maxLength={120}
          value={meaning}
          onChange={setMeaning}
          placeholder="Hebrew for “to walk”"
        />
        <TextField label="Badge" optional maxLength={40} value={badge} onChange={setBadge} placeholder="Start here" />
      </div>
      <TextArea
        label="Summary"
        rows={3}
        maxLength={600}
        value={summary}
        onChange={setSummary}
        hint="One or two sentences, shown on the list of classes."
      />
      <TextArea label="Longer description" optional rows={5} maxLength={5000} value={description} onChange={setDescription} />
      <TextArea
        label="What students will learn"
        optional
        rows={4}
        value={outcomes}
        onChange={setOutcomes}
        hint="One per line, up to 12."
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <SelectField label="Status" value={status} onChange={setStatus} options={statusOptions} />
        <TextField
          label="Position in the list"
          type="number"
          min={0}
          inputMode="numeric"
          value={order}
          onChange={setOrder}
          hint="Lower numbers come first."
        />
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={pending} className="btn btn-fire min-h-11 px-6 py-2">
          {pending ? "Saving…" : course ? "Save details" : "Add the class"}
        </button>
        <FormMessage error={error} saved={saved} />
        {course && <DeleteCourse course={course} />}
      </div>
    </form>
  );
}

function DeleteCourse({ course }: { course: AdminCourse }) {
  const router = useRouter();
  const [error, setError] = useState("");
  return (
    <div className="ms-auto text-right">
      <button
        type="button"
        onClick={async () => {
          if (!window.confirm(`Delete the class “${course.title}” with all its modules and lessons? This can’t be undone.`)) return;
          setError("");
          try {
            await deleteCourse(course.id);
            router.push("/admin/classes");
            router.refresh();
          } catch (err) {
            setError(errorText(err));
          }
        }}
        className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold text-stone-muted hover:text-slate-ink"
      >
        <IconTrash aria-hidden="true" size={18} stroke={1.75} />
        Delete class
      </button>
      {error && (
        <p role="alert" className="mt-1 max-w-xs text-sm font-semibold text-amber">
          {error}
        </p>
      )}
    </div>
  );
}
