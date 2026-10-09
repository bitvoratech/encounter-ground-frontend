import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Self-hosted (SIL Open Font License) so builds never depend on Google Fonts.
const gloock = localFont({
  src: "../fonts/gloock-latin-400-normal.woff2",
  weight: "400",
  variable: "--font-gloock",
  display: "swap",
});

const hanken = localFont({
  src: "../fonts/hanken-grotesk-latin-wght-normal.woff2",
  weight: "100 900",
  variable: "--font-hanken",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Encounter Ground",
    template: "%s | Encounter Ground",
  },
  description:
    "Encounter Ground awakens and equips people through discipleship and prophetic teaching, so they walk in intimacy with God and live the purpose He has written for them.",
  openGraph: {
    siteName: "Encounter Ground",
    type: "website",
    locale: "en_NG",
  },
};

export const viewport: Viewport = {
  themeColor: "#27323d",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-NG" className={`${gloock.variable} ${hanken.variable}`}>
      <body className="min-h-dvh flex flex-col antialiased">{children}</body>
    </html>
  );
}
