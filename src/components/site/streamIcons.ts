import { IconBrandYoutube, IconHeadphones, IconVideo } from "@tabler/icons-react";

/** One icon per stream in `home.streams`, shared by the home page and the media page. */
export const streamIcons: Record<string, typeof IconVideo> = {
  "YouTube replays": IconBrandYoutube,
  Mixlr: IconHeadphones,
  Zoom: IconVideo,
};

export const streamIcon = (name: string) => streamIcons[name] ?? IconVideo;
