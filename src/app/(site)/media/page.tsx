import { IconArrowUpRight, IconBrandYoutube } from "@tabler/icons-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { streamIcon } from "@/components/site/streamIcons";
import { VideoLibrary } from "@/components/site/VideoLibrary";
import { contact, home, programmes, youtubeChannel } from "@/content/ministry";
import { getLatestVideos } from "@/lib/youtube";
import streamsImage from "../../../../public/images/home/streams-gates.jpg";
import egTvLogo from "../../../../public/images/home/eg-tv-logo.jpg";

export const metadata: Metadata = {
  title: "Media",
  description:
    "Watch replays on YouTube, listen on Mixlr, or join the live meeting on Zoom.",
};

const external = { target: "_blank", rel: "noopener noreferrer" } as const;

export default async function MediaPage() {
  const live = programmes.filter((p) => p.when !== "December");
  const videos = await getLatestVideos(youtubeChannel.id);

  return (
    <>
      <header className="relative isolate overflow-hidden bg-slate-deep text-chalk">
        <Image
          src={streamsImage}
          alt=""
          fill
          priority
          placeholder="blur"
          sizes="100vw"
          className="-z-10 object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-deep/70 via-slate-deep/45 to-slate-deep/80"
        />
        <div className="wrap pb-20 pt-16 md:pb-28 md:pt-24">
          <p className="font-semibold text-flame">Media</p>
          <h1 className="mt-2 max-w-3xl text-[length:var(--text-h1)]">
            Catch up on our replays
          </h1>
          <p className="mt-5 max-w-[34rem] text-lede leading-relaxed text-chalk/90">
            Every stream is recorded. Watch the replays right here, listen on Mixlr,
            or join the next meeting live on Zoom.
          </p>
        </div>
      </header>

      <section aria-labelledby="videos-heading" className="border-b border-rule">
        <div className="wrap py-14 md:py-20">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="flex items-center gap-5">
              <Image
                src={egTvLogo}
                alt=""
                placeholder="blur"
                sizes="6rem"
                className="hidden size-24 shrink-0 rounded-2xl object-cover sm:block"
              />
              <div>
                <p className="eyebrow">{youtubeChannel.name}</p>
                <h2 id="videos-heading" className="mt-4 text-[length:var(--text-h2)] text-slate-ink">
                  Latest streams and <em>teachings</em>
                </h2>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href={youtubeChannel.subscribeUrl} {...external} className="btn btn-fire">
                <IconBrandYoutube aria-hidden="true" size={20} stroke={1.75} />
                Subscribe
              </a>
              <a href={youtubeChannel.url} {...external} className="btn btn-quiet text-slate-ink">
                All videos on YouTube
              </a>
            </div>
          </div>
          <div className="mt-10">
            {videos && videos.length > 0 ? (
              <VideoLibrary videos={videos} />
            ) : (
              <p className="rounded-3xl border border-rule bg-chalk p-6 text-stone-muted md:p-8">
                The latest videos can’t be shown right now.{" "}
                <a href={youtubeChannel.url} {...external} className="link font-semibold text-slate-ink">
                  Watch them on YouTube
                </a>
                .
              </p>
            )}
          </div>
        </div>
      </section>

      <section aria-label="Where to watch and listen">
        <ul className="wrap grid gap-4 py-14 md:grid-cols-3 md:gap-5 md:py-20">
          {home.streams.map((s) => {
            const Icon = streamIcon(s.name);
            return (
              <li key={s.name}>
                <a
                  href={s.href}
                  {...external}
                  className="group flex h-full flex-col rounded-3xl border border-rule bg-chalk p-6 transition-colors hover:border-slate md:p-7"
                >
                  <span className="grid size-12 place-items-center rounded-full bg-flame/20 text-amber">
                    <Icon aria-hidden="true" size={22} stroke={1.75} />
                  </span>
                  <span className="mt-5 font-display text-[1.75rem] leading-tight text-slate-ink md:text-[2rem]">
                    {s.name}
                  </span>
                  <span className="mt-2 text-stone-muted">{s.detail}</span>
                  <span className="mt-6 inline-flex items-center gap-1.5 font-semibold text-amber group-hover:underline">
                    Open {s.name.split(" ")[0]}
                    <IconArrowUpRight aria-hidden="true" size={18} stroke={2} />
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </section>

      <section
        aria-labelledby="schedule-heading"
        className="border-t border-rule bg-chalk"
      >
        <div className="wrap grid gap-8 py-14 md:grid-cols-[1fr_2fr] md:gap-10 md:py-20">
          <div>
            <h2
              id="schedule-heading"
              className="text-[length:var(--text-h2)] text-slate-ink"
            >
              When we go live
            </h2>
            <p className="mt-4 max-w-xs text-stone-muted">
              Times are shared on the{" "}
              <a
                href={
                  contact.socials.find((s) => s.name === "WhatsApp channel")!
                    .href
                }
                {...external}
                className="link"
              >
                WhatsApp channel
              </a>{" "}
              ahead of each programme.
            </p>
          </div>
          <ul className="divide-y divide-rule border-y border-rule">
            {live.map((p) => (
              <li
                key={p.slug}
                className="grid gap-1 py-5 sm:grid-cols-[10rem_1fr] sm:gap-4"
              >
                <span className="text-sm font-semibold uppercase tracking-[0.12em] text-amber sm:pt-1.5 sm:text-base sm:normal-case sm:tracking-normal">
                  {p.when}
                </span>
                <div>
                  <h3 className="text-[1.375rem] leading-tight text-slate-ink sm:text-h3">
                    {p.name}
                  </h3>
                  <p className="mt-1 text-stone-muted">{p.where ?? p.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="library-heading">
        <div className="wrap flex flex-col gap-6 py-14 md:flex-row md:items-center md:justify-between">
          <div>
            <h2
              id="library-heading"
              className="text-h3 text-slate-ink md:text-[2rem]"
            >
              A teaching library is on its way
            </h2>
            <p className="mt-2 max-w-xl text-stone-muted">
              Teachings and series will soon be watchable right here, organised
              and searchable.
            </p>
          </div>
          <Link
            href="/register"
            className="btn btn-quiet self-start text-slate-ink md:self-auto"
          >
            Create an account
          </Link>
        </div>
      </section>
    </>
  );
}
