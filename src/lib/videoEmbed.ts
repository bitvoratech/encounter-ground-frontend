// Lesson videos are YouTube or Vimeo links for now (protected hosting comes later). This
// turns the link the team pastes into the player address, or null if it isn't one.

export function videoEmbedUrl(link: string): string | null {
  let url: URL;
  try {
    url = new URL(link.trim());
  } catch {
    return null;
  }
  if (url.protocol !== "https:") return null;
  const host = url.hostname.replace(/^(www|m)\./, "");
  const id11 = (s: string | null | undefined) => (s && /^[\w-]{11}$/.test(s) ? s : null);

  let youtube: string | null = null;
  if (host === "youtu.be") youtube = id11(url.pathname.slice(1));
  else if (host === "youtube.com" || host === "youtube-nocookie.com") {
    youtube = url.pathname === "/watch" ? id11(url.searchParams.get("v")) : id11(url.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)/)?.[1]);
  }
  if (youtube) return `https://www.youtube-nocookie.com/embed/${youtube}?rel=0`;

  if (host === "vimeo.com" || host === "player.vimeo.com") {
    // vimeo.com/123456, vimeo.com/123456/abcdef (unlisted), player.vimeo.com/video/123456?h=abcdef
    const m = url.pathname.match(/^\/(?:video\/)?(\d+)(?:\/([\da-f]+))?/);
    if (!m) return null;
    const hash = m[2] ?? url.searchParams.get("h");
    return `https://player.vimeo.com/video/${m[1]}${hash ? `?h=${hash}` : ""}`;
  }
  return null;
}
