"use client";

import { IconAddressBook, IconCheck, IconFlame, IconHome } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { refreshSiteContent } from "@/app/admin/content/actions";
import { saveSiteContent } from "@/lib/adminActions";
import { errorText, FormMessage, TextArea, TextField } from "./fields";
import { panel } from "./ui";

export type SiteContentValues = {
  contact: { email: string; phone: string; instagram: string; youtube: string; tiktok: string; whatsapp_channel: string };
  yada: { theme: string; when: string; register_url: string; about: string; dress: string };
  home: { tagline: string; join_url: string; zoom_url: string; mixlr_url: string; replays_url: string };
};
type Key = keyof SiteContentValues;

const linkHint = "Starts with https://. Leave it empty to take it off the website.";

type Field<K extends Key> = { name: keyof SiteContentValues[K] & string; label: string; type?: string; hint?: string; rows?: number; wide?: boolean };
type Group<K extends Key> = { legend: string; fields: Field<K>[] };
type Section<K extends Key> = { k: K; title: string; short: string; intro: string; Icon: typeof IconHome; groups: Group<K>[] };

const sections: [Section<"home">, Section<"contact">, Section<"yada">] = [
  {
    k: "home",
    title: "Home page",
    short: "Tagline, join link, live streams",
    intro: "The big line at the top of the home page, the “join us” form, and where people watch or listen live.",
    Icon: IconHome,
    groups: [
      {
        legend: "Top of the page",
        fields: [
          { name: "tagline", label: "Tagline", hint: "The large heading at the top of the home page.", wide: true },
          { name: "join_url", label: "“Join us” form link", type: "url", hint: "Where the “Begin your journey” buttons go.", wide: true },
        ],
      },
      {
        legend: "Watch and listen live",
        fields: [
          { name: "zoom_url", label: "Zoom meeting link", type: "url", hint: linkHint },
          { name: "mixlr_url", label: "Mixlr link", type: "url", hint: linkHint },
          { name: "replays_url", label: "YouTube replays link", type: "url", hint: linkHint },
        ],
      },
    ],
  },
  {
    k: "contact",
    title: "Contact details",
    short: "Email, phone, social links",
    intro: "Shown in the footer, on the Contact page, and in the school’s footer.",
    Icon: IconAddressBook,
    groups: [
      {
        legend: "Reach us",
        fields: [
          { name: "email", label: "Email", type: "email" },
          { name: "phone", label: "Phone number", type: "tel", hint: "As it should appear, for example 0818 517 6780." },
        ],
      },
      {
        legend: "Social links",
        fields: [
          { name: "instagram", label: "Instagram link", type: "url", hint: linkHint },
          { name: "youtube", label: "YouTube link", type: "url", hint: linkHint },
          { name: "tiktok", label: "TikTok link", type: "url", hint: linkHint },
          { name: "whatsapp_channel", label: "WhatsApp channel link", type: "url", hint: linkHint },
        ],
      },
    ],
  },
  {
    k: "yada",
    title: "YADA Conference",
    short: "Theme, dates, registration",
    intro: "The conference page, and the conference band on the home and events pages.",
    Icon: IconFlame,
    groups: [
      {
        legend: "The event",
        fields: [
          { name: "theme", label: "Theme", wide: true },
          { name: "when", label: "When", hint: "For example “December 2026”, or the exact dates once they’re set." },
          { name: "register_url", label: "Registration link", type: "url" },
        ],
      },
      {
        legend: "About it",
        fields: [
          { name: "about", label: "About the conference", rows: 6, hint: "Leave a blank line between paragraphs." },
          { name: "dress", label: "Dress code", rows: 3, hint: "One point per line." },
        ],
      },
    ],
  },
];

const keys = sections.map((s) => s.k);
const isKey = (v: string): v is Key => (keys as string[]).includes(v);

/**
 * The website's editable wording, one section at a time. Each section is its own form, saved
 * on its own; switching sections keeps unsaved edits, and a dot marks the sections that have them.
 */
export function SiteContentForms({ values, updated }: { values: SiteContentValues; updated: Partial<Record<Key, string>> }) {
  const [active, setActive] = useState<Key>("home");
  const [dirty, setDirty] = useState<Record<Key, boolean>>({ home: false, contact: false, yada: false });
  const tabsRef = useRef<HTMLDivElement>(null);
  const id = useId();

  // Open the section named in the address (#contact), and keep the address in step, so a
  // refresh or a shared link lands on the same section.
  useEffect(() => {
    const fromHash = window.location.hash.slice(1);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the hash only exists in the browser
    if (isKey(fromHash)) setActive(fromHash);
  }, []);
  const choose = (k: Key) => {
    setActive(k);
    window.history.replaceState(null, "", `#${k}`);
  };

  // Warn before leaving the page with unsaved edits.
  const anyDirty = Object.values(dirty).some(Boolean);
  useEffect(() => {
    if (!anyDirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [anyDirty]);

  // Arrow keys move between sections, as in any tab list.
  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    const edge = e.key === "Home" ? 0 : e.key === "End" ? keys.length - 1 : null;
    if (step === undefined && edge === null) return;
    e.preventDefault();
    const next = keys[edge ?? (keys.indexOf(active) + step! + keys.length) % keys.length]!;
    choose(next);
    tabsRef.current?.querySelector<HTMLButtonElement>(`[data-key="${next}"]`)?.focus();
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[17rem_minmax(0,1fr)] lg:items-start">
      <div
        ref={tabsRef}
        role="tablist"
        aria-label="Site content sections"
        aria-orientation="vertical"
        onKeyDown={onKeyDown}
        className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 md:-mx-8 md:px-8 lg:sticky lg:top-24 lg:mx-0 lg:grid lg:overflow-visible lg:px-0 lg:pb-0"
      >
        {sections.map(({ k, title, short, Icon }) => {
          const selected = k === active;
          return (
            <button
              key={k}
              type="button"
              role="tab"
              data-key={k}
              id={`${id}-tab-${k}`}
              aria-selected={selected}
              aria-controls={`${id}-panel-${k}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => choose(k)}
              className="group flex min-w-max shrink-0 items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-left transition-colors hover:bg-white/70 aria-selected:border-rule/80 aria-selected:bg-white aria-selected:shadow-[0_1px_2px_rgb(29_38_48/0.06)] lg:min-w-0"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-slate/10 text-slate transition-colors group-aria-selected:bg-flame group-aria-selected:text-slate-ink">
                <Icon aria-hidden="true" size={20} stroke={1.75} />
              </span>
              <span className="min-w-0">
                <span className="flex items-center gap-2 font-semibold text-slate-ink">
                  {title}
                  {dirty[k] && (
                    <span className="size-2 rounded-full bg-flame ring-2 ring-flame/25">
                      <span className="sr-only">(unsaved changes)</span>
                    </span>
                  )}
                </span>
                <span className="hidden truncate text-sm text-stone-muted lg:block">{short}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="min-w-0">
        {sections.map((s) => (
          <div
            key={s.k}
            role="tabpanel"
            id={`${id}-panel-${s.k}`}
            aria-labelledby={`${id}-tab-${s.k}`}
            hidden={s.k !== active}
          >
            <SectionForm
              section={s as Section<Key>}
              initial={values[s.k]}
              updated={updated[s.k]}
              onDirtyChange={(d) => setDirty((old) => (old[s.k] === d ? old : { ...old, [s.k]: d }))}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

const same = (a: Record<string, string>, b: Record<string, string>) => Object.keys(a).every((k) => (a[k] ?? "") === (b[k] ?? ""));

function SectionForm<K extends Key>({
  section: { k, title, intro, Icon, groups },
  initial,
  updated,
  onDirtyChange,
}: {
  section: Section<K>;
  initial: SiteContentValues[K];
  updated?: string;
  onDirtyChange: (dirty: boolean) => void;
}) {
  const router = useRouter();
  const [saved, setSavedValue] = useState<Record<string, string>>(initial);
  const [value, setValue] = useState<Record<string, string>>(initial);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const dirty = !same(value, saved);

  useEffect(() => onDirtyChange(dirty), [dirty, onDirtyChange]);

  const set = (name: string) => (v: string) => {
    setMessage("");
    setValue((old) => ({ ...old, [name]: v }));
  };

  return (
    <form
      noValidate
      aria-labelledby={`content-${k}`}
      onSubmit={async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setPending(true);
        const clean = Object.fromEntries(Object.entries(value).map(([n, v]) => [n, v.trim()]));
        try {
          await saveSiteContent(k, clean);
          await refreshSiteContent();
          setValue(clean);
          setSavedValue(clean);
          setMessage("Saved. The website now shows this.");
          router.refresh();
        } catch (err) {
          setError(errorText(err));
        } finally {
          setPending(false);
        }
      }}
      className={panel}
    >
      <div className="flex flex-wrap items-start gap-4 border-b border-rule/80 px-5 py-5 md:px-7">
        <span className="hidden size-11 shrink-0 place-items-center rounded-xl bg-flame/15 text-amber sm:grid">
          <Icon aria-hidden="true" size={22} stroke={1.75} />
        </span>
        <div className="min-w-0 flex-1">
          <h2 id={`content-${k}`} className="font-sans text-xl font-bold text-slate-ink">
            {title}
          </h2>
          <p className="mt-0.5 text-[0.9375rem] text-stone-muted">{intro}</p>
        </div>
        <p className="basis-full text-xs font-semibold text-stone-muted sm:basis-auto sm:rounded-full sm:bg-limestone sm:px-3 sm:py-1">
          {updated ? `Last changed ${updated}` : "Original wording"}
        </p>
      </div>

      <div className="grid gap-8 px-5 py-6 md:px-7">
        {groups.map((g) => (
          <fieldset key={g.legend} className="grid gap-5 sm:grid-cols-2">
            <legend className="mb-4 text-xs font-bold uppercase tracking-[0.12em] text-stone-muted">{g.legend}</legend>
            {g.fields.map((f) =>
              f.rows ? (
                <TextArea
                  key={f.name}
                  className="sm:col-span-2"
                  label={f.label}
                  hint={f.hint}
                  rows={f.rows}
                  value={value[f.name] ?? ""}
                  onChange={set(f.name)}
                />
              ) : (
                <TextField
                  key={f.name}
                  className={f.wide ? "sm:col-span-2" : undefined}
                  label={f.label}
                  hint={f.hint}
                  type={f.type ?? "text"}
                  value={value[f.name] ?? ""}
                  onChange={set(f.name)}
                />
              ),
            )}
          </fieldset>
        ))}
      </div>

      <div className="sticky bottom-0 flex flex-wrap items-center gap-3 rounded-b-2xl border-t border-rule/80 bg-white/95 px-5 py-4 backdrop-blur md:px-7">
        <div className="min-w-0 basis-full sm:mr-auto sm:basis-auto">
          {error || message ? (
            <FormMessage error={error} saved={message} />
          ) : (
            <p className="flex items-center gap-2 text-sm text-stone-muted">
              {dirty ? (
                <>
                  <span aria-hidden="true" className="size-2 rounded-full bg-flame" />
                  Unsaved changes
                </>
              ) : (
                <>
                  <IconCheck aria-hidden="true" size={16} stroke={2} />
                  Up to date with the website
                </>
              )}
            </p>
          )}
        </div>
        <button
          type="button"
          disabled={!dirty || pending}
          onClick={() => {
            setValue(saved);
            setError("");
            setMessage("");
          }}
          className="btn btn-quiet flex-1 px-4 py-2 disabled:pointer-events-none disabled:opacity-50 sm:flex-none"
        >
          Discard
        </button>
        <button type="submit" disabled={pending || !dirty} className="btn btn-fire flex-1 px-5 py-2 disabled:opacity-60 sm:flex-none">
          {pending ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
}
