// The latest uploads from a YouTube channel, from its public feed: no API key, about the 15
// newest videos (finished live streams included). Cached for an hour, so new uploads appear
// on the site within the hour without anyone touching it. Call from server code only.

export type Video = {
  id: string;
  title: string;
  published: string; // ISO date
  description: string;
  views: number | null;
};

const decode = (text: string) =>
  text
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n: string) => String.fromCodePoint(Number(n)))
    .replace(/&amp;/g, "&");

const tag = (xml: string, name: string) => {
  const match = xml.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`));
  return match ? decode(match[1]!.trim()) : "";
};

/** Newest first, or `null` if the feed can't be reached (the page then links to YouTube). */
export async function getLatestVideos(channelId: string): Promise<Video[] | null> {
  try {
    const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const xml = await res.text();
    // The first block is the channel itself; each <entry> is a video.
    return xml
      .split("<entry>")
      .slice(1)
      .map((entry) => {
        const views = entry.match(/<media:statistics views="(\d+)"/);
        return {
          id: tag(entry, "yt:videoId"),
          title: tag(entry, "title"),
          published: tag(entry, "published"),
          description: tag(entry, "media:description"),
          views: views ? Number(views[1]) : null,
        };
      })
      .filter((v) => /^[\w-]{11}$/.test(v.id));
  } catch {
    return null;
  }
}
