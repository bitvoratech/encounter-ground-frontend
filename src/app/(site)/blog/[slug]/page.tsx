import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatPostDate, posts } from "@/content/posts";

const findPost = (slug: string) => posts.find((p) => p.slug === slug);

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const post = findPost((await params).slug);
  return post ? { title: post.title, description: post.excerpt } : {};
}

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const post = findPost((await params).slug);
  if (!post) notFound();

  return (
    <article>
      <header className="wrap pb-10 pt-14 md:pt-20">
        <p className="text-stone-muted">
          <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt)}</time>
          {" · "}
          {post.category}
        </p>
        <h1 className="mt-3 max-w-4xl text-[length:var(--text-h1)] text-slate-ink">{post.title}</h1>
      </header>

      <div className="wrap">
        <Image
          src={post.image}
          alt=""
          width={740}
          height={473}
          priority
          sizes="(min-width: 1152px) 1088px, 100vw"
          className="aspect-[2/1] w-full rounded-3xl object-cover"
        />
      </div>

      <div className="wrap py-14 md:py-20">
        <div className="prose-eg measure mx-auto text-[1.125rem] text-slate-ink/90">
          {post.body.map((block, i) =>
            block.type === "p" ? (
              <p key={i}>{block.text}</p>
            ) : (
              <ol key={i} className="my-6 list-decimal space-y-3 pl-6 marker:font-semibold marker:text-amber">
                {block.items.map((item) => (
                  <li key={item.lead}>
                    <strong className="text-slate-ink">{item.lead}:</strong> {item.text}
                  </li>
                ))}
              </ol>
            ),
          )}
          <p className="mt-12">
            <Link href="/blog" className="link font-semibold">
              More articles
            </Link>
          </p>
        </div>
      </div>
    </article>
  );
}
