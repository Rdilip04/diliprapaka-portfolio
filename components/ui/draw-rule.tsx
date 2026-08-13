"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { animate } from "animejs";

// Runs before paint on the client so the rule is collapsed *before* it is ever
// shown. A plain useEffect would render it full-width for one frame, then snap
// back to zero — a visible pop.
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * A hairline that draws itself in when it scrolls into view.
 *
 * Hairlines are the structural language of this site, so the one piece of added
 * motion extends the existing vocabulary rather than decorating around it.
 *
 * Fails safe: with JS disabled or reduced motion on, nothing collapses it and
 * it renders as a normal static rule.
 */
export function DrawRule({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    el.style.transform = "scaleX(0)";

    const observer = new IntersectionObserver(
      ([entry], obs) => {
        if (!entry.isIntersecting) return;
        obs.disconnect();
        animate(el, { scaleX: [0, 1], duration: 900, ease: "outQuart" });
      },
      { rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className={`h-px w-full origin-left bg-ink/12 ${className ?? ""}`}
    />
  );
}
