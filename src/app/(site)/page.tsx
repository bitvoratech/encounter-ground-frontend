import Image from "next/image";
import Link from "next/link";
import { YadaBand } from "@/components/site/YadaBand";
import { contact, discipleshipClasses, home, mandate, programmes } from "@/content/ministry";
import { formatPostDate, posts } from "@/content/posts";
import { authorStoreUrl } from "@/content/books";
import heroImage from "../../../public/images/home/hero-presence.webp";
import streamsImage from "../../../public/images/home/streams-gates.jpg";
import founderImage from "../../../public/images/home/founder-toyin-bello.jpg";
import bethElImage from "../../../public/images/home/beth-el-institute.jpg";
import booksImage from "../../../public/images/home/books-by-toyin-bello.jpg";

const external = { target: "_blank", rel: "noopener noreferrer" } as const;

export default function HomePage() {
  const youtube = home.streams[0]!;

  return (
    <>
      {/* Hero: the golden hall from the former site, darkened so the words stay legible */}
      <section className="relative isolate overflow-hidden bg-slate-deep text-chalk">
        <Image
          src={heroImage}
          alt=""
          fill
          priority
          placeholder="blur"
          sizes="100vw"
          className="-z-10 object-cover object-[30%_center]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-deep/85 via-slate-deep/45 to-transparent"
        />
        <div className="wrap flex min-h-[34rem] flex-col justify-center py-20 md:min-h-[40rem] md:py-28">
          <p className="text-lg font-semibold tracking-wide text-flame">Encounter Ground</p>
          <h1 className="mt-3 max-w-3xl text-[length:var(--text-display)] leading-[0.95]">
            {home.tagline}
          </h1>
          <p className="mt-7 max-w-[34rem] text-lede leading-relaxed text-chalk/90">{home.welcome}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href={home.joinUsUrl} {...external} className="btn btn-fire">
              Join us
            </a>
            <Link href="/about" className="btn btn-quiet">
              Read our story
            </Link>
          </div>
        </div>
      </section>

      {/* Who we are */}
      <section aria-labelledby="who-heading">
        <div className="wrap grid gap-12 py-16 md:grid-cols-[2fr_3fr] md:items-center md:gap-16 md:py-24">
          <figure className="relative mx-auto w-full max-w-sm md:max-w-none">
            <Image
              src={founderImage}
              alt="Toyin Bello, founder of Encounter Ground"
              placeholder="blur"
              sizes="(min-width: 768px) 40vw, 90vw"
              className="aspect-[4/5] w-full rounded-3xl object-cover object-top"
            />
            <figcaption className="mt-3 text-stone-muted">
              Toyin Bello, founder
            </figcaption>
          </figure>
          <div>
            <p className="font-semibold text-amber">Who we are</p>
            <h2 id="who-heading" className="mt-2 text-[length:var(--text-h2)] text-slate-ink">
              {home.whoWeAre.heading}
            </h2>
            <div className="prose-eg measure mt-6 text-[1.125rem] text-slate-ink/90">
              {home.whoWeAre.body.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
            <blockquote className="measure mt-8 border-l-4 border-flame pl-5 font-display text-2xl leading-snug text-slate-ink">
              “{mandate}”
            </blockquote>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <Link href="/about" className="btn btn-fire">
                About Encounter Ground
              </Link>
              <div className="flex items-center gap-3">
                <Image
                  src={bethElImage}
                  alt=""
                  sizes="56px"
                  className="size-14 rounded-xl border border-rule"
                />
                <p className="max-w-[14rem] text-sm leading-snug text-stone-muted">
                  <span className="font-semibold text-slate-ink">Beth-El Institute of the Supernatural</span>
                  , an offshoot of Encounter Ground
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The four pillars */}
      <section aria-labelledby="pillars-heading" className="border-t border-rule bg-chalk">
        <div className="wrap py-16 md:py-24">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-semibold text-amber">Our vision &amp; mission</p>
              <h2 id="pillars-heading" className="mt-2 text-[length:var(--text-h2)] text-slate-ink">
                The pillars of Encounter Ground
              </h2>
            </div>
            <Link href="/about" className="link self-start font-semibold text-slate-ink md:self-auto">
              Learn more
            </Link>
          </div>
          <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {home.pillars.map((p, i) => (
              <li key={p.title} className="flex flex-col rounded-3xl border border-rule bg-limestone p-6">
                <span className="font-display text-4xl text-amber-logo" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 text-h3 text-slate-ink">{p.title}</h3>
                <p className="mt-3 text-stone-muted">{p.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Books by the founder */}
      <section aria-labelledby="books-heading">
        <div className="wrap grid gap-10 py-16 md:grid-cols-[3fr_2fr] md:items-center md:py-24">
          <Link href="/books" className="group block overflow-hidden rounded-3xl">
            <Image
              src={booksImage}
              alt="Six books by Toyin Bello: From Servant to Bride, From Bride to Warrior Bride, From Bride to Beloved, Burn, and Who I Am Becoming for girls and for guys"
              placeholder="blur"
              sizes="(min-width: 768px) 60vw, 100vw"
              className="w-full transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </Link>
          <div>
            <p className="font-semibold text-amber">From the bookshelf</p>
            <h2 id="books-heading" className="mt-2 text-[length:var(--text-h2)] text-slate-ink">
              Books by Toyin Bello
            </h2>
            <p className="mt-4 max-w-md text-stone-muted">
              Devotionals and journals on intimacy with God, prayer and identity, for
              adults, pre-teens and teenagers.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/books" className="btn btn-fire">
                See the books
              </Link>
              <a href={authorStoreUrl} {...external} className="btn btn-quiet text-slate-ink">
                Order on Amazon
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Streams: the golden gates from the former site */}
      <section aria-labelledby="streams-heading" className="relative isolate overflow-hidden bg-slate-deep text-chalk">
        <Image
          src={streamsImage}
          alt=""
          fill
          placeholder="blur"
          sizes="100vw"
          className="-z-10 object-cover"
        />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-deep/70 via-slate-deep/45 to-slate-deep/70" />
        <div className="wrap py-20 text-center md:py-28">
          <p className="font-semibold text-flame">Our streams</p>
          <h2 id="streams-heading" className="mx-auto mt-2 max-w-2xl text-[length:var(--text-h2)]">
            Pray and worship with us, wherever you are
          </h2>
          <ul className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-3">
            {home.streams.map((s) => (
              <li key={s.name}>
                <a
                  href={s.href}
                  {...external}
                  className="flex h-full flex-col rounded-2xl border border-chalk/25 bg-slate-deep/40 px-5 py-5 backdrop-blur-sm transition-colors hover:border-flame hover:bg-slate-deep/60"
                >
                  <span className="font-display text-2xl">{s.name}</span>
                  <span className="mt-1 text-chalk/75">{s.detail}</span>
                </a>
              </li>
            ))}
          </ul>
          <a href={youtube.href} {...external} className="btn btn-fire mt-10">
            Watch the replays
          </a>
        </div>
      </section>

      {/* Our events: the regular rhythm, read as a schedule */}
      <section aria-labelledby="rhythm-heading" className="bg-chalk">
        <div className="wrap py-16 md:py-24">
          <div className="grid gap-10 md:grid-cols-[1fr_2fr]">
            <div>
              <p className="font-semibold text-amber">Our events</p>
              <h2 id="rhythm-heading" className="mt-2 text-[length:var(--text-h2)] text-slate-ink">
                Where to meet us
              </h2>
              <p className="mt-4 max-w-xs text-stone-muted">
                Prayer, healing and teaching run all year. Join any of them.
              </p>
              <Link href="/events" className="link mt-6 inline-block font-semibold text-slate-ink">
                View all programmes
              </Link>
            </div>
            <ul className="divide-y divide-rule border-y border-rule">
              {programmes.map((p) => (
                <li key={p.slug} className="grid grid-cols-[7.5rem_1fr] gap-4 py-5 sm:grid-cols-[10rem_1fr]">
                  <span className="pt-1 font-semibold text-amber">{p.when}</span>
                  <div>
                    <h3 className="text-h3 text-slate-ink">{p.name}</h3>
                    <p className="mt-1 text-stone-muted">
                      {p.detail}
                      {p.where ? `, ${p.where.charAt(0).toLowerCase()}${p.where.slice(1)}` : ""}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <YadaBand />

      {/* Discipleship classes */}
      <section aria-labelledby="classes-heading">
        <div className="wrap py-16 md:py-24">
          <div className="grid gap-10 md:grid-cols-[1fr_2fr] md:items-end">
            <div>
              <h2 id="classes-heading" className="text-[length:var(--text-h2)] text-slate-ink">
                Discipleship classes
              </h2>
              <p className="mt-4 max-w-sm text-stone-muted">
                Structured teaching for every stage of the walk. Classes move online
                when the Ministry School opens on this site.
              </p>
            </div>
            <ul className="flex flex-wrap gap-x-10 gap-y-3">
              {discipleshipClasses.map((c) => (
                <li key={c} className="font-display text-[length:var(--text-h2)] text-slate">
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* From the blog */}
      <section aria-labelledby="blog-heading" className="border-t border-rule bg-chalk">
        <div className="wrap py-16 md:py-24">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-semibold text-amber">From our blog</p>
              <h2 id="blog-heading" className="mt-2 text-[length:var(--text-h2)] text-slate-ink">
                Discover faith, grow in grace, behold His beauty
              </h2>
            </div>
            <Link href="/blog" className="link self-start font-semibold text-slate-ink md:self-auto">
              View all articles
            </Link>
          </div>
          <ul className="mt-10 grid gap-8 md:grid-cols-2">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link href={`/blog/${post.slug}`} className="group block">
                  <Image
                    src={post.image}
                    alt=""
                    width={740}
                    height={473}
                    sizes="(min-width: 768px) 45vw, 100vw"
                    className="aspect-[740/473] w-full rounded-3xl object-cover transition-opacity group-hover:opacity-90"
                  />
                  <p className="mt-4 text-sm text-stone-muted">
                    <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt)}</time>
                    {" · "}
                    {post.category}
                  </p>
                  <h3 className="mt-2 text-h3 text-slate-ink group-hover:underline group-hover:decoration-flame group-hover:underline-offset-4">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-stone-muted">{post.excerpt}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Stay connected: replaces the old newsletter form, which never worked */}
      <section aria-labelledby="connect-heading" className="border-t border-rule">
        <div className="wrap flex flex-col gap-8 py-14 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 id="connect-heading" className="text-h3 md:text-[2rem] text-slate-ink">
              Subscribe for updates on WhatsApp
            </h2>
            <p className="mt-2 text-stone-muted">
              Programme reminders and teachings, straight to your phone.
            </p>
          </div>
          <a
            href={contact.socials.find((s) => s.name === "WhatsApp channel")!.href}
            {...external}
            className="btn btn-quiet self-start text-slate-ink md:self-auto"
          >
            Follow the channel
          </a>
        </div>
      </section>
    </>
  );
}
