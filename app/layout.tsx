import type { Metadata } from "next";
import { Instrument_Sans, Martian_Mono } from "next/font/google";
import SparkLayer from "@/components/SparkLayer";
import "./globals.css";

// One family for display and body. Instrument Sans carries a real italic (the
// emphasis on "hard" and "that matters" depends on it) and a width axis, which
// the display sizes use to tighten the measure. It replaced Inter + Instrument
// Serif: two families now, not three.
const sans = Instrument_Sans({
  variable: "--font-sans-src",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["wdth"],
  display: "swap",
});

const mono = Martian_Mono({
  variable: "--font-mono-src",
  subsets: ["latin"],
  display: "swap",
});

const DESCRIPTION =
  "Dilip Rapaka is a UX & product designer in the UK, designing simple, thoughtful digital experiences for healthcare and everyday complexity. Open to junior UX & product roles.";

// The OG and Twitter cards need absolute URLs, so this has to be the real
// production origin. NEXT_PUBLIC_SITE_URL overrides it (set it in the Vercel
// project if the site moves to a custom domain); the fallback is the live
// deployment. It used to be `diliprapaka.vercel.app`, which is not where the
// site is served, so every link preview pointed at the wrong origin.
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://diliprapaka-portfolio.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Dilip Rapaka, Product Designer",
    template: "%s · Dilip Rapaka",
  },
  description: DESCRIPTION,
  keywords: [
    "Dilip Rapaka",
    "UX Designer",
    "Product Designer",
    "UI/UX",
    "Healthcare design",
    "UK",
    "Portfolio",
  ],
  authors: [{ name: "Dilip Rapaka" }],
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Dilip Rapaka",
    title: "Dilip Rapaka, Product Designer",
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "Dilip Rapaka, Product Designer",
    description: DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Every load starts at the top of the homepage in the light editorial
            design — that is the primary design, so nothing is restored from a
            previous visit (no saved theme, no anchor, no scroll position).
            Must stay inline and synchronous: dropping the hash here happens
            before the browser jumps to the anchor, so there is no visible
            scroll lurch to undo afterwards. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if('scrollRestoration' in history)history.scrollRestoration='manual';if(location.hash)history.replaceState(null,'',location.pathname+location.search)}catch(e){}`,
          }}
        />
      </head>
      <body>
        <SparkLayer>{children}</SparkLayer>
      </body>
    </html>
  );
}
