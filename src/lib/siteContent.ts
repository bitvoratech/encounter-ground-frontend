import { cache } from "react";
import { contact as defaultContact, home as defaultHome, yada as defaultYada } from "@/content/ministry";
import { API_URL } from "./api";

// Wording the team edits in the admin (Admin → Site content), merged over the built-in
// wording in content/ministry.ts so the site still reads well if nothing is saved yet or the
// API can't be reached. Pages get the same shapes as the built-in `contact`, `yada` and `home`.

export const SITE_CONTENT_TAG = "site-content";

type Saved = {
  contact?: { email: string; phone: string; instagram: string; youtube: string; tiktok: string; whatsapp_channel: string };
  yada?: { theme: string; when: string; register_url: string; about: string; dress: string };
  home?: { tagline: string; join_url: string; zoom_url: string; mixlr_url: string; replays_url: string };
};

export type Social = { name: string; handle: string; href: string };
export type Contact = { email: string; phoneDisplay: string; phoneHref: string; socials: Social[] };
export type Yada = Omit<typeof defaultYada, "about" | "dress"> & { about: string[]; dress: string[] };
export type Home = Omit<typeof defaultHome, "streams"> & { streams: { name: string; detail: string; href: string }[] };
export type SiteContent = { contact: Contact; yada: Yada; home: Home };

const paragraphs = (text: string) =>
  text
    .split(/\n\s*\n|\n/)
    .map((p) => p.trim())
    .filter(Boolean);

/** "0818 517 6780" → "tel:+2348185176780"; numbers already in +country form are kept. */
export function phoneHref(phone: string) {
  const digits = phone.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) return `tel:${digits}`;
  if (digits.startsWith("0")) return `tel:+234${digits.slice(1)}`; // Nigerian local format
  return `tel:${digits}`;
}

/** The handle shown next to a social link, from its address: ".../@encounter_ground" → "@encounter_ground". */
function handleFrom(href: string, name: string, fallback: string) {
  const known = defaultContact.socials.find((s) => s.name === name);
  if (known && known.href === href) return known.handle;
  if (name === "WhatsApp channel") return fallback;
  try {
    const last = new URL(href).pathname.split("/").filter(Boolean).pop() ?? "";
    if (!last) return fallback;
    if (name === "YouTube") return last.replace(/^@/, "");
    return last.startsWith("@") ? last : `@${last}`;
  } catch {
    return fallback;
  }
}

function mergeContact(saved: Saved["contact"]): Contact {
  if (!saved) return { ...defaultContact, socials: [...defaultContact.socials] };
  const links: [string, string][] = [
    ["Instagram", saved.instagram],
    ["YouTube", saved.youtube],
    ["TikTok", saved.tiktok],
    ["WhatsApp channel", saved.whatsapp_channel],
  ];
  return {
    email: saved.email,
    phoneDisplay: saved.phone,
    phoneHref: phoneHref(saved.phone),
    socials: links.filter(([, href]) => href).map(([name, href]) => ({ name, href, handle: handleFrom(href, name, "Encounter Ground") })),
  };
}

function mergeYada(saved: Saved["yada"]): Yada {
  if (!saved) return { ...defaultYada };
  return {
    ...defaultYada,
    theme: saved.theme,
    when: saved.when,
    registerUrl: saved.register_url || defaultYada.registerUrl,
    about: saved.about ? paragraphs(saved.about) : defaultYada.about,
    dress: saved.dress ? paragraphs(saved.dress) : defaultYada.dress,
  };
}

function mergeHome(saved: Saved["home"]): Home {
  if (!saved) return { ...defaultHome };
  const href = { "YouTube replays": saved.replays_url, Mixlr: saved.mixlr_url, Zoom: saved.zoom_url } as Record<string, string>;
  return {
    ...defaultHome,
    tagline: saved.tagline,
    joinUsUrl: saved.join_url || defaultHome.joinUsUrl,
    // A stream left blank in the admin is taken off the site.
    streams: defaultHome.streams.map((s) => ({ ...s, href: href[s.name] ?? s.href })).filter((s) => s.href),
  };
}

/** The site's editable wording, fetched at most once a minute (and at once after an admin edit). */
export const getSiteContent = cache(async (): Promise<SiteContent> => {
  let saved: Saved = {};
  try {
    const res = await fetch(`${API_URL}/site-content`, { next: { revalidate: 60, tags: [SITE_CONTENT_TAG] } });
    if (res.ok) saved = (await res.json()) as Saved;
  } catch {
    // Fall back to the built-in wording.
  }
  return { contact: mergeContact(saved.contact), yada: mergeYada(saved.yada), home: mergeHome(saved.home) };
});

/** The WhatsApp channel link, which several pages feature. */
export const whatsappOf = (contact: Contact) =>
  contact.socials.find((s) => s.name === "WhatsApp channel") ?? defaultContact.socials.find((s) => s.name === "WhatsApp channel")!;
