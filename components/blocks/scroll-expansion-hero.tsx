"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { StarField } from "@/components/ui/star-field";

interface ScrollExpandMediaProps {
  mediaType?: "video" | "image";
  mediaSrc: string;
  posterSrc?: string;
  title?: string;
  eyebrow?: string;
  scrollToExpand?: string;
  location?: ReactNode;
  children?: ReactNode;
}

function Media({
  mediaType,
  mediaSrc,
  posterSrc,
  title,
}: {
  mediaType: "video" | "image";
  mediaSrc: string;
  posterSrc?: string;
  title?: string;
}) {
  if (mediaType === "image") {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={mediaSrc} alt={title ?? ""} aria-hidden className="h-full w-full object-cover" />;
  }
  return (
    <video
      src={mediaSrc}
      poster={posterSrc}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      controls={false}
      aria-hidden
      className="h-full w-full object-cover"
    />
  );
}

export default function ScrollExpandMedia({
  mediaType = "video",
  mediaSrc,
  posterSrc,
  title,
  eyebrow,
  scrollToExpand,
  location,
}: ScrollExpandMediaProps) {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const expand = useTransform(scrollYProgress, [0, 0.65], [0, 1]);
  const mediaW = useTransform(expand, [0, 1], [340, 1700]);
  const mediaH = useTransform(expand, [0, 1], [460, 900]);
  const overlayOpacity = useTransform(expand, [0, 1], [0.62, 0.34]);
  const backdropOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const starsOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);
  // Product Designer + tagline slide apart and disappear fast; name splits and fades slowly.
  const bottomOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);
  const nameOpacity = useTransform(scrollYProgress, [0.14, 0.52], [1, 0]);
  const locationOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);
  const nameLeftX = useTransform(expand, [0, 1], ["0vw", "-22vw"]);
  const nameRightX = useTransform(expand, [0, 1], ["0vw", "22vw"]);
  const eyebrowX = useTransform(expand, [0, 1], ["0vw", "-32vw"]);
  const taglineX = useTransform(expand, [0, 1], ["0vw", "32vw"]);

  const firstWord = title ? title.split(" ")[0] : "";
  const restOfTitle = title ? title.split(" ").slice(1).join(" ") : "";

  const nameClass =
    "font-signature text-7xl leading-[0.9] text-cosmic md:text-9xl [text-shadow:0_2px_24px_rgba(0,0,0,0.7)]";

  // Reduced motion: a static, fully-legible hero with no scroll animation.
  if (reduceMotion) {
    return (
      <section className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-black px-6 py-24 text-center">
        <div
          className="absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(120% 90% at 50% 55%, #141414 0%, #0a0a0a 45%, #000 100%)",
          }}
          aria-hidden
        />
        <div className="relative z-10 flex flex-col items-center">
          <h1 className={nameClass}>{title}</h1>
          {eyebrow && (
            <p className="mt-8 font-sans text-sm font-semibold uppercase tracking-[0.25em] text-cosmic">
              {eyebrow}
            </p>
          )}
          {scrollToExpand && (
            <p className="mt-4 max-w-md font-sans text-base text-paper/70 sm:text-lg">
              {scrollToExpand}
            </p>
          )}
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="relative bg-black" style={{ height: "250vh" }}>
      <div className="sticky top-0 h-svh overflow-hidden">
        {/* Backdrop + stars */}
        <motion.div style={{ opacity: backdropOpacity }} className="absolute inset-0 z-0" aria-hidden>
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(120% 90% at 50% 55%, #141414 0%, #0a0a0a 45%, #000 100%)",
            }}
          />
          <motion.div style={{ opacity: starsOpacity }} className="absolute inset-0">
            <StarField className="absolute inset-0 h-full w-full" />
          </motion.div>
        </motion.div>

        {/* Expanding media (centered) */}
        <motion.div
          style={{ width: mediaW, height: mediaH, maxWidth: "96vw", maxHeight: "86vh" }}
          className="absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl shadow-2xl"
        >
          <Media mediaType={mediaType} mediaSrc={mediaSrc} posterSrc={posterSrc} title={title} />
          <motion.div style={{ opacity: overlayOpacity }} className="absolute inset-0 bg-ink" aria-hidden />
        </motion.div>

        {/* Overlay content — name centered, Product Designer + tagline below.
            Everything slides apart as the media expands (name fades slowly,
            Product Designer + tagline fade fast). */}
        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center">
          <motion.div
            style={{ opacity: nameOpacity }}
            className="flex flex-col items-center leading-[0.9]"
          >
            <motion.span style={{ x: nameLeftX }} className={nameClass}>
              {firstWord}
            </motion.span>
            {restOfTitle && (
              <motion.span style={{ x: nameRightX }} className={nameClass}>
                {restOfTitle}
              </motion.span>
            )}
          </motion.div>

          {eyebrow && (
            <motion.p
              style={{ opacity: bottomOpacity, x: eyebrowX }}
              className="mt-8 font-sans text-sm font-semibold uppercase tracking-[0.25em] text-cosmic"
            >
              {eyebrow}
            </motion.p>
          )}
          {scrollToExpand && (
            <motion.p
              style={{ opacity: bottomOpacity, x: taglineX }}
              className="mt-4 max-w-md font-sans text-base text-paper/75 sm:text-lg"
            >
              {scrollToExpand}
            </motion.p>
          )}
        </div>

        {/* Location — bottom right */}
        {location && (
          <motion.div
            style={{ opacity: locationOpacity }}
            className="absolute bottom-6 right-6 z-10 max-w-[calc(100vw-3rem)] md:bottom-8 md:right-10"
          >
            {location}
          </motion.div>
        )}

        {/* Scroll cue */}
        <motion.div
          aria-hidden
          style={{ opacity: cueOpacity }}
          className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-paper/60"
        >
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="block text-base"
          >
            ↓
          </motion.span>
        </motion.div>
      </div>
    </section>
  );
}
