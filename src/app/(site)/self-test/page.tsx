import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { SelfTestsUnavailable } from "@/components/self-test/SelfTestsUnavailable";
import { api } from "@/lib/api";
import type { SelfTestSummary } from "@/types/self-test";

export const metadata: Metadata = {
  title: "Self-tests",
  description:
    "Reflect on your calling with the 7 Mountains of Influence and Fivefold Ministry self-tests.",
};

export default async function SelfTestsPage() {
  // Fetch at request time, so builds never depend on the API being reachable.
  await connection();
  let tests: SelfTestSummary[];
  try {
    tests = await api<SelfTestSummary[]>("/self-tests");
  } catch (err) {
    console.error("Self-tests list unavailable:", err);
    return <SelfTestsUnavailable />;
  }

  return (
    <>
      <header className="wrap pb-12 pt-14 md:pt-20">
        <h1 className="text-[length:var(--text-h1)] text-slate-ink">Self-tests</h1>
        <p className="mt-5 max-w-[34rem] text-lede leading-relaxed text-stone-muted">
          Quiet, honest reflection on how God has wired you. Answer as you are
          today; there are no right or wrong answers.
        </p>
      </header>

      <section aria-label="Available self-tests" className="border-t border-rule">
        <ul className="wrap divide-y divide-rule py-6 md:py-10">
          {tests.map((t) => (
            <li key={t.slug} className="grid gap-4 py-8 md:grid-cols-[1fr_auto] md:items-center md:gap-10">
              <div>
                <h2 className="text-[length:var(--text-h2)] text-slate-ink">{t.title}</h2>
                {t.summary && <p className="mt-3 max-w-xl text-stone-muted">{t.summary}</p>}
                <p className="mt-2 text-sm font-semibold text-amber">
                  {t.question_count} statements · about {Math.ceil(t.question_count / 6)} minutes
                </p>
              </div>
              <Link href={`/self-test/${t.slug}`} className="btn btn-fire self-start md:self-auto">
                Take the test
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
