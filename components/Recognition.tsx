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
    <section className="border-y border-ink/10 bg-canvas text-ink">
      <div className="w-full py-16 md:py-20">
        <motion.div {...reveal} viewport={{ once: true, margin: "-15%" }}>
          {/* The viewBox is 1200x520, most of which is empty space above and
              below the curve, so the wrapper crops to the band rather than
              editing the component's own geometry.

              The height has to be a vw, not a fixed px cap. The SVG scales to
              the element's width, so the band's height is (curviness*2.2 +
              ribbonWidth) / 1200 of it — here 190/1200 = 15.8vw. A fixed cap
              fits at one width and slices the peaks flat at every wider one. */}
          <TextLoop
            text="1st Place — BCU Innovation Fest 2025"
            color="var(--color-paper)"
            ribbonColor="var(--color-cobalt)"
            // Thinner band than the component's defaults (86/46). Both drop
            // together so the type keeps its breathing room inside the ribbon.
            ribbonWidth={58}
            fontSize={32}
            curviness={60}
            pauseOnHover={false}
            className="grid h-[17.5vw] place-items-center"
          />
        </motion.div>
      </div>
    </section>
  );
}
