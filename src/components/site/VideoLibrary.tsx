"use client";

import { IconBrandYoutube, IconPlayerPlayFilled } from "@tabler/icons-react";
import Image from "next/image";
import { useRef, useState } from "react";
import type { Video } from "@/lib/youtube";

const external = { target: "_blank", rel: "noopener noreferrer" } as const;
const thumb = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
const watchUrl = (id: string) => `https://www.youtube.com/watch?v=${id}`;
const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
const formatViews = (n: number) => `${new Intl.NumberFormat("en", { notation: "compact" }).format(n)} views`;

/**
 * The channel's latest videos, played on the site. The featured video shows a thumbnail
 * until someone presses play: only then does the (privacy-enhanced) YouTube player load.
 */
export function VideoLibrary({ videos }: { videos: Video[] }) {
  const [currentId, setCurrentId] = useState(videos[0]!.id);
  const [playing, setPlaying] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const current = videos.find((v) => v.id === currentId)!;

  const choose = (id: string) => {
    setCurrentId(id);
    setPlaying(true);
    // Bring the player into view and move focus to its title, so keyboard users follow.
    requestAnimationFrame(() => {
      titleRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      titleRef.current?.focus({ preventScroll: true });
    });
  };

  return (
    <div>
      {/* Featured player */}
      <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr] lg:items-start">
        <div className="relative aspect-video overflow-hidden rounded-3xl bg-slate-deep shadow-[0_30px_60px_-30px_rgb(29_38_48/0.6)]">
          {playing ? (
            <iframe
              key={current.id}
              src={`https://www.youtube-nocookie.com/embed/${current.id}?autoplay=1&rel=0`}
              title={current.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="absolute inset-0 size-full"
            />
          ) : (
            <button type="button" onClick={() => setPlaying(true)} className="group absolute inset-0 grid place-items-center">
              <Image src={thumb(current.id)} alt="" fill priority sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" />
              <span aria-hidden="true" className="absolute inset-0 bg-slate-deep/25 transition-colors group-hover:bg-slate-deep/10" />
              <span className="relative grid size-20 place-items-center rounded-full bg-flame text-slate-ink shadow-lg transition-transform group-hover:scale-105">
                <IconPlayerPlayFilled aria-hidden="true" size={34} />
              </span>
              <span className="sr-only">Play: {current.title}</span>
            </button>
          )}
        </div>

        <div>
          <p className="text-sm font-semibold text-amber">
            {current.id === videos[0]!.id ? "Latest" : "Now showing"} · {formatDate(current.published)}
            {current.views !== null && ` · ${formatViews(current.views)}`}
          </p>
          <h3 ref={titleRef} tabIndex={-1} className="mt-2 text-h3 leading-snug text-slate-ink outline-none md:text-[1.75rem]">
            {current.title}
          </h3>
          {current.description && (
            <p className="mt-3 line-clamp-4 whitespace-pre-line text-stone-muted">{current.description}</p>
          )}
          <a href={watchUrl(current.id)} {...external} className="link mt-5 inline-flex items-center gap-2 font-semibold text-slate-ink">
            <IconBrandYoutube aria-hidden="true" size={20} stroke={1.75} className="text-amber" />
            Watch on YouTube
          </a>
        </div>
      </div>

      {/* The rest, newest first */}
      <ul className="mt-12 grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((v) => {
          const isCurrent = v.id === currentId;
          return (
            <li key={v.id}>
              <button
                type="button"
                onClick={() => choose(v.id)}
                aria-current={isCurrent ? "true" : undefined}
                className="group block w-full text-left"
              >
                <span className="relative block aspect-video overflow-hidden rounded-2xl bg-slate-deep ring-flame ring-offset-2 ring-offset-limestone group-aria-[current=true]:ring-3">
                  <Image
                    src={thumb(v.id)}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-slate-deep/80 px-2.5 py-1 text-xs font-semibold text-chalk">
                    <IconPlayerPlayFilled aria-hidden="true" size={12} />
                    {isCurrent ? "Now showing" : "Play"}
                  </span>
                </span>
                <span className="mt-3 line-clamp-2 block font-semibold leading-snug text-slate-ink group-hover:underline group-hover:decoration-flame group-hover:underline-offset-4">
                  {v.title}
                </span>
                <span className="mt-1 block text-sm text-stone-muted">
                  {formatDate(v.published)}
                  {v.views !== null && ` · ${formatViews(v.views)}`}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
