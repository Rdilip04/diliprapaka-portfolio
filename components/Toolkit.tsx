"use client";

import type { Key } from "react";
import { motion, useReducedMotion } from "motion/react";
import { BiLogoAdobe } from "react-icons/bi";
import {
  SiClaudecode,
  SiCursor,
  SiFigma,
  SiFramer,
  SiJira,
  SiMiro,
} from "react-icons/si";
import LogoLoop from "@/components/ui/logo-loop";
import type { LogoItem } from "@/components/ui/logo-loop";

const EASE = [0.22, 1, 0.36, 1] as const;

// Adobe comes from Boxicons because Simple Icons carries no Adobe mark, and
// its solid fill is the only one that matches the rest. Tabler's is an
// outline, which would put two drawing styles in the same strip.
const TOOLS: LogoItem[] = [
  { node: <SiFigma />, title: "Figma" },
  { node: <SiMiro />, title: "Miro" },
  { node: <SiFramer />, title: "Framer" },
  { node: <BiLogoAdobe />, title: "Adobe" },
  { node: <SiJira />, title: "Jira" },
  { node: <SiClaudecode />, title: "Claude Code" },
  { node: <SiCursor />, title: "Cursor" },
];

/**
 * The label doubles as the accessible name, which is why the icon is
 * aria-hidden: naming both would announce every tool twice.
 *
 * It is only ever hidden by opacity, never by `display`, so screen readers
 * still reach it while the pointer sees nothing until hover.
 */
function ToolItem(item: LogoItem, key: Key) {
  const name = "title" in item ? (item.title ?? "") : "";
  return (
    <span key={key} className="group relative inline-grid place-items-center">
      <span aria-hidden className="logoloop__node">
        {"node" in item ? item.node : null}
      </span>
      <span
        data-tool-label
        className="pointer-events-none absolute left-1/2 top-full z-20 mt-4 -translate-x-1/2 whitespace-nowrap rounded-lg border border-ink/12 bg-paper px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ink opacity-0 transition-opacity duration-200 group-hover:opacity-100"
      >
        {name}
      </span>
    </span>
  );
}

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
          into horizontal scroll. Upstream puts it on the wrapper too.
          The generous bottom padding is what the hover label drops into. */}
      <div className="w-full overflow-hidden py-14 md:py-16">
        <motion.div {...reveal} viewport={{ once: true, margin: "-15%" }}>
          <LogoLoop
            logos={TOOLS}
            renderItem={ToolItem}
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
