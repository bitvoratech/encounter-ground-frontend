"use client";

import { IconArrowRight } from "@tabler/icons-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSignedIn } from "@/components/layout/useFullScreenMenu";
import { findCourse } from "@/content/courses";
import { courseProgress, enrol, useCompleted, useEnrolments } from "@/lib/learning";
import { ProgressBar } from "./ProgressBar";

/**
 * Enrol, or carry on. Signed out: sign in first and come back here. Enrolled: progress and
 * the next lesson to open.
 */
export function EnrolButton({ courseSlug }: { courseSlug: string }) {
  const course = findCourse(courseSlug)!;
  const signedIn = useSignedIn();
  const enrolled = useEnrolments()?.includes(courseSlug) ?? false;
  const done = useCompleted();
  const [justEnrolled, setJustEnrolled] = useState(false);
  const continueRef = useRef<HTMLAnchorElement>(null);
  const progress = courseProgress(course, done);
  const lessonHref = (slug: string) => `/school/classes/${courseSlug}/${slug}`;

  // The Enrol button is replaced by "Start", so move focus there.
  useEffect(() => {
    if (justEnrolled && enrolled) continueRef.current?.focus();
  }, [justEnrolled, enrolled]);

  let body: React.ReactNode;
  if (signedIn === null || done === null) {
    body = <span className="btn btn-fire pointer-events-none opacity-60">Loading…</span>;
  } else if (enrolled) {
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
  } else if (!signedIn) {
    body = (
      <Link href={`/login?next=${encodeURIComponent(`/school/classes/${courseSlug}`)}`} className="btn btn-fire">
        Sign in to enrol
      </Link>
    );
  } else {
    body = (
      <button
        type="button"
        onClick={() => {
          enrol(courseSlug);
          setJustEnrolled(true);
        }}
        className="btn btn-fire"
      >
        Enrol in {course.name}
      </button>
    );
  }

  return (
    <div>
      {body}
      <p role="status" className="sr-only">
        {justEnrolled && enrolled ? `You’re enrolled in ${course.name}.` : ""}
      </p>
    </div>
  );
}
