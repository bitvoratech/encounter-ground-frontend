"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { api } from "@/lib/api";
import { authHeader } from "@/lib/supabase/client";
import type { SelfTest, SelfTestResult } from "@/types/self-test";

type Answers = Record<string, number>;
type Stage = "intro" | "questions" | "result";

// Progress is kept for the browser tab so a refresh mid-way doesn't lose answers.
const storageKey = (slug: string) => `self-test:${slug}`;

function readSaved(slug: string): string | null {
  try {
    return sessionStorage.getItem(storageKey(slug));
  } catch {
    return null;
  }
}

function parseSaved(saved: string): Answers {
  try {
    return JSON.parse(saved) as Answers;
  } catch {
    return {};
  }
}

const noSubscribe = () => () => {};

function saveAnswers(slug: string, answers: Answers | null) {
  try {
    if (answers) sessionStorage.setItem(storageKey(slug), JSON.stringify(answers));
    else sessionStorage.removeItem(storageKey(slug));
  } catch {
    // Storage unavailable (private mode); progress just isn't kept.
  }
}

export function SelfTestRunner({ test }: { test: SelfTest }) {
  const { questions, scale } = test;
  const [stage, setStage] = useState<Stage>("intro");
  const [answers, setAnswers] = useState<Answers>({});
  const [index, setIndex] = useState(0);
  const [result, setResult] = useState<SelfTestResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Answers saved earlier in this tab, read after hydration (null on the server).
  const saved = useSyncExternalStore(noSubscribe, () => readSaved(test.slug), () => null);
  const savedAnswers: Answers = stage === "intro" && saved ? parseSaved(saved) : answers;

  // Move focus to each new statement so keyboard and screen-reader users follow along.
  useEffect(() => {
    if (stage !== "intro") headingRef.current?.focus();
  }, [stage, index]);

  const answeredCount = questions.filter((q) => savedAnswers[q.id]).length;
  const resumable = answeredCount > 0 && answeredCount < questions.length;
  const question = questions[index]!;
  const isLast = index === questions.length - 1;

  function start(fromScratch: boolean) {
    if (fromScratch) {
      setAnswers({});
      saveAnswers(test.slug, null);
      setIndex(0);
    } else {
      setAnswers(savedAnswers);
      const firstOpen = questions.findIndex((q) => !savedAnswers[q.id]);
      setIndex(firstOpen === -1 ? 0 : firstOpen);
    }
    setStage("questions");
  }

  function choose(rating: number) {
    const next = { ...answers, [question.id]: rating };
    setAnswers(next);
    saveAnswers(test.slug, next);
    setError(null);
    if (!isLast) setTimeout(() => setIndex((i) => Math.min(i + 1, questions.length - 1)), 180);
  }

  async function submit() {
    const firstOpen = questions.findIndex((q) => !answers[q.id]);
    if (firstOpen !== -1) {
      setIndex(firstOpen);
      setError("Please answer this statement before seeing your results.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await api<SelfTestResult>(`/self-tests/${test.slug}/attempts`, {
        method: "POST",
        headers: await authHeader(),
        body: JSON.stringify({ answers }),
      });
      setResult(res);
      saveAnswers(test.slug, null);
      setStage("result");
      window.scrollTo({ top: 0 });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (stage === "intro") {
    return (
      <>
        <header className="wrap pb-10 pt-14 md:pt-20">
          <p className="font-semibold text-amber">
            Self-test · {questions.length} statements
          </p>
          <h1 className="mt-3 max-w-3xl text-[length:var(--text-h1)] text-slate-ink">{test.title}</h1>
          {test.summary && (
            <p className="mt-5 max-w-[34rem] text-lede leading-relaxed text-stone-muted">{test.summary}</p>
          )}
        </header>
        <section aria-label="Before you begin" className="border-t border-rule bg-chalk">
          <div className="wrap py-12 md:py-16">
            {test.intro && <p className="measure text-[1.125rem] text-slate-ink/90">{test.intro}</p>}
            <p className="measure mt-4 text-stone-muted">
              Each statement is rated from “{scale[0]}” to “{scale[scale.length - 1]}”.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {resumable ? (
                <>
                  <button type="button" className="btn btn-fire" onClick={() => start(false)}>
                    Continue ({answeredCount} of {questions.length} answered)
                  </button>
                  <button type="button" className="btn btn-quiet" onClick={() => start(true)}>
                    Start again
                  </button>
                </>
              ) : (
                <button type="button" className="btn btn-fire" onClick={() => start(true)}>
                  Begin
                </button>
              )}
            </div>
          </div>
        </section>
      </>
    );
  }

  if (stage === "result" && result) {
    const [top] = result.scores;
    const leaders = result.scores.filter((s) => s.percent === top!.percent);
    return (
      <>
        <header className="ember">
          <div className="wrap pb-16 pt-14 md:pb-24 md:pt-20">
            <p className="text-chalk/70">{test.title}</p>
            <h1
              ref={headingRef}
              tabIndex={-1}
              className="mt-3 text-[length:var(--text-h1)] text-chalk outline-none"
            >
              You lean most towards{" "}
              <span className="text-flame-hot">{leaders.map((s) => s.name).join(" and ")}</span>
            </h1>
            {leaders.length === 1 && top!.description && (
              <p className="mt-5 max-w-[34rem] text-lede leading-relaxed text-chalk/85">{top!.description}</p>
            )}
          </div>
        </header>

        <section aria-labelledby="breakdown-heading">
          <div className="wrap py-14 md:py-20">
            <h2 id="breakdown-heading" className="text-[length:var(--text-h2)] text-slate-ink">
              Your full picture
            </h2>
            <ol className="mt-8 grid gap-6">
              {result.scores.map((s) => (
                <li key={s.key} className="grid gap-2 md:grid-cols-[14rem_1fr_3.5rem] md:items-center md:gap-6">
                  <span className="font-display text-2xl text-slate-ink">{s.name}</span>
                  <span
                    className="h-3 overflow-hidden rounded-full bg-rule"
                    role="img"
                    aria-label={`${s.percent}%`}
                  >
                    <span
                      className="block h-full rounded-full bg-flame"
                      style={{ width: `${s.percent}%` }}
                    />
                  </span>
                  <span className="font-semibold tabular-nums text-amber md:text-right" aria-hidden="true">
                    {s.percent}%
                  </span>
                  {s.description && (
                    <p className="text-stone-muted md:col-start-2 md:col-end-4">{s.description}</p>
                  )}
                </li>
              ))}
            </ol>
            <p className="measure mt-10 text-stone-muted">
              This is a tool for reflection, not a verdict. Take your results to God in
              prayer and talk them over with a leader who knows you.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/self-test" className="btn btn-fire">
                Other self-tests
              </Link>
              <button
                type="button"
                className="btn btn-quiet"
                onClick={() => {
                  setResult(null);
                  start(true);
                }}
              >
                Take it again
              </button>
            </div>
          </div>
        </section>
      </>
    );
  }

  const selected = answers[question.id];
  const progress = Math.round((answeredCount / questions.length) * 100);

  return (
    <section aria-label={test.title} className="wrap pb-20 pt-10 md:pt-16">
      <div className="flex items-baseline justify-between gap-4 text-sm text-stone-muted">
        <span>{test.title}</span>
        <span className="tabular-nums" aria-live="polite">
          {index + 1} / {questions.length}
        </span>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-rule" aria-hidden="true">
        <div className="h-full bg-flame transition-[width]" style={{ width: `${progress}%` }} />
      </div>

      <fieldset className="mt-12 md:mt-16" key={question.id}>
        <legend className="contents">
          <h1
            ref={headingRef}
            tabIndex={-1}
            className="max-w-3xl text-[length:var(--text-h2)] text-slate-ink outline-none"
          >
            {question.prompt}
          </h1>
        </legend>
        <div className="mt-10 grid gap-3 sm:grid-cols-5">
          {scale.map((label, i) => {
            const value = i + 1;
            return (
              <label
                key={label}
                className="flex min-h-14 cursor-pointer items-center gap-3 rounded-2xl border border-rule bg-chalk px-4 py-3 transition-colors hover:border-slate has-checked:border-slate has-checked:bg-slate has-checked:text-chalk has-focus-visible:outline-3 has-focus-visible:outline-flame sm:flex-col sm:justify-center sm:text-center"
              >
                <input
                  type="radio"
                  name="rating"
                  value={value}
                  checked={selected === value}
                  onChange={() => choose(value)}
                  className="sr-only"
                />
                <span className="font-display text-2xl leading-none">{value}</span>
                <span className="text-[0.95rem] leading-snug">{label}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {error && (
        <p role="alert" className="mt-6 font-semibold text-amber">
          {error}
        </p>
      )}

      <div className="mt-10 flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="btn btn-quiet"
          onClick={() => (index === 0 ? setStage("intro") : setIndex(index - 1))}
        >
          Back
        </button>
        {isLast ? (
          <button
            type="button"
            className="btn btn-fire"
            onClick={submit}
            disabled={submitting || !selected}
          >
            {submitting ? "Working out your results…" : "See my results"}
          </button>
        ) : (
          selected && (
            <button type="button" className="btn btn-quiet" onClick={() => setIndex(index + 1)}>
              Next
            </button>
          )
        )}
      </div>
    </section>
  );
}
