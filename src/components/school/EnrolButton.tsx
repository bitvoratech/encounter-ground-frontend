"use client";

import { IconArrowRight } from "@tabler/icons-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { courseProgress } from "@/lib/courses";
import { enrol, enrolmentFor, useLearning } from "@/lib/learning";
import type { Course } from "@/types/school";
import { ProgressBar } from "./ProgressBar";

/**
 * Enrol, or carry on. Signed out: sign in first and come back here. Enrolled: progress and
 * the next lesson to open.
 */
export function EnrolButton({ course }: { course: Course }) {
  const learning = useLearning();
  const enrolment = enrolmentFor(learning, course.slug);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [justEnrolled, setJustEnrolled] = useState(false);
  const continueRef = useRef<HTMLAnchorElement>(null);
  const progress = courseProgress(course, enrolment?.completed ?? []);
  const lessonHref = (slug: string) => `/school/classes/${course.slug}/${slug}`;

  // The Enrol button is replaced by "Start", so move focus there.
  useEffect(() => {
    if (justEnrolled && enrolment) continueRef.current?.focus();
  }, [justEnrolled, enrolment]);

  let body: React.ReactNode;
  if (learning.status === "loading") {
    body = <span className="btn btn-fire pointer-events-none opacity-60">Loading…</span>;
  } else if (learning.status === "error") {
    body = <p className="font-semibold text-amber">Your classes can’t be loaded right now. Please refresh in a moment.</p>;
  } else if (enrolment) {
    body = (
      <div className="grid w-full max-w-md gap-4">
        <ProgressBar finished={progress.finished} total={progress.total} />
        <Link ref={continueRef} href={lessonHref(progress.next.lesson.slug)} className="btn btn-fire self-start">
          {progress.complete ? "Review the class" : progress.finished === 0 ? "Start the first lesson" : "Continue learning"}
          <IconArrowRight aria-hidden="true" size={18} stroke={2} />
        </Link>
        {!progress.complete && progress.finished > 0 && (
          <p className="text-sm text-stone-muted">Next: {progress.next.lesson.title}</p>
        )}
      </div>
    );
  } else if (learning.status === "signed-out") {
    body = (
      <Link href={`/login?next=${encodeURIComponent(`/school/classes/${course.slug}`)}`} className="btn btn-fire">
        Sign in to enrol
      </Link>
    );
  } else {
    body = (
      <button
        type="button"
        disabled={pending}
        onClick={async () => {
          setPending(true);
          setError("");
          try {
            await enrol(course.slug);
            setJustEnrolled(true);
          } catch (err) {
            setError(err instanceof Error ? err.message : "Enrolling didn’t work. Please try again.");
          } finally {
            setPending(false);
          }
        }}
        className="btn btn-fire"
      >
        {pending ? "Enrolling…" : `Enrol in ${course.name}`}
      </button>
    );
  }

  return (
    <div>
      {body}
      {error && (
        <p role="alert" className="mt-3 text-sm font-semibold text-amber">
          {error}
        </p>
      )}
      <p role="status" className="sr-only">
        {justEnrolled && enrolment ? `You’re enrolled in ${course.name}.` : ""}
      </p>
    </div>
  );
}
