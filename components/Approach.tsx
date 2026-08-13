"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: "h-[18px] w-[18px]",
  "aria-hidden": true,
};

type Method = { label: string; icon: ReactNode };

const METHODS: Method[] = [
  {
    label: "User Research",
    icon: (
      <svg {...iconProps}>
        <circle cx="11" cy="11" r="7" />
        <path d="m21 21-4.3-4.3" />
      </svg>
    ),
  },
  {
    label: "Usability Testing",
    icon: (
      <svg {...iconProps}>
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    label: "Journey Mapping",
    icon: (
      <svg {...iconProps}>
        <circle cx="6" cy="19" r="2" />
        <circle cx="18" cy="5" r="2" />
        <path d="M8 19h6a3 3 0 0 0 0-6h-4a3 3 0 0 1 0-6h6" />
      </svg>
    ),
  },
  {
    label: "Interaction Design",
    icon: (
      <svg {...iconProps}>
        <path d="m5 3 5.5 16 2.3-6.7L19.5 10 5 3Z" />
        <path d="m14 14 5 5" />
      </svg>
    ),
  },
  {
    label: "Design Systems",
    icon: (
      <svg {...iconProps}>
        <path d="m12 3 8 4.5-8 4.5-8-4.5L12 3Z" />
        <path d="m4 12 8 4.5 8-4.5M4 16.5 12 21l8-4.5" />
      </svg>
    ),
  },
  {
    label: "Accessibility (WCAG)",
    icon: (
      <svg {...iconProps}>
        <circle cx="12" cy="4.5" r="1.6" />
        <path d="M5.5 8 12 9.2 18.5 8" />
        <path d="M12 9.2V14" />
        <path d="m9 19 3-5 3 5" />
      </svg>
    ),
  },
];

const TOOLS = ["Figma", "Framer", "Miro", "Claude Code", "Cursor"];

export default function Approach() {
  const reduce = useReducedMotion();

  const reveal = (delay: number) =>
    reduce
      ? { initial: { opacity: 0 }, whileInView: { opacity: 1 } }
      : {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          transition: { duration: 0.6, ease: EASE, delay },
        };

  return (
    <section id="approach" className="border-t border-ink/10 bg-mist text-ink">
      <div className="mx-auto w-full max-w-7xl px-6 py-24 md:py-32">
        {/* Header */}
        <motion.h2
          {...reveal(0)}
          viewport={{ once: true, margin: "-12%" }}
          className="font-serif text-[clamp(1.75rem,3.4vw,2.75rem)] font-normal leading-none tracking-[-0.01em]"
        >
          How I work
        </motion.h2>

        {/* POV line */}
        <motion.p
          {...reveal(0.05)}
          viewport={{ once: true, margin: "-12%" }}
          className="mt-10 max-w-3xl text-pretty font-serif text-[clamp(1.4rem,2.6vw,2.15rem)] font-normal leading-[1.3] tracking-[-0.01em]"
        >
          I balance{" "}
          <span className="text-cobalt-ink">broad exploration</span> with{" "}
          <span className="text-cobalt-ink">focused execution</span>, adapting my
          process to the constraints of the problem.
        </motion.p>

        {/* Two-column: Methods | Toolkit */}
        <div className="mt-16 grid gap-10 border-t border-ink/12 pt-10 md:grid-cols-[1.5fr_1fr] md:gap-16">
          {/* Methods — icon list with micro-interactions */}
          <motion.div {...reveal(0.1)} viewport={{ once: true, margin: "-10%" }}>
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/70">
              Methods
            </span>
            <ul className="mt-6 grid grid-cols-1 gap-x-10 sm:grid-cols-2">
              {METHODS.map((method) => (
                <li
                  key={method.label}
                  className="group flex items-center gap-3.5 border-b border-ink/12 py-3.5"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-ink/12 bg-canvas text-ink/70 transition-all duration-300 ease-out group-hover:-translate-y-0.5 group-hover:border-cobalt/40 group-hover:text-cobalt-ink">
                    {method.icon}
                  </span>
                  <span className="font-sans text-[15px] text-ink/85 transition-colors duration-300 group-hover:text-cobalt-ink">
                    {method.label}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Toolkit */}
          <motion.div
            {...reveal(0.16)}
            viewport={{ once: true, margin: "-10%" }}
            className="md:border-l md:border-ink/12 md:pl-16"
          >
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/70">
              Toolkit
            </span>
            <ul className="mt-6 flex flex-wrap gap-2.5">
              {TOOLS.map((tool) => (
                <li
                  key={tool}
                  className="rounded-lg border border-ink/15 bg-canvas px-4 py-2 font-sans text-sm font-medium text-ink transition-colors duration-300 hover:border-cobalt/40 hover:text-cobalt-ink"
                >
                  {tool}
                </li>
              ))}
            </ul>
            <p className="mt-5 max-w-xs font-sans text-[13px] leading-relaxed text-ink/70">
              Figma for design. I actively use Claude Code and Cursor to bridge
              the gap between design and front-end, including{" "}
              <span className="font-medium text-ink">
                building this very portfolio
              </span>
              .
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
