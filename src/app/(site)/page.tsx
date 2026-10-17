import { IconArrowRight, IconArrowUpRight, IconBrandWhatsapp } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { streamIcon } from "@/components/site/streamIcons";
import { YadaBand } from "@/components/site/YadaBand";
import { contact, home, mandate, programmes, yada } from "@/content/ministry";
import { school, schoolClasses } from "@/content/school";
import { formatPostDate, posts } from "@/content/posts";
import { authorStoreUrl } from "@/content/books";
import heroImage from "../../../public/images/home/hero-gates.png";
import streamsImage from "../../../public/images/home/streams-gates.jpg";
import founderImage from "../../../public/images/home/founder-toyin-bello.jpg";
import bethElImage from "../../../public/images/home/beth-el-institute.jpg";
import booksImage from "../../../public/images/home/books-by-toyin-bello.jpg";

const external = { target: "_blank", rel: "noopener noreferrer" } as const;

export default function HomePage() {
  const youtube = home.streams[0]!;
  const whatsapp = contact.socials.find((s) => s.name === "WhatsApp channel")!;

  return (
    <>
      {/* Hero: the gates of heaven, framed in an arch. The photo is small, so it stays sharp
          inside the frame, and a blurred copy of it fills the band with its own light. */}
      <section className="relative isolate overflow-hidden bg-[#f6ead0] text-slate-ink">
        <Image
          src={heroImage}
          alt=""
          fill
          priority
          sizes="50vw"
          className="-z-20 scale-125 object-cover opacity-80 blur-2xl"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-b from-[#fdf6e6]/30 via-[#fdf6e6]/55 to-limestone"
        />

        <div className="wrap grid items-center gap-8 pb-16 pt-8 md:grid-cols-[1.15fr_1fr] md:gap-12 md:py-20 lg:py-24">
          <figure className="mx-auto w-full max-w-[15rem] sm:max-w-[18rem] md:order-last md:max-w-[26rem] lg:max-w-[28rem]">
            <div className="overflow-hidden rounded-t-full border-[6px] border-chalk/80 shadow-[0_30px_70px_-30px_rgb(138_90_6/0.55)]">
              <Image
                src={heroImage}
                alt="Golden gates open in the clouds, with two angels standing before them"
                priority
                placeholder="blur"
                sizes="(min-width: 1024px) 28rem, (min-width: 768px) 26rem, 18rem"
                className="aspect-[496/655] w-full scale-[1.03] object-cover object-left-top"
              />
            </div>
          </figure>

          <div className="text-center md:text-left">
            <a
              href={yada.registerUrl}
              {...external}
              className="inline-flex items-center gap-2 rounded-full border border-amber/25 bg-chalk/70 py-1.5 pl-1.5 pr-4 text-sm font-semibold text-slate-ink backdrop-blur transition-colors hover:border-amber/60"
            >
              <span className="rounded-full bg-flame px-2.5 py-0.5 text-xs">YADA {yada.year}</span>
              Registration is open
              <IconArrowRight aria-hidden="true" size={16} stroke={2} />
            </a>
            <h1 className="hero-title mt-6 text-[clamp(3rem,1.5rem+6.5vw,6.5rem)] leading-[0.92]">{home.tagline}</h1>
            <p className="mx-auto mt-6 max-w-[34rem] text-lede leading-relaxed text-slate-ink/85 md:mx-0">
              {home.welcome}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
              <a href={home.joinUsUrl} {...external} className="btn btn-fire">
                Join us
              </a>
              <Link href="/about" className="btn btn-quiet text-slate-ink">
                Read our story
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Who we are */}
      <section aria-labelledby="who-heading">
        <div className="wrap grid gap-10 py-16 md:grid-cols-[2fr_3fr] md:items-center md:gap-16 md:py-24">
          <figure className="mx-auto w-full max-w-[16rem] sm:max-w-xs md:max-w-none">
            <Image
              src={founderImage}
              alt="Toyin Bello, founder of Encounter Ground"
              placeholder="blur"
              sizes="(min-width: 768px) 40vw, 16rem"
              className="aspect-[4/5] w-full rounded-3xl object-cover object-top"
            />
            <figcaption className="mt-3 text-center text-sm text-stone-muted md:text-left">Toyin Bello, founder</figcaption>
          </figure>
          <div>
            <p className="font-semibold text-amber">Who we are</p>
            <h2 id="who-heading" className="mt-2 text-[length:var(--text-h2)] text-slate-ink">
              {home.whoWeAre.heading}
            </h2>
            <div className="prose-eg measure mt-6 text-slate-ink/90 md:text-[1.125rem]">
              {home.whoWeAre.body.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
            <blockquote className="measure mt-8 border-l-4 border-flame pl-5 font-display text-xl leading-snug text-slate-ink md:text-2xl">
              “{mandate}”
            </blockquote>
            <Link href="/about" className="btn btn-fire mt-8">
              About Encounter Ground
            </Link>
          </div>
        </div>
      </section>

      {/* The four pillars: a swipeable row on phones, a grid from tablet up */}
      <section aria-labelledby="pillars-heading" className="border-t border-rule bg-chalk">
        <div className="wrap py-16 md:py-24">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
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
          <ol className="no-scrollbar -mx-5 mt-10 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 lg:grid-cols-4">
            {home.pillars.map((p, i) => (
              <li
                key={p.title}
                className="flex w-[82%] shrink-0 snap-start flex-col rounded-3xl border border-rule bg-limestone p-6 sm:w-auto"
              >
                <span className="font-display text-4xl text-amber-logo" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 text-[1.375rem] leading-tight text-slate-ink">{p.title}</h3>
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
        <Image src={streamsImage} alt="" fill placeholder="blur" sizes="100vw" className="-z-10 object-cover" />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-deep/75 via-slate-deep/55 to-slate-deep/80"
        />
        <div className="wrap py-16 md:py-28">
          <div className="text-center">
            <p className="font-semibold text-flame">Our streams</p>
            <h2 id="streams-heading" className="mx-auto mt-2 max-w-2xl text-[length:var(--text-h2)]">
              Pray and worship with us, wherever you are
            </h2>
          </div>
          <ul className="mx-auto mt-10 grid max-w-4xl gap-3 sm:grid-cols-3 sm:gap-4">
            {home.streams.map((s) => {
              const Icon = streamIcon(s.name);
              return (
                <li key={s.name}>
                  <a
                    href={s.href}
                    {...external}
                    className="group flex h-full items-center gap-4 rounded-2xl border border-chalk/20 bg-slate-deep/50 p-4 backdrop-blur-sm transition-colors hover:border-flame sm:flex-col sm:items-start sm:p-5"
                  >
                    <span className="grid size-12 shrink-0 place-items-center rounded-full bg-flame text-slate-ink">
                      <Icon aria-hidden="true" size={22} stroke={1.75} />
                    </span>
                    <span className="flex-1">
                      <span className="block font-display text-xl sm:text-2xl">{s.name}</span>
                      <span className="block text-sm text-chalk/75 sm:text-base">{s.detail}</span>
                    </span>
                    <IconArrowUpRight
                      aria-hidden="true"
                      size={20}
                      stroke={2}
                      className="shrink-0 text-chalk/50 transition-colors group-hover:text-flame sm:hidden"
                    />
                  </a>
                </li>
              );
            })}
          </ul>
          <div className="mt-10 text-center">
            <a href={youtube.href} {...external} className="btn btn-fire">
              Watch the replays
            </a>
          </div>
        </div>
      </section>

      {/* Our events: the regular rhythm, read as a schedule */}
      <section aria-labelledby="rhythm-heading" className="bg-chalk">
        <div className="wrap py-16 md:py-24">
          <div className="grid gap-8 md:grid-cols-[1fr_2fr] md:gap-10">
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
                <li key={p.slug} className="grid gap-1 py-5 sm:grid-cols-[10rem_1fr] sm:gap-4">
                  <span className="text-sm font-semibold uppercase tracking-[0.12em] text-amber sm:pt-1.5 sm:text-base sm:normal-case sm:tracking-normal">
                    {p.when}
                  </span>
                  <div>
                    <h3 className="text-[1.375rem] leading-tight text-slate-ink sm:text-h3">{p.name}</h3>
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

      {/* The school: Beth-El Institute, a separate site under the ministry */}
      <section aria-labelledby="school-heading">
        <div className="wrap grid gap-10 py-16 md:grid-cols-[3fr_2fr] md:items-center md:gap-16 md:py-24">
          <div>
            <p className="font-semibold text-amber">The ministry school</p>
            <h2 id="school-heading" className="mt-2 text-[length:var(--text-h2)] text-slate-ink">
              {school.name}
            </h2>
            <p className="measure mt-6 text-slate-ink/90 md:text-[1.125rem]">{school.summary}</p>
            <p className="measure mt-4 text-stone-muted">{school.meaning}</p>
            <ul className="mt-8 grid grid-cols-2 gap-3">
              {schoolClasses.map((c) => (
                <li key={c.name} className="rounded-2xl border border-rule bg-chalk px-4 py-3.5 sm:px-5 sm:py-4">
                  <span className="font-display text-xl text-slate-ink sm:text-2xl">{c.name}</span>
                  <span className="block text-sm leading-snug text-stone-muted">{c.meaning}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/school" className="btn btn-fire">
                Visit the school
              </Link>
              <Link href="/school/enrol" className="btn btn-quiet text-slate-ink">
                Enrol
              </Link>
            </div>
          </div>
          <Link
            href="/school"
            className="group order-first mx-auto block w-full max-w-[16rem] overflow-hidden rounded-3xl border border-rule sm:max-w-xs md:order-none md:max-w-none"
          >
            <Image
              src={bethElImage}
              alt="Beth-El Institute of the Supernatural, an offshoot of Encounter Ground"
              placeholder="blur"
              sizes="(min-width: 768px) 35vw, 16rem"
              className="w-full transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </Link>
        </div>
      </section>

      {/* From the blog */}
      <section aria-labelledby="blog-heading" className="border-t border-rule bg-chalk">
        <div className="wrap py-16 md:py-24">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
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
          <ul className="mt-10 grid gap-10 md:grid-cols-2 md:gap-8">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link href={`/blog/${post.slug}`} className="group block">
                  <div className="overflow-hidden rounded-3xl">
                    <Image
                      src={post.image}
                      alt=""
                      width={740}
                      height={473}
                      sizes="(min-width: 768px) 45vw, 100vw"
                      className="aspect-[740/473] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <p className="mt-4 text-sm text-stone-muted">
                    <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt)}</time>
                    {" · "}
                    {post.category}
                  </p>
                  <h3 className="mt-2 text-[1.375rem] leading-tight text-slate-ink group-hover:underline group-hover:decoration-flame group-hover:underline-offset-4 sm:text-h3">
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
      <section aria-labelledby="connect-heading">
        <div className="wrap py-14 md:py-20">
          <div className="flex flex-col gap-6 rounded-3xl border border-rule bg-chalk p-6 sm:flex-row sm:items-center sm:justify-between md:p-10">
            <div className="flex flex-col items-start gap-4 sm:flex-row">
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-flame/20 text-amber">
                <IconBrandWhatsapp aria-hidden="true" size={24} stroke={1.75} />
              </span>
              <div>
                <h2 id="connect-heading" className="text-h3 text-slate-ink md:text-[2rem]">
                  Subscribe for updates on WhatsApp
                </h2>
                <p className="mt-2 text-stone-muted">Programme reminders and teachings, straight to your phone.</p>
              </div>
            </div>
            <a href={whatsapp.href} {...external} className="btn btn-fire shrink-0 self-start sm:self-auto">
              Follow the channel
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
