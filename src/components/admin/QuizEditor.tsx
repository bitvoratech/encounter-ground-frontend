"use client";

import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { saveQuiz } from "@/lib/adminActions";
import type { AdminQuizQuestion } from "@/types/admin";
import { errorText, fieldBase, FormMessage, TextArea, TextField } from "./fields";
import { card } from "./ui";

type Draft = { question: string; options: string[]; answer_index: number; explanation: string };

const blank = (): Draft => ({ question: "", options: ["", ""], answer_index: 0, explanation: "" });

/** The class's final check: multiple-choice questions; students pass by getting every one right. */
export function QuizEditor({ courseId, quiz, hasQuizLesson }: { courseId: string; quiz: AdminQuizQuestion[]; hasQuizLesson: boolean }) {
  const router = useRouter();
  const [questions, setQuestions] = useState<Draft[]>(quiz.map((q) => ({ ...q, explanation: q.explanation ?? "" })));
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState("");

  const change = (i: number, patch: Partial<Draft>) => {
    setSaved("");
    setQuestions((qs) => qs.map((q, j) => (j === i ? { ...q, ...patch } : q)));
  };

  return (
    <section aria-labelledby="final-check" className={`${card} grid gap-5`}>
      <div>
        <h2 id="final-check" className="font-sans text-xl font-bold text-slate-ink">
          Final check
        </h2>
        <p className="mt-1 max-w-2xl text-stone-muted">
          Multiple-choice questions for the class’s “Final check” lesson. Students pass by answering every question correctly, and
          see the explanation after they answer.
        </p>
        {!hasQuizLesson && questions.length > 0 && (
          <p className="mt-2 text-sm font-semibold text-amber">
            Students only see these once the class has a lesson of the kind “Final check”.
          </p>
        )}
      </div>

      <ol className="grid gap-5">
        {questions.map((q, i) => (
          <li key={i} className="grid gap-4 rounded-2xl border border-rule p-4">
            <div className="flex items-start gap-3">
              <TextField
                className="flex-1"
                label={`Question ${i + 1}`}
                maxLength={500}
                value={q.question}
                onChange={(v) => change(i, { question: v })}
              />
              <button
                type="button"
                onClick={() => setQuestions((qs) => qs.filter((_, j) => j !== i))}
                aria-label={`Remove question ${i + 1}`}
                className="mt-8 grid size-10 shrink-0 place-items-center rounded-full text-stone-muted hover:bg-limestone hover:text-slate-ink"
              >
                <IconTrash aria-hidden="true" size={18} stroke={1.75} />
              </button>
            </div>
            <Options draft={q} index={i} onChange={(patch) => change(i, patch)} />
            <TextArea
              label="Explanation"
              optional
              rows={2}
              maxLength={1000}
              value={q.explanation}
              onChange={(v) => change(i, { explanation: v })}
            />
          </li>
        ))}
      </ol>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={() => setQuestions((qs) => [...qs, blank()])}
          className="btn btn-quiet min-h-11 px-5 py-2 text-slate-ink"
        >
          <IconPlus aria-hidden="true" size={18} stroke={2} />
          Add a question
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={async () => {
            setError("");
            setSaved("");
            setPending(true);
            try {
              await saveQuiz(
                courseId,
                questions.map((q) => ({ ...q, options: q.options.map((o) => o.trim()), explanation: q.explanation || null })),
              );
              setSaved("Final check saved.");
              router.refresh();
            } catch (err) {
              setError(errorText(err));
            } finally {
              setPending(false);
            }
          }}
          className="btn btn-fire min-h-11 px-5 py-2"
        >
          {pending ? "Saving…" : "Save final check"}
        </button>
        <FormMessage error={error} saved={saved} />
      </div>
    </section>
  );
}

function Options({ draft, index, onChange }: { draft: Draft; index: number; onChange: (patch: Partial<Draft>) => void }) {
  const name = useId();
  return (
    <fieldset className="grid gap-2">
      <legend className="font-semibold text-slate-ink">Answers</legend>
      <p className="text-sm text-stone-muted">Pick the right one.</p>
      {draft.options.map((option, oi) => (
        <div key={oi} className="flex items-center gap-3">
          <input
            type="radio"
            name={name}
            checked={draft.answer_index === oi}
            onChange={() => onChange({ answer_index: oi })}
            aria-label={`Answer ${oi + 1} is the right one`}
            className="size-5 shrink-0 accent-[var(--color-slate)]"
          />
          <label className="sr-only" htmlFor={`${name}-${oi}`}>
            Question {index + 1}, answer {oi + 1}
          </label>
          <input
            id={`${name}-${oi}`}
            value={option}
            maxLength={200}
            onChange={(e) => onChange({ options: draft.options.map((o, j) => (j === oi ? e.target.value : o)) })}
            className={fieldBase}
          />
          <button
            type="button"
            disabled={draft.options.length <= 2}
            onClick={() =>
              onChange({
                options: draft.options.filter((_, j) => j !== oi),
                answer_index: draft.answer_index === oi ? 0 : draft.answer_index > oi ? draft.answer_index - 1 : draft.answer_index,
              })
            }
            aria-label={`Remove answer ${oi + 1}`}
            className="grid size-10 shrink-0 place-items-center rounded-full text-stone-muted hover:bg-limestone hover:text-slate-ink disabled:opacity-30"
          >
            <IconTrash aria-hidden="true" size={18} stroke={1.75} />
          </button>
        </div>
      ))}
      {draft.options.length < 6 && (
        <button
          type="button"
          onClick={() => onChange({ options: [...draft.options, ""] })}
          className="justify-self-start text-sm font-semibold text-slate underline-offset-4 hover:underline"
        >
          Add an answer
        </button>
      )}
    </fieldset>
  );
}
