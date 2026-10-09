import Link from "next/link";
import { yada } from "@/content/ministry";

/** The conference band: the one place the "fire" is lit. */
export function YadaBand({ showLink = true }: { showLink?: boolean }) {
  return (
    <section aria-labelledby="yada-heading" className="ember">
      <div className="wrap grid gap-10 py-20 md:grid-cols-[1.4fr_1fr] md:items-end md:py-28">
        <div>
          <p className="text-lg text-flame">{yada.when}</p>
          <h2 id="yada-heading" className="mt-3 text-[length:var(--text-display)] leading-[0.95] text-chalk">
            YADA
            <span className="block text-[0.5em] md:text-[0.42em] leading-tight text-chalk/90">
              Intimacy Conference
            </span>
          </h2>
          <p className="mt-8 max-w-xl text-lede leading-relaxed text-chalk/85">
            {yada.about[0]}
          </p>
        </div>

        <div className="md:pb-2">
          <p className="text-chalk/70">This year’s theme</p>
          <p className="mt-1 font-display text-3xl leading-tight text-flame-hot md:text-4xl">
            {yada.theme}
          </p>
          {showLink && (
            <Link href={`/events/${yada.slug}`} className="btn btn-fire mt-8">
              About the conference
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
