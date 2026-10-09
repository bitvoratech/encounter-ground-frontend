/** A same-site path to send someone to after signing in; anything else falls back. */
export function safeNext(value: FormDataEntryValue | string | null | undefined, fallback = "/dashboard") {
  const next = typeof value === "string" ? value : "";
  return next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/\\") ? next : fallback;
}
