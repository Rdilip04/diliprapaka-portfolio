"use client";

import { motion, useReducedMotion } from "motion/react";
import {
  SiClaudecode,
  SiCursor,
  SiFigma,
  SiFramer,
  SiJira,
  SiMiro,
} from "react-icons/si";
import LogoLoop from "@/components/ui/logo-loop";

const EASE = [0.22, 1, 0.36, 1] as const;

// FigJam has no mark of its own (it sits under the Figma brand) and Adobe
// withdrew Illustrator from Simple Icons, so those two run as wordmarks. The
// alternative was borrowing from another icon family, which would have put two
// different drawing styles in the same strip.
function Wordmark({ children }: { children: string }) {
  return (
    <span className="font-mono text-[15px] uppercase tracking-[0.14em]">
      {children}
    </span>
  );
}

const TOOLS = [
  { node: <SiFigma title="Figma" />, ariaLabel: "Figma" },
  { node: <Wordmark>FigJam</Wordmark>, ariaLabel: "FigJam" },
  { node: <SiMiro title="Miro" />, ariaLabel: "Miro" },
  { node: <SiFramer title="Framer" />, ariaLabel: "Framer" },
  { node: <Wordmark>Illustrator</Wordmark>, ariaLabel: "Adobe Illustrator" },
  { node: <SiJira title="Jira" />, ariaLabel: "Jira" },
  { node: <SiClaudecode title="Claude Code" />, ariaLabel: "Claude Code" },
  { node: <SiCursor title="Cursor" />, ariaLabel: "Cursor" },
];

export default function Toolkit() {
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
      {/* overflow-hidden is not optional: the component's track is
          `width: max-content`, so without it the strip pushes the whole page
          into horizontal scroll. Upstream puts it on the wrapper too. */}
      <div className="w-full overflow-hidden py-14 md:py-16">
        <motion.div {...reveal} viewport={{ once: true, margin: "-15%" }}>
          <LogoLoop
            logos={TOOLS}
            speed={38}
            gap={72}
            logoHeight={30}
            fadeOut
            // Must be the section's own surface, or the fade blends towards
            // the wrong colour. A token, not a hex, so it follows the theme.
            fadeOutColor="var(--color-canvas)"
            scaleOnHover
            // Matches the rest of the site's motion: nothing stalls on hover.
            pauseOnHover={false}
            ariaLabel="Tools I design with"
            className="text-ink/85"
          />
        </motion.div>
      </div>
    </section>
  );
}
