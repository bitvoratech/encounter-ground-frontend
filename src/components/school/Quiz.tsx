"use client";

import { IconCheck, IconX } from "@tabler/icons-react";
import { useRef, useState } from "react";
import type { QuizQuestion } from "@/content/courses";
import { setLessonComplete, useCompleted } from "@/lib/learning";

/** The final check: answer, see what was right and why, retry until everything is right. */
export function Quiz({ lessonId, questions }: { lessonId: string; questions: QuizQuestion[] }) {
  const passed = useCompleted()?.includes(lessonId) ?? false;
  const [answers, setAnswers] = useState<(number | null)[]>(() => questions.map(() => null));
  const [checked, setChecked] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const score = answers.filter((a, i) => a === questions[i]!.answer).length;
  const allAnswered = answers.every((a) => a !== null);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!allAnswered) return;
        setChecked(true);
        if (score === questions.length) setLessonComplete(lessonId, true);
        requestAnimationFrame(() => resultRef.current?.focus());
      }}
      className="grid gap-6"
    >
      {passed && !checked && (
        <p role="status" className="rounded-2xl bg-flame/15 px-4 py-3 font-semibold text-amber">
          You’ve passed this final check. You can take it again any time.
        </p>
      )}
      {questions.map((q, qi) => {
        const chosen = answers[qi];
        const right = chosen === q.answer;
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
                    checked={chosen === oi}
                    onChange={() => {
                      setAnswers((a) => a.map((v, i) => (i === qi ? oi : v)));
                      setChecked(false);
                    }}
                    className="size-5 accent-slate"
                  />
                  <span className="text-slate-ink">{option}</span>
                </label>
              ))}
            </div>
            {checked && (
              <p className={`mt-4 flex items-start gap-2 text-sm ${right ? "text-slate-ink" : "text-amber"}`}>
                {right ? (
                  <IconCheck aria-hidden="true" size={18} stroke={2.5} className="mt-0.5 shrink-0 text-amber-logo" />
                ) : (
                  <IconX aria-hidden="true" size={18} stroke={2.5} className="mt-0.5 shrink-0" />
                )}
                <span>
                  <span className="font-semibold">{right ? "Right. " : "Not quite. "}</span>
                  {q.why}
                </span>
              </p>
            )}
          </fieldset>
        );
      })}

      <div ref={resultRef} tabIndex={-1} role="status" className="outline-none">
        {checked && (
          <p className="font-display text-2xl text-slate-ink">
            {score === questions.length
              ? `All ${questions.length} right. Final check passed.`
              : `${score} of ${questions.length} right. Look at the notes above and try again.`}
          </p>
        )}
      </div>
      <button type="submit" disabled={!allAnswered} className="btn btn-fire justify-self-start disabled:opacity-60">
        {checked && score !== questions.length ? "Check again" : "Check my answers"}
      </button>
    </form>
  );
}
