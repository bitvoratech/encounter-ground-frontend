"use client";

import { IconCheck, IconX } from "@tabler/icons-react";
import { useRef, useState } from "react";
import { submitQuiz } from "@/lib/learning";
import type { QuizQuestion, QuizResult } from "@/types/school";

/**
 * The final check, marked by the server: answer, see what was right and why, and retry until
 * everything is right. Passing completes the lesson.
 */
export function Quiz({
  courseSlug,
  lessonSlug,
  questions,
  passed,
}: {
  courseSlug: string;
  lessonSlug: string;
  questions: QuizQuestion[];
  passed: boolean;
}) {
  const [answers, setAnswers] = useState<(number | null)[]>(() => questions.map(() => null));
  const [result, setResult] = useState<QuizResult | null>(null);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const allAnswered = answers.every((a) => a !== null);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        if (!allAnswered || pending) return;
        setPending(true);
        setError("");
        try {
          setResult(await submitQuiz(courseSlug, lessonSlug, answers as number[]));
          requestAnimationFrame(() => resultRef.current?.focus());
        } catch (err) {
          setError(err instanceof Error ? err.message : "Your answers didn’t send. Please try again.");
        } finally {
          setPending(false);
        }
      }}
      className="grid gap-6"
    >
      {passed && !result && (
        <p role="status" className="rounded-2xl bg-flame/15 px-4 py-3 font-semibold text-amber">
          You’ve passed this final check. You can take it again any time.
        </p>
      )}
      {questions.map((q, qi) => {
        const feedback = result?.results[qi];
        return (
          <fieldset key={q.question} className="rounded-2xl border border-rule bg-chalk p-5 md:p-6">
            {/* Floated so the legend sits inside the card instead of across its border */}
            <legend className="float-left w-full font-display text-xl leading-snug text-slate-ink">
              <span className="text-amber">{qi + 1}.</span> {q.question}
            </legend>
            <div className="clear-both grid gap-2 pt-4">
              {q.options.map((option, oi) => (
                <label
                  key={option}
                  className="flex cursor-pointer items-center gap-3 rounded-xl border border-rule bg-limestone px-4 py-3 has-checked:border-slate has-checked:bg-chalk"
                >
                  <input
                    type="radio"
                    name={`q${qi}`}
                    checked={answers[qi] === oi}
                    onChange={() => {
                      setAnswers((a) => a.map((v, i) => (i === qi ? oi : v)));
                      setResult(null);
                    }}
                    className="size-5 accent-slate"
                  />
                  <span className="text-slate-ink">{option}</span>
                </label>
              ))}
            </div>
            {feedback && (
              <p className={`mt-4 flex items-start gap-2 text-sm ${feedback.correct ? "text-slate-ink" : "text-amber"}`}>
                {feedback.correct ? (
                  <IconCheck aria-hidden="true" size={18} stroke={2.5} className="mt-0.5 shrink-0 text-amber-logo" />
                ) : (
                  <IconX aria-hidden="true" size={18} stroke={2.5} className="mt-0.5 shrink-0" />
                )}
                <span>
                  <span className="font-semibold">{feedback.correct ? "Right. " : "Not quite. "}</span>
                  {feedback.explanation}
                </span>
              </p>
            )}
          </fieldset>
        );
      })}

      <div ref={resultRef} tabIndex={-1} role="status" className="outline-none">
        {result && (
          <p className="font-display text-2xl text-slate-ink">
            {result.passed
              ? `All ${result.total} right. Final check passed.`
              : `${result.score} of ${result.total} right. Look at the notes above and try again.`}
          </p>
        )}
      </div>
      {error && (
        <p role="alert" className="font-semibold text-amber">
          {error}
        </p>
      )}
      <button type="submit" disabled={!allAnswered || pending} className="btn btn-fire justify-self-start disabled:opacity-60">
        {pending ? "Checking…" : result && !result.passed ? "Check again" : "Check my answers"}
      </button>
    </form>
  );
}
