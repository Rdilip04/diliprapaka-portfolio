import type { Metadata } from "next";
import { Inter, Martian_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const mono = Martian_Mono({
  variable: "--font-mono-src",
  subsets: ["latin"],
  display: "swap",
});

// Editorial display serif — the contrast axis against the grotesk/mono.
const serif = Instrument_Serif({
  variable: "--font-serif-src",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const DESCRIPTION =
  "Dilip Rapaka is a UX & product designer in the UK, designing simple, thoughtful digital experiences for healthcare and everyday complexity. Open to junior UX & product roles.";

// The OG and Twitter cards need absolute URLs, so this has to be the real
// production origin. Set NEXT_PUBLIC_SITE_URL in the Vercel project once the
// final domain is known; the fallback is the default Vercel subdomain.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://diliprapaka.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Dilip Rapaka — Product Designer",
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
    title: "Dilip Rapaka — Product Designer",
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "Dilip Rapaka — Product Designer",
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
      className={`${inter.variable} ${mono.variable} ${serif.variable}`}
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
      <body>{children}</body>
    </html>
  );
}
