import type { Metadata } from "next";
import { Fraunces, Inter, Dancing_Script } from "next/font/google";
import "./globals.css";
import LoadingScreen from "@/components/LoadingScreen";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz"],
});

const signature = Dancing_Script({
  variable: "--font-signature-src",
  subsets: ["latin"],
  display: "swap",
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: "Dilip Rapaka — UX/UI Designer",
  description:
    "Product designer working on calm, usable interfaces for healthcare and public services, including the NHS. Based in the UK.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} ${signature.variable}`}
    >
      <body>
        <LoadingScreen />
        {children}
      </body>
    </html>
  );
}
