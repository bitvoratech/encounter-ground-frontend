import { IconAlignLeft, IconFileText, IconFlag, IconHeadphones, IconListCheck, IconPlayerPlay } from "@tabler/icons-react";
import type { LessonKind } from "@/content/courses";

export const lessonKinds: Record<LessonKind, { label: string; Icon: typeof IconPlayerPlay }> = {
  video: { label: "Video", Icon: IconPlayerPlay },
  audio: { label: "Audio", Icon: IconHeadphones },
  text: { label: "Reading", Icon: IconAlignLeft },
  pdf: { label: "Study guide", Icon: IconFileText },
  checkpoint: { label: "Checkpoint", Icon: IconFlag },
  quiz: { label: "Final check", Icon: IconListCheck },
};

export const formatMinutes = (minutes: number) =>
  minutes < 60 ? `${minutes} min` : `${Math.floor(minutes / 60)} h ${minutes % 60 ? `${minutes % 60} min` : ""}`.trim();
