import Image from "next/image";
import Link from "next/link";

// Small building blocks shared by the admin pages (server-rendered).

export const card = "rounded-3xl border border-rule bg-chalk p-5 md:p-6";

export function PageHeader({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <header className="mb-8">
      <h1 className="text-[length:var(--text-h2)] leading-tight text-slate-ink">{title}</h1>
      {children && <p className="mt-2 max-w-2xl text-stone-muted">{children}</p>}
    </header>
  );
}

/** Two or more views of one list, as links so they work without JavaScript and can be shared. */
export function Tabs({ label, tabs }: { label: string; tabs: { href: string; label: string; count?: number; current: boolean }[] }) {
  return (
    <nav aria-label={label} className="mb-6">
      <ul className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <li key={t.href}>
            <Link
              href={t.href}
              aria-current={t.current ? "page" : undefined}
              className="flex items-center gap-2 rounded-full border border-rule bg-chalk px-4 py-2 font-medium text-slate transition-colors hover:text-slate-ink aria-[current=page]:border-slate aria-[current=page]:bg-slate aria-[current=page]:text-chalk"
            >
              {t.label}
              {t.count !== undefined && <span className="tabular-nums opacity-75">{t.count}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function EmptyState({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className={`${card} text-center`}>
      <p className="font-display text-2xl text-slate-ink">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-stone-muted">{children}</p>
    </div>
  );
}

/** A full page message for when the dashboard can't be shown at all. */
export function AdminNotice({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main id="main" className="grid flex-1 place-items-center bg-slate-deep px-5 py-16 text-center text-chalk">
      <div className="max-w-md">
        <Image src="/brand/lockup-light.png" alt="Encounter Ground" width={467} height={480} className="mx-auto h-24 w-auto" />
        <h1 className="mt-8 text-[length:var(--text-h2)] leading-tight">{title}</h1>
        <p className="mt-3 text-chalk/75">{children}</p>
        <Link href="/" className="btn btn-fire mt-8">
          Go to the website
        </Link>
      </div>
    </main>
  );
}

const relative = new Intl.RelativeTimeFormat("en-GB", { numeric: "auto" });
const steps: [Intl.RelativeTimeFormatUnit, number][] = [
  ["minute", 60],
  ["hour", 24],
  ["day", 7],
  ["week", 4.35],
  ["month", 12],
  ["year", Infinity],
];

/** "3 hours ago", "yesterday", for lists where recency matters more than the date. */
export function timeAgo(iso: string) {
  let value = (new Date(iso).getTime() - Date.now()) / 60000;
  for (const [unit, size] of steps) {
    if (Math.abs(value) < size) return Math.abs(value) < 1 && unit === "minute" ? "just now" : relative.format(Math.round(value), unit);
    value /= size;
  }
  return "";
}

/** "28 Oct 2026, 16:22", in the ministry's time zone. */
export const fullDate = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Africa/Lagos" });

/** A timestamp that reads as "3 hours ago", with the full date on hover and for screen readers' context. */
export function When({ iso, prefix }: { iso: string; prefix?: string }) {
  return (
    <time dateTime={iso} title={fullDate(iso)}>
      {prefix}
      {timeAgo(iso)}
    </time>
  );
}
