import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Self-hosted (SIL Open Font License) so builds never depend on Google Fonts.
// Fraunces for headings: a soft, slightly "wonky" variable serif (playful and storybook,
// still reverent). Nunito for text: rounded and friendly. The client chose this pairing
// (option A) on 19 Oct 2026, replacing Gloock + Hanken Grotesk as more playful.
const fraunces = localFont({
  src: "../fonts/fraunces-latin-var.woff2",
  weight: "100 900",
  variable: "--font-fraunces",
  display: "swap",
});

const nunito = localFont({
  src: "../fonts/nunito-latin-wght-normal.woff2",
  weight: "200 1000",
  variable: "--font-nunito",
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
    <html lang="en-NG" className={`${fraunces.variable} ${nunito.variable}`}>
      <body className="min-h-dvh flex flex-col antialiased">{children}</body>
    </html>
  );
}
