/** One of the ministry's signature statements, set as a standalone line between sections. */
export function Statement({ children }: { children: string }) {
  return (
    <section aria-label="Signature statement" className="border-y border-rule bg-limestone">
      <p className="wrap py-14 text-center font-display text-[clamp(1.6rem,1.2rem+1.6vw,2.6rem)] leading-snug text-slate-ink md:py-20">
        <span className="mx-auto block max-w-3xl">{children}</span>
      </p>
    </section>
  );
}
