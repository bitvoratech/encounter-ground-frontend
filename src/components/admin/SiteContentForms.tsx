"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { refreshSiteContent } from "@/app/admin/content/actions";
import { saveSiteContent } from "@/lib/adminActions";
import { errorText, FormMessage, TextArea, TextField } from "./fields";
import { card } from "./ui";

export type SiteContentValues = {
  contact: { email: string; phone: string; instagram: string; youtube: string; tiktok: string; whatsapp_channel: string };
  yada: { theme: string; when: string; register_url: string; about: string; dress: string };
  home: { tagline: string; join_url: string; zoom_url: string; mixlr_url: string; replays_url: string };
};
type Key = keyof SiteContentValues;

const linkHint = "Starts with https://. Leave it empty to take it off the website.";

/** One form per block of website wording, each saved on its own. */
export function SiteContentForms({ values, updated }: { values: SiteContentValues; updated: Partial<Record<Key, string>> }) {
  return (
    <div className="grid max-w-3xl gap-6">
      <Block
        k="contact"
        title="Contact details"
        intro="Shown in the footer, on the Contact page, and in the school’s footer."
        initial={values.contact}
        updated={updated.contact}
        fields={[
          { name: "email", label: "Email", type: "email" },
          { name: "phone", label: "Phone number", type: "tel", hint: "As it should appear, for example 0818 517 6780." },
          { name: "instagram", label: "Instagram link", type: "url", hint: linkHint },
          { name: "youtube", label: "YouTube link", type: "url", hint: linkHint },
          { name: "tiktok", label: "TikTok link", type: "url", hint: linkHint },
          { name: "whatsapp_channel", label: "WhatsApp channel link", type: "url", hint: linkHint },
        ]}
      />
      <Block
        k="home"
        title="Home page"
        intro="The big line at the top of the home page, the “join us” form, and where people watch or listen live."
        initial={values.home}
        updated={updated.home}
        fields={[
          { name: "tagline", label: "Tagline", hint: "The large heading at the top of the home page." },
          { name: "join_url", label: "“Join us” form link", type: "url", hint: "Where the “Begin your journey” buttons go." },
          { name: "zoom_url", label: "Zoom meeting link", type: "url", hint: linkHint },
          { name: "mixlr_url", label: "Mixlr link", type: "url", hint: linkHint },
          { name: "replays_url", label: "YouTube replays link", type: "url", hint: linkHint },
        ]}
      />
      <Block
        k="yada"
        title="YADA Intimacy Conference"
        intro="The conference page, and the conference band on the home and events pages."
        initial={values.yada}
        updated={updated.yada}
        fields={[
          { name: "theme", label: "Theme" },
          { name: "when", label: "When", hint: "For example “December 2026”, or the exact dates once they’re set." },
          { name: "register_url", label: "Registration link", type: "url" },
          { name: "about", label: "About the conference", rows: 6, hint: "Leave a blank line between paragraphs." },
          { name: "dress", label: "Dress code", rows: 3, hint: "One point per line." },
        ]}
      />
    </div>
  );
}

type Field<K extends Key> = { name: keyof SiteContentValues[K] & string; label: string; type?: string; hint?: string; rows?: number };

function Block<K extends Key>({
  k,
  title,
  intro,
  initial,
  updated,
  fields,
}: {
  k: K;
  title: string;
  intro: string;
  initial: SiteContentValues[K];
  updated?: string;
  fields: Field<K>[];
}) {
  const router = useRouter();
  const [value, setValue] = useState<Record<string, string>>(initial);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState("");
  const set = (name: string) => (v: string) => {
    setSaved("");
    setValue((old) => ({ ...old, [name]: v }));
  };

  return (
    <form
      noValidate
      aria-labelledby={`content-${k}`}
      onSubmit={async (e) => {
        e.preventDefault();
        setError("");
        setSaved("");
        setPending(true);
        try {
          await saveSiteContent(k, Object.fromEntries(Object.entries(value).map(([n, v]) => [n, v.trim()])));
          await refreshSiteContent();
          setSaved("Saved. The website now shows this.");
          router.refresh();
        } catch (err) {
          setError(errorText(err));
        } finally {
          setPending(false);
        }
      }}
      className={`${card} grid gap-5`}
    >
      <div>
        <h2 id={`content-${k}`} className="font-display text-2xl text-slate-ink">
          {title}
        </h2>
        <p className="mt-1 text-stone-muted">{intro}</p>
        <p className="mt-1 text-sm text-stone-muted">{updated ? `Last changed ${updated}.` : "Showing the website’s original wording."}</p>
      </div>
      {fields.map((f) =>
        f.rows ? (
          <TextArea key={f.name} label={f.label} hint={f.hint} rows={f.rows} value={value[f.name] ?? ""} onChange={set(f.name)} />
        ) : (
          <TextField key={f.name} label={f.label} hint={f.hint} type={f.type ?? "text"} value={value[f.name] ?? ""} onChange={set(f.name)} />
        ),
      )}
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={pending} className="btn btn-fire min-h-11 px-6 py-2">
          {pending ? "Saving…" : "Save changes"}
        </button>
        <FormMessage error={error} saved={saved} />
      </div>
    </form>
  );
}
