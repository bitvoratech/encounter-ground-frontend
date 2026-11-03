import type { NextConfig } from "next";
import { posts } from "./src/content/posts";

// Book covers uploaded in the admin live in Supabase Storage's public "covers" bucket.
const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL) : null;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // YouTube video thumbnails on the media page.
      { protocol: "https", hostname: "i.ytimg.com", pathname: "/vi/**" },
      ...(supabase
        ? [
            {
              protocol: supabase.protocol.replace(":", "") as "http" | "https",
              hostname: supabase.hostname,
              port: supabase.port,
              pathname: "/storage/v1/object/public/covers/**",
            },
          ]
        : []),
    ],
    // Local Supabase runs on 127.0.0.1, which Next blocks by default.
    dangerouslyAllowLocalIP: supabase?.hostname === "127.0.0.1",
  },
  // Old WordPress URLs (encounterground.org) that people may have saved or shared.
  async redirects() {
    return [
      { source: "/who-we-are", destination: "/about", permanent: true },
      { source: "/our-mission", destination: "/about", permanent: true },
      { source: "/elementor-24453", destination: "/events/yada-intimacy-conference-2026", permanent: true },
      { source: "/event", destination: "/events", permanent: true },
      { source: "/event/:slug", destination: "/events", permanent: true },
      { source: "/events/list", destination: "/events", permanent: true },
      { source: "/contacts", destination: "/contact", permanent: true },
      { source: "/shop", destination: "/books", permanent: true },
      { source: "/category/self-test", destination: "/self-test", permanent: true },
      { source: "/influence-self-test", destination: "/self-test/seven-mountains-of-influence", permanent: true },
      // The old slug contains a non-breaking hyphen ("self‑test"), so match the prefix.
      { source: "/fivefold-ministry-calling-:rest", destination: "/self-test/fivefold-ministry-calling", permanent: true },
      { source: "/category/mission", destination: "/blog", permanent: true },
      ...posts.map((p) => ({ source: p.legacyPath, destination: `/blog/${p.slug}`, permanent: true })),
    ];
  },
};

export default nextConfig;
