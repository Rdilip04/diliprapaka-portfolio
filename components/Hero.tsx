"use client";

import { Fragment, useRef } from "react";
import type { ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "motion/react";
import TiltedCard from "@/components/ui/tilted-card";

const EMAIL = "dilipuxdesigner04@gmail.com";

// H1 as tokens, so each word is individually hover-reactive.
type Word = string | { t: string; em?: boolean; accent?: boolean };
const H1: Word[] = [
  "Hi,",
  "I’m",
  { t: "Dilip", accent: true },
  { t: "Rapaka.", accent: true },
  "I",
  "turn",
  { t: "hard", em: true },
  "problems",
  "into",
  "products",
  "people",
  "can",
  "actually",
  "use.",
];

function MagneticLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLAnchorElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 220, damping: 18, mass: 0.4 });
  const y = useSpring(my, { stiffness: 220, damping: 18, mass: 0.4 });

  const onMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - (r.left + r.width / 2)) * 0.35);
    my.set((e.clientY - (r.top + r.height / 2)) * 0.35);
  };
  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={reduce ? undefined : { x, y }}
      className={className}
    >
      {children}
    </motion.a>
  );
}

export default function Hero() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spx = useSpring(px, { stiffness: 120, damping: 20, mass: 0.5 });
  const spy = useSpring(py, { stiffness: 120, damping: 20, mass: 0.5 });
  const tx = useTransform(spx, (v) => v * 14);
  const ty = useTransform(spy, (v) => v * 9);
  const txImg = useTransform(spx, (v) => v * -12);
  const tyImg = useTransform(spy, (v) => v * -8);

  const gx = useMotionValue(-1200);
  const gy = useMotionValue(-1200);
  const gsx = useSpring(gx, { stiffness: 140, damping: 26, mass: 0.6 });
  const gsy = useSpring(gy, { stiffness: 140, damping: 26, mass: 0.6 });

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    if (reduce || !sectionRef.current) return;
    const r = sectionRef.current.getBoundingClientRect();
    px.set((e.clientX - (r.left + r.width / 2)) / r.width);
    py.set((e.clientY - (r.top + r.height / 2)) / r.height);
    gx.set(e.clientX - r.left);
    gy.set(e.clientY - r.top);
  };
  const onLeave = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <section
      ref={sectionRef}
      id="top"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative flex min-h-svh flex-col overflow-hidden bg-canvas text-ink"
    >
      {/* Column grid — the layout's own columns, made faintly visible. Nested
          so the gradient box is the padded content area, which is what makes
          the verticals land on the same grid the copy is set to. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <div className="mx-auto h-full w-full max-w-7xl px-6">
          <div className="bg-column-grid h-full w-full" />
        </div>
      </div>

      {!reduce && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute z-0 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            left: gsx,
            top: gsy,
            background:
              "radial-gradient(circle, rgba(47,43,230,0.08) 0%, rgba(47,43,230,0.03) 35%, transparent 62%)",
          }}
        />
      )}

      <div className="relative z-10 flex flex-1 items-center">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-6 pt-28 lg:grid-cols-[1fr_auto] lg:gap-20">
          {/* Left — the whole pitch, stacked */}
          <motion.div
            style={reduce ? undefined : { x: tx, y: ty }}
            className="max-w-2xl"
          >
            {/* The name is in the H1, so it is not repeated here. Held at /70:
                /55 measures 3.90:1 and fails AA. */}
            <p
              className="anim-fade-up font-mono text-label uppercase tracking-[0.2em] text-ink/70"
              style={{ animationDelay: "0.05s" }}
            >
              Product Designer
            </p>

            <h1
              className="anim-fade-up mt-5 font-display text-display font-medium leading-[1.1] tracking-[-0.02em] text-ink"
              style={{ animationDelay: "0.12s" }}
            >
              {/* A real space between the words, not just a margin. These are
                  inline-blocks: without it the heading serialises as one
                  run-on word for screen readers and copy-paste. */}
              {H1.map((w, i) => {
                const text = typeof w === "string" ? w : w.t;
                const em = typeof w === "object" && w.em;
                const accent = typeof w === "object" && w.accent;
                return (
                  <Fragment key={i}>
                    <span
                      className={`inline-block transition-[transform,color] duration-300 ease-out hover:-translate-y-0.5 hover:text-cobalt-ink ${
                        em ? "italic" : ""
                      } ${accent ? "text-cobalt-ink" : ""}`}
                    >
                      {text}
                    </span>
                    {i < H1.length - 1 && " "}
                  </Fragment>
                );
              })}
            </h1>

            <p
              className="anim-fade-up mt-6 max-w-md font-sans text-base leading-relaxed text-ink/70"
              style={{ animationDelay: "0.2s" }}
            >
              A product designer based in the UK. I keep things{" "}
              <span className="text-cobalt-ink">simple and easy to use</span>.
              Currently open to junior roles.
            </p>

            <div
              className="anim-fade-up mt-9 flex flex-wrap items-center gap-5"
              style={{ animationDelay: "0.28s" }}
            >
              <a
                href="#work"
                className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 min-h-11 font-mono text-label font-semibold uppercase tracking-[0.16em] text-paper transition-colors duration-300 hover:bg-cobalt-ink"
              >
                Selected work
                <span
                  aria-hidden
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                >
                  →
                </span>
              </a>
              <MagneticLink
                href={`mailto:${EMAIL}`}
                className="group inline-flex min-h-11 items-center gap-2 font-mono text-label font-semibold uppercase tracking-[0.16em] text-ink/70 transition-colors hover:text-ink"
              >
                Let&apos;s talk
                <span
                  aria-hidden
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                >
                  →
                </span>
              </MagneticLink>
            </div>
          </motion.div>

          {/* Right — portrait, animates in with the rest */}
          <motion.div
            style={reduce ? undefined : { x: txImg, y: tyImg }}
            className="hidden shrink-0 justify-self-end lg:block"
          >
            <div className="anim-fade-up" style={{ animationDelay: "0.35s" }}>
              {/* The portrait's counterpart to the About block: same geometry,
                  same accent, mirrored. About fills its offset down-right; this
                  one outlines up-left, so the two portraits read as a pair
                  rather than as the same trick twice. `mr-0.5` is the 2px nudge
                  off the right edge — the only value on the page off the 8pt
                  grid, and deliberate. */}
              <div className="relative mr-0.5 w-fit">
                <div
                  aria-hidden
                  className="absolute -left-4 -top-4 h-[350px] w-[280px] rounded-lg border border-cobalt/40"
                />
                {/* z-10, or the frame paints over the photo — an absolutely
                    positioned element outranks static content in the painting
                    order regardless of source order. Same trap as About. */}
                <div className="relative z-10">
                  <TiltedCard
                    imageSrc="/dilip-hero.jpg"
                    altText="Dilip Rapaka, product designer"
                    captionText="Dilip Rapaka"
                    width="280px"
                    height="350px"
                    rotateAmplitude={9}
                    scaleOnHover={1.04}
                    eager
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* The hairline that closes the Hero, and the seam Selected work reads
          against. No scroll cue above it: a visitor on the first screen
          already knows the page continues. */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pt-10">
        <div className="h-px w-full bg-ink/12" />
      </div>
    </section>
  );
}
