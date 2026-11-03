import type { Metadata } from "next";
import { SiteContentForms, type SiteContentValues } from "@/components/admin/SiteContentForms";
import { fullDate, PageHeader } from "@/components/admin/ui";
import { contact, home, yada } from "@/content/ministry";
import { adminGet, getStaff } from "@/lib/admin";

export const metadata: Metadata = { title: "Site content" };

type Saved = Partial<Record<keyof SiteContentValues, { value: unknown; updated_at: string }>>;

const social = (name: string) => contact.socials.find((s) => s.name === name)?.href ?? "";
const stream = (name: string) => home.streams.find((s) => s.name === name)?.href ?? "";

/** What the website shows today when nothing has been saved: the built-in wording. */
const builtIn: SiteContentValues = {
  contact: {
    email: contact.email,
    phone: contact.phoneDisplay,
    instagram: social("Instagram"),
    youtube: social("YouTube"),
    tiktok: social("TikTok"),
    whatsapp_channel: social("WhatsApp channel"),
  },
  yada: {
    theme: yada.theme,
    when: yada.when,
    register_url: yada.registerUrl,
    about: yada.about.join("\n\n"),
    dress: yada.dress.join("\n"),
  },
  home: {
    tagline: home.tagline,
    join_url: home.joinUsUrl,
    zoom_url: stream("Zoom"),
    mixlr_url: stream("Mixlr"),
    replays_url: stream("YouTube replays"),
  },
};

/** A saved block, if it still has every field the form expects; otherwise the built-in wording. */
function pick<K extends keyof SiteContentValues>(saved: Saved, key: K): SiteContentValues[K] {
  const value = saved[key]?.value;
  const fields = Object.keys(builtIn[key]);
  if (value && typeof value === "object" && fields.every((f) => typeof (value as Record<string, unknown>)[f] === "string"))
    return value as SiteContentValues[K];
  return builtIn[key];
}

export default async function AdminSiteContentPage() {
  const staff = await getStaff();
  if (staff.status !== "staff") return null;
  const saved = await adminGet<Saved>(staff.token, "/site-content");

  return (
    <>
      <PageHeader title="Site content">
        Contact details, the YADA conference and the home page’s links. Changes show on the website within a minute.
      </PageHeader>
      <SiteContentForms
        values={{ contact: pick(saved, "contact"), yada: pick(saved, "yada"), home: pick(saved, "home") }}
        updated={{
          contact: saved.contact && fullDate(saved.contact.updated_at),
          yada: saved.yada && fullDate(saved.yada.updated_at),
          home: saved.home && fullDate(saved.home.updated_at),
        }}
      />
    </>
  );
}
