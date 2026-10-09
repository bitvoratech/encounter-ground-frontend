import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { formatPostDate, posts } from "@/content/posts";

export const metadata: Metadata = {
  title: "Blog",
  description: "Teaching and encouragement from Encounter Ground on prayer, the Word and growing in faith.",
};

export default function BlogPage() {
  return (
    <>
      <header className="wrap pb-12 pt-14 md:pt-20">
        <h1 className="text-[length:var(--text-h1)] text-slate-ink">Blog</h1>
        <p className="mt-5 max-w-[34rem] text-lede leading-relaxed text-stone-muted">
          Discover faith, grow in grace, behold His beauty.
        </p>
      </header>

      <section aria-label="Articles" className="border-t border-rule">
        <ul className="wrap grid gap-10 py-14 md:grid-cols-2 md:py-20">
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
                <h2 className="mt-2 text-h3 text-slate-ink group-hover:underline group-hover:decoration-flame group-hover:underline-offset-4">
                  {post.title}
                </h2>
                <p className="mt-2 text-stone-muted">{post.excerpt}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
