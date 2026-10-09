import Link from "next/link";

/** Shown when the API can't be reached, instead of an error page. */
export function SelfTestsUnavailable() {
  return (
    <section className="wrap py-20 md:py-28">
      <h1 className="text-[length:var(--text-h1)] text-slate-ink">Self-tests</h1>
      <p role="status" className="mt-5 max-w-[34rem] text-lede leading-relaxed text-stone-muted">
        The self-tests aren’t available right now. Please try again in a little while.
      </p>
      <Link href="/" className="btn btn-quiet mt-8 text-slate-ink">
        Back to home
      </Link>
    </section>
  );
}
