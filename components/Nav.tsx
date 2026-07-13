"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { PixelCanvas } from "@/components/ui/pixel-canvas";

const LINKS = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function Nav() {
  const reduceMotion = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      // Switch to the light-surface glass once past the dark hero.
      setScrolled(window.scrollY > window.innerHeight * 0.8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={reduceMotion ? false : { y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: reduceMotion ? 0 : 0.2 }}
      className="fixed left-1/2 top-4 z-50 -translate-x-1/2"
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-0 focus:top-0 focus:rounded-md focus:bg-paper focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-ink"
      >
        Skip to content
      </a>

      <nav
        aria-label="Primary"
        className={`flex items-center gap-1 rounded-full border p-1.5 shadow-lg backdrop-blur-md transition-colors duration-300 ${
          scrolled
            ? "border-ink/10 bg-paper/70 shadow-ink/5"
            : "border-white/15 bg-white/10 shadow-black/20"
        }`}
      >
        {LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className={`group relative overflow-hidden rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              scrolled ? "text-ink/70 hover:text-ink" : "text-paper/80 hover:text-paper"
            }`}
          >
            <PixelCanvas
              gap={4}
              speed={40}
              colors={["#ff8a5c", "#ff6b35", "#c2410c"]}
              variant="icon"
            />
            <span className="relative z-10">{link.label}</span>
          </a>
        ))}
      </nav>
    </motion.header>
  );
}
