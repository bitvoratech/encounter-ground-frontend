"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { inputClass as field } from "@/components/ui/form";
import { api } from "@/lib/api";
import { AGE_RANGES, GENDERS, HEARD_FROM, PICKUP_AREAS, YADA_DAYS } from "@/lib/registrations";
import { authHeader } from "@/lib/supabase/client";

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "sent" } | { kind: "error"; message: string };

type Props = {
  eventSlug: string;
  eventPath: string;
  when: string;
  time: string;
  venue: string;
  where: string;
  whatsappHref: string;
};

// Big, easy-to-tap choices for phones; the selected one gets a dark border.
const choice =
  "flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-rule bg-chalk px-4 py-2.5 text-slate-ink transition-colors hover:border-stone has-[:checked]:border-slate-deep has-[:checked]:bg-white has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-flame";
const control = "size-5 shrink-0 accent-slate-deep";
const label = "font-semibold text-slate-ink";
const optional = <span className="font-normal text-stone-muted"> (optional)</span>;

/** The YADA registration form. A page rather than a pop-up: it is long, and most people arrive on a phone. */
export function YadaRegisterForm({ eventSlug, eventPath, when, time, venue, where, whatsappHref }: Props) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [transport, setTransport] = useState<"" | "yes" | "no">("");
  const [area, setArea] = useState("");
  const [registered, setRegistered] = useState<{ name: string; transport: boolean; area: string } | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (status.kind === "sent") headingRef.current?.focus();
    if (status.kind === "error") errorRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [status.kind]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const text = (name: string) => String(data.get(name) ?? "");
    const days = data.getAll("days").map(String);

    if (days.length === 0) {
      setStatus({ kind: "error", message: "Please choose at least one day you will attend." });
      return;
    }

    const needsTransport = transport === "yes";
    const pickup = needsTransport ? area : "";
    setStatus({ kind: "sending" });
    try {
      await api(`/events/${eventSlug}/register`, {
        method: "POST",
        headers: await authHeader(),
        body: JSON.stringify({
          full_name: text("full_name"),
          email: text("email"),
          phone: text("phone"),
          gender: text("gender"),
          age_range: text("age_range"),
          church: text("church"),
          days,
          first_time: text("first_time"),
          heard_from: text("heard_from"),
          needs_transport: needsTransport,
          location_area: pickup,
          location_other: pickup === "Other" ? text("location_other") : "",
          special_needs: text("special_needs"),
          website: text("website"),
        }),
      });
      setRegistered({ name: text("full_name").trim().split(/\s+/)[0] ?? "", transport: needsTransport, area: pickup });
      setStatus({ kind: "sent" });
    } catch (err) {
      setStatus({
        kind: "error",
        message: err instanceof Error ? err.message : "Your registration didn’t go through. Please try again.",
      });
    }
  }

  if (status.kind === "sent" && registered) {
    return (
      <div role="status" className="rounded-3xl border border-rule bg-chalk p-8 md:p-10">
        <h2 ref={headingRef} tabIndex={-1} className="text-h2 text-slate-ink outline-none">
          You’re registered{registered.name ? `, ${registered.name}` : ""}
        </h2>
        <p className="mt-3 text-lede text-stone-muted">Your seat for YADA 2026 is saved. We look forward to seeing you.</p>
        <dl className="mt-8 grid gap-5 border-t border-rule pt-6">
          <div>
            <dt className="text-stone-muted">When</dt>
            <dd className="font-display text-xl text-slate-ink">{when}</dd>
            <dd className="text-stone-muted">{time}</dd>
          </div>
          <div>
            <dt className="text-stone-muted">Where</dt>
            <dd className="font-display text-xl text-slate-ink">{venue}</dd>
            <dd className="text-stone-muted">{where}</dd>
          </div>
          {registered.transport && (
            <div>
              <dt className="text-stone-muted">Transport</dt>
              <dd className="text-slate-ink">
                We’ve noted your request for transport from {registered.area === "Other" ? "your area" : registered.area}.
              </dd>
            </div>
          )}
        </dl>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn-fire">
            Follow on WhatsApp for updates
          </a>
          <Link href={eventPath} className="btn btn-quiet text-slate-ink">
            Back to the conference page
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-12">
      {/* 1. About you */}
      <section aria-labelledby="about-you" className="grid gap-5 sm:grid-cols-2">
        <h2 id="about-you" className="font-display text-2xl text-slate-ink sm:col-span-2">
          <span className="mr-2 text-amber">1</span>About you
        </h2>
        <label className="sm:col-span-2">
          <span className={label}>Full name</span>
          <input name="full_name" required minLength={2} maxLength={120} autoComplete="name" className={field} />
        </label>
        <label>
          <span className={label}>Email</span>
          <input name="email" type="email" required maxLength={254} autoComplete="email" className={field} />
        </label>
        <label>
          <span className={label}>Phone (WhatsApp if you can)</span>
          <input name="phone" type="tel" inputMode="tel" required minLength={7} maxLength={20} autoComplete="tel" placeholder="0801 234 5678" className={field} />
        </label>
        <fieldset>
          <legend className={label}>Gender</legend>
          <div className="mt-2 grid grid-cols-2 gap-3">
            {GENDERS.map((g) => (
              <label key={g} className={choice}>
                <input type="radio" name="gender" value={g} required className={control} />
                {g}
              </label>
            ))}
          </div>
        </fieldset>
        <label>
          <span className={label}>Age range{optional}</span>
          <select name="age_range" defaultValue="" className={field}>
            <option value="">Select</option>
            {AGE_RANGES.map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>
        </label>
        <label className="sm:col-span-2">
          <span className={label}>Church or ministry{optional}</span>
          <input name="church" maxLength={120} className={field} />
        </label>
      </section>

      {/* 2. Attendance */}
      <section aria-labelledby="attendance" className="grid gap-5">
        <h2 id="attendance" className="font-display text-2xl text-slate-ink">
          <span className="mr-2 text-amber">2</span>Your attendance
        </h2>
        <fieldset>
          <legend className={label}>Which days will you attend?</legend>
          <div className="mt-2 grid gap-3 sm:grid-cols-3">
            {YADA_DAYS.map((d) => (
              <label key={d.value} className={choice}>
                <input type="checkbox" name="days" value={d.value} className={control} />
                {d.label}
              </label>
            ))}
          </div>
        </fieldset>
        <div className="grid gap-5 sm:grid-cols-2">
          <fieldset>
            <legend className={label}>
              First time at an Encounter Ground gathering?{optional}
            </legend>
            <div className="mt-2 grid grid-cols-2 gap-3">
              <label className={choice}>
                <input type="radio" name="first_time" value="yes" className={control} />
                Yes
              </label>
              <label className={choice}>
                <input type="radio" name="first_time" value="no" className={control} />
                No
              </label>
            </div>
          </fieldset>
          <label>
            <span className={label}>How did you hear about YADA?{optional}</span>
            <select name="heard_from" defaultValue="" className={field}>
              <option value="">Select</option>
              {HEARD_FROM.map((h) => (
                <option key={h}>{h}</option>
              ))}
            </select>
          </label>
        </div>
      </section>

      {/* 3. Getting there */}
      <section aria-labelledby="getting-there" className="grid gap-5">
        <h2 id="getting-there" className="font-display text-2xl text-slate-ink">
          <span className="mr-2 text-amber">3</span>Getting there
        </h2>
        <fieldset>
          <legend className={label}>Would you like transport to the venue?</legend>
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            <label className={choice}>
              <input type="radio" name="transport" value="yes" required checked={transport === "yes"} onChange={() => setTransport("yes")} className={control} />
              Yes, I need transport
            </label>
            <label className={choice}>
              <input type="radio" name="transport" value="no" required checked={transport === "no"} onChange={() => setTransport("no")} className={control} />
              No, I’ll come on my own
            </label>
          </div>
        </fieldset>

        {transport === "yes" && (
          <div className="grid gap-5 sm:grid-cols-2">
            <label>
              <span className={label}>Pick me up from</span>
              <select name="location_area" required value={area} onChange={(e) => setArea(e.target.value)} className={field}>
                <option value="">Choose your area</option>
                {PICKUP_AREAS.map((a) => (
                  <option key={a}>{a}</option>
                ))}
              </select>
            </label>
            {area === "Other" && (
              <label>
                <span className={label}>Which area?</span>
                <input name="location_other" required maxLength={120} className={field} />
              </label>
            )}
          </div>
        )}

        <label>
          <span className={label}>Anything we should know, like a disability or access need?{optional}</span>
          <textarea name="special_needs" rows={3} maxLength={500} className={field} />
        </label>
      </section>

      {/* Honeypot for bots; hidden from people and screen readers. */}
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

      <div>
        {status.kind === "error" && (
          <p ref={errorRef} role="alert" className="mb-4 font-semibold text-amber">
            {status.message}
          </p>
        )}
        <button type="submit" className="btn btn-fire w-full sm:w-auto" disabled={status.kind === "sending"}>
          {status.kind === "sending" ? "Saving your seat…" : "Save my seat"}
        </button>
      </div>
    </form>
  );
}
