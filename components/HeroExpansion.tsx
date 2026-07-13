"use client";

import ScrollExpandMedia from "@/components/blocks/scroll-expansion-hero";
import {
  VIGNETTE_BLOOM_VIDEO,
  VIGNETTE_BLOOM_POSTER,
} from "@/components/ui/vignette-bloom";

export default function HeroExpansion() {
  return (
    <ScrollExpandMedia
      mediaType="video"
      mediaSrc={VIGNETTE_BLOOM_VIDEO}
      posterSrc={VIGNETTE_BLOOM_POSTER}
      title="Dilip Rapaka"
      eyebrow="Product Designer"
      location={
        <span className="inline-flex items-center gap-2.5 whitespace-nowrap rounded-full border border-paper/15 bg-paper/5 px-4 py-2 text-sm font-medium text-paper/80 backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cosmic opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-cosmic" />
          </span>
          Open to junior UX &amp; product roles · UK
        </span>
      }
      scrollToExpand="I care about impact more than my identity as a designer."
    />
  );
}
