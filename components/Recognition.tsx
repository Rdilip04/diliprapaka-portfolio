"use client";

import { motion, useReducedMotion } from "motion/react";
import TextLoop from "@/components/ui/text-loop";

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
    <section className="border-y border-ink/10 bg-paper text-ink">
      <div className="w-full py-16 md:py-20">
        <motion.div {...reveal} viewport={{ once: true, margin: "-15%" }}>
          {/* The viewBox is 1200x520, most of which is empty space above and
              below the curve. The wrapper crops to the band and centres it,
              rather than editing the component's own geometry. */}
          <TextLoop
            text="1st Place — BCU Innovation Fest 2025"
            color="var(--color-paper)"
            ribbonColor="var(--color-cobalt)"
            // Thinner band than the component's defaults (86/46). Both drop
            // together so the type keeps its breathing room inside the ribbon.
            ribbonWidth={58}
            fontSize={32}
            pauseOnHover={false}
            className="grid h-[clamp(170px,24vw,290px)] place-items-center"
          />

          <p className="mx-auto mt-10 max-w-md px-6 text-center font-sans text-sm leading-relaxed text-ink/70">
            Awarded for <span className="font-medium text-ink">NextStep</span>, a
            stroke-rehabilitation concept for the NHS — recognised for innovation
            and impact in healthcare design.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
