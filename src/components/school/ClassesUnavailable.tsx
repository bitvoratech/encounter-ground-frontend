import Link from "next/link";

/** Shown when the API can't be reached, instead of an error page. */
export function ClassesUnavailable() {
  return (
    <section className="wrap py-20 md:py-28">
      <h1 className="text-[length:var(--text-h1)] text-slate-ink">Classes</h1>
      <p role="status" className="mt-5 max-w-[34rem] text-lede leading-relaxed text-stone-muted">
        The classes can’t be loaded right now. Please try again in a little while.
      </p>
      <Link href="/school" className="btn btn-quiet mt-8 text-slate-ink">
        Back to the school
      </Link>
    </section>
  );
}
