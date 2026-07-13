"use client";

import { useReducedMotion } from "motion/react";

// AsciiArt — "Vignette Bloom", from 21.dev (author: serafim), made with the
// 21st.dev ASCII editor and baked to a looping video. Zero dependencies.
// Source: https://21st.dev/@serafimcloud/components/vignette-bloom
// Reduced-motion handling added: renders the static poster frame instead of
// the autoplaying video when the user prefers reduced motion.

export const VIGNETTE_BLOOM_VIDEO =
  "https://assets.21st.dev/ascii-recipes/videos/user_2nElBLvklOKlAURm6W1PTu6yYFh/ce2c1d6e-d203-4519-8bd5-8fabf950352b.mp4";
export const VIGNETTE_BLOOM_POSTER =
  "https://assets.21st.dev/ascii-recipes/thumbnails/user_2nElBLvklOKlAURm6W1PTu6yYFh/0920f00b-2ec1-4cb9-87ec-5ba0d33c1d32.webp";

export function AsciiArt({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <img
        className={className}
        src={VIGNETTE_BLOOM_POSTER}
        alt=""
        aria-hidden
        style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }}
      />
    );
  }

  return (
    <video
      className={className}
      src={VIGNETTE_BLOOM_VIDEO}
      poster={VIGNETTE_BLOOM_POSTER}
      autoPlay
      loop
      muted
      playsInline
      aria-hidden
      style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }}
    />
  );
}
