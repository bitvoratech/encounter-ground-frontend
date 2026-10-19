// Shared by the media page's player and the home page's latest videos.

export const videoThumb = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

export const formatVideoDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

export const formatViews = (n: number) => `${new Intl.NumberFormat("en", { notation: "compact" }).format(n)} views`;

/** Link to a video on the media page, where the player picks it up from the hash. */
export const mediaVideoHref = (id: string) => `/media#v-${id}`;
