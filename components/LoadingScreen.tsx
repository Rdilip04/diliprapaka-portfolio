"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import TetrisLoading from "@/components/ui/tetris-loading";

const VISIBLE_MS = 3000;
const FADE_MS = 500;

export default function LoadingScreen() {
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<"show" | "hide" | "done">("show");

  useEffect(() => {
    // Users who prefer reduced motion skip straight to the site.
    if (reduceMotion) {
      setPhase("done");
      return;
    }
    const hideTimer = setTimeout(() => setPhase("hide"), VISIBLE_MS);
    const doneTimer = setTimeout(() => setPhase("done"), VISIBLE_MS + FADE_MS);
    return () => {
      clearTimeout(hideTimer);
      clearTimeout(doneTimer);
    };
  }, [reduceMotion]);

  // Lock scroll while the loader covers the page.
  useEffect(() => {
    if (phase === "done") return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [phase]);

  if (phase === "done") return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading portfolio"
      className={`dark fixed inset-0 z-[1000] flex items-center justify-center bg-black transition-opacity duration-500 ${
        phase === "hide" ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <TetrisLoading size="md" speed="normal" loadingText="Loading" />
    </div>
  );
}
