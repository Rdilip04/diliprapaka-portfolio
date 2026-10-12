"use client";

import { useRef } from "react";
import type { ReactNode } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";

const EMAIL = "dilipuxdesigner04@gmail.com";
const LINKEDIN = "https://www.linkedin.com/in/diliprapaka";
const YEAR = new Date().getFullYear();
const EASE = [0.22, 1, 0.36, 1] as const;

function MagneticEmail() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLAnchorElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 200, damping: 18, mass: 0.5 });
  const y = useSpring(my, { stiffness: 200, damping: 18, mass: 0.5 });

  const onMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - (r.left + r.width / 2)) * 0.2);
    my.set((e.clientY - (r.top + r.height / 2)) * 0.3);
  };
  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={`mailto:${EMAIL}`}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={reduce ? undefined : { x, y }}
      // `py-2.5 -my-2.5` grows the tap target to 44px on phones (the text box
      // alone is ~24px at the statement floor) without moving the layout; the
      // underline still sits 8px under the text, now measured from the padding.
      className="group relative -my-2.5 inline-block py-2.5 font-display text-statement font-medium leading-[1.05] tracking-[-0.02em] text-shell-fg"
    >
      {EMAIL}
      <span className="absolute bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-cobalt-lite transition-transform duration-500 ease-out group-hover:origin-left group-hover:scale-x-100" />
    </motion.a>
  );
}

function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      data-reveal
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12%" }}
      transition={{ duration: 0.7, ease: EASE, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Footer() {
  return (
    <footer id="contact" className="bg-shell text-shell-fg">
      <div className="mx-auto w-full max-w-7xl px-6 pb-10 pt-24 md:pt-32">
        <Reveal>
          <p className="font-mono text-label uppercase tracking-[0.18em] text-shell-fg/60">
            Contact
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <h2 className="mt-6 max-w-4xl text-balance font-display text-statement font-medium leading-[1.05] tracking-[-0.02em] text-shell-fg">
            Let&apos;s make something{" "}
            <em className="italic text-cobalt-lite">that matters.</em>
          </h2>
        </Reveal>

        <Reveal delay={0.1} className="mt-14">
          <MagneticEmail />
        </Reveal>

        <Reveal
          delay={0.15}
          className="mt-16 grid gap-10 border-t border-shell-fg/12 pt-8 sm:grid-cols-3"
        >
          <div className="flex flex-col gap-3">
            <span className="font-sans text-sm font-medium text-shell-fg/60">
              Elsewhere
            </span>
            <a
              href={LINKEDIN}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex min-h-11 w-fit items-center gap-1.5 font-sans text-sm text-shell-fg/85 transition-colors hover:text-shell-fg"
            >
              LinkedIn
              <span
                aria-hidden
                className="text-shell-fg/55 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cobalt-lite"
              >
                ↗
              </span>
            </a>
            <a
              href="/Dilip-Rapaka-CV.pdf"
              target="_blank"
              rel="noreferrer"
              className="group inline-flex min-h-11 w-fit items-center gap-1.5 font-sans text-sm text-shell-fg/85 transition-colors hover:text-shell-fg"
            >
              CV / Résumé
              <span
                aria-hidden
                className="text-shell-fg/55 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cobalt-lite"
              >
                ↗
              </span>
            </a>
          </div>

          <div className="flex flex-col gap-3">
            <span className="font-sans text-sm font-medium text-shell-fg/60">
              Availability
            </span>
            <span className="inline-flex w-fit items-center gap-2.5 font-sans text-sm text-shell-fg/85">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cobalt-lite opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-cobalt-lite" />
              </span>
              Open to junior roles · UK
            </span>
          </div>

          <div className="flex flex-col gap-3">
            <span className="font-sans text-sm font-medium text-shell-fg/60">
              Navigate
            </span>
            <a
              href="#main"
              className="group inline-flex min-h-11 w-fit items-center gap-1.5 font-sans text-sm text-shell-fg/85 transition-colors hover:text-shell-fg"
            >
              Back to top
              <span
                aria-hidden
                className="text-shell-fg/55 transition-transform duration-300 group-hover:-translate-y-0.5"
              >
                ↑
              </span>
            </a>
          </div>
        </Reveal>

        <div className="mt-20 flex flex-col gap-2 border-t border-shell-fg/10 pt-6 font-sans text-sm text-shell-fg/60 sm:flex-row sm:items-center sm:justify-between">
          <span>© {YEAR} Dilip Rapaka</span>
          <span>Designed &amp; built by Dilip</span>
        </div>
      </div>
    </footer>
  );
}
