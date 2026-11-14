// Shared by the registration form and the admin's registrations list.

/** "Fri 18 Dec" from "2026-12-18". Anything that isn't a date is returned as it is. */
export function dayLabel(iso: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;
  return new Date(`${iso}T00:00:00Z`)
    .toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" })
    .replace(",", "");
}

/** The three days of YADA 2026, as the registration form offers them. */
export const YADA_DAYS = ["2026-12-18", "2026-12-19", "2026-12-20"].map((value) => ({ value, label: dayLabel(value) }));

// These choices are also checked by the API (back/src/routes/registrations.ts). Keep the two in step.
export const PICKUP_AREAS = ["Ikeja", "Ajah", "Yaba", "Ikorodu", "Other"] as const;
export const GENDERS = ["Male", "Female"] as const;
export const AGE_RANGES = ["Under 18", "18–24", "25–34", "35–44", "45 and above"] as const;
export const HEARD_FROM = ["Instagram", "YouTube", "TikTok", "WhatsApp", "Friend or family", "Church", "Other"] as const;
