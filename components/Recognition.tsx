"use client";

import { motion, useReducedMotion } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;

// Surfaces the strongest proof at display size so it survives the blur test.
export default function Recognition() {
  const reduce = useReducedMotion();

  const reveal = reduce
    ? { initial: { opacity: 0 }, whileInView: { opacity: 1 } }
    : {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.7, ease: EASE },
      };

  return (
    <section className="border-y border-ink/10 bg-mist text-ink">
      <div className="mx-auto w-full max-w-7xl px-6 py-16 md:py-20">
        <motion.div
          {...reveal}
          viewport={{ once: true, margin: "-15%" }}
          className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-12"
        >
          <p className="max-w-2xl font-serif text-[clamp(1.75rem,4vw,3rem)] font-normal leading-[1.05] tracking-[-0.02em]">
            <span className="text-cobalt-ink">1st Place</span> — BCU Innovation
            Fest 2025
          </p>
          <p className="max-w-xs font-sans text-sm leading-relaxed text-ink/70">
            Awarded for <span className="font-medium text-ink">NextStep</span>, a
            stroke-rehabilitation concept for the NHS — recognised for innovation
            and impact in healthcare design.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
