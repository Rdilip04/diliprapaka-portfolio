"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { DrawRule } from "@/components/ui/draw-rule";
import type { Project } from "@/lib/projects";
import { PROJECTS } from "@/lib/projects";

const EASE = [0.22, 1, 0.36, 1] as const;

const isPlaceholder = (p: Project) => p.title.startsWith("[");

function Thumb({ project }: { project: Project }) {
  if (project.image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={project.image}
        alt={`${project.title} — preview`}
        className="h-full w-full object-cover"
      />
    );
  }
  return (
    <div className="grid h-full w-full place-items-center bg-mist">
      <span className="font-serif text-xl leading-none text-ink/70">
        {project.index}
      </span>
    </div>
  );
}

function ExpandedContext({ project }: { project: Project }) {
  return (
    <div className="grid gap-x-8 gap-y-3 pt-4 md:grid-cols-[1fr_auto] md:items-start">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink/70">
          {project.role} · {project.duration}
        </p>
        <p className="mt-3 max-w-md font-sans text-sm leading-relaxed text-ink/70">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-cobalt-ink">
            Outcome —{" "}
          </span>
          {project.why}
        </p>
      </div>
      <div className="flex flex-col gap-3 md:items-end">
        <ul className="flex flex-wrap gap-2 md:justify-end">
          {project.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-ink/15 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-ink/70"
            >
              {tag}
            </li>
          ))}
        </ul>
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-cobalt-ink">
          Read case study →
        </span>
      </div>
    </div>
  );
}

// An honest, quiet slot for work that isn't published yet.
function ComingSoonRow({ project }: { project: Project }) {
  return (
    <li className="border-b border-ink/12">
      <div className="flex items-center gap-5 py-6 md:gap-8">
        <span className="hidden w-6 shrink-0 font-mono text-xs tabular-nums text-ink/70 sm:block">
          {project.index}
        </span>
        <div className="h-14 w-[76px] shrink-0 overflow-hidden rounded-lg border border-ink/10 opacity-60">
          <Thumb project={project} />
        </div>
        <div className="flex min-w-0 flex-1 items-baseline justify-between gap-4">
          <h3 className="font-serif text-[clamp(1.35rem,3vw,2rem)] font-normal leading-none tracking-[-0.01em] text-ink/70">
            Coming soon
          </h3>
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink/70">
            In progress
          </span>
        </div>
      </div>
    </li>
  );
}

function ProjectRow({
  project,
  open,
  onOpen,
  onClose,
}: {
  project: Project;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const reduce = useReducedMotion();
  const canGrow = !!project.image; // only enlarge when there's a real image
  const grown = open && canGrow;

  return (
    <motion.li
      onHoverStart={onOpen}
      onHoverEnd={onClose}
      className="group border-b border-ink/12"
    >
      {/* The whole row is the link — the title alone is a small target for a
          row this tall. Focus drives the same expand that hover does. */}
      <Link
        href={project.href}
        onFocus={onOpen}
        onBlur={onClose}
        className="flex items-start gap-5 py-6 md:gap-8 md:py-8"
      >
        <span className="hidden w-6 shrink-0 pt-1 font-mono text-xs tabular-nums text-ink/70 transition-colors duration-300 group-hover:text-cobalt-ink group-focus:text-cobalt-ink sm:block">
          {project.index}
        </span>

        {/* Thumbnail — grows only when a real image exists */}
        <motion.div
          initial={false}
          animate={
            reduce || !canGrow
              ? undefined
              : { width: grown ? 300 : 76, height: grown ? 188 : 56 }
          }
          transition={{ duration: 0.5, ease: EASE }}
          className={`relative shrink-0 overflow-hidden rounded-lg border border-ink/10 ${
            reduce || !canGrow ? "h-14 w-[76px]" : ""
          }`}
        >
          <Thumb project={project} />
        </motion.div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-4">
            <h3 className="font-serif text-[clamp(1.5rem,4vw,3rem)] font-normal leading-[1.02] tracking-[-0.015em] text-ink transition-colors duration-300 group-hover:text-cobalt-ink group-focus:text-cobalt-ink">
              {project.title}
            </h3>
          </div>

          <p className="mt-2 max-w-xl font-sans text-sm leading-relaxed text-ink/70">
            {project.description}
          </p>

          {/* Mobile: always visible (no hover to depend on) */}
          <div className="md:hidden">
            <ExpandedContext project={project} />
          </div>

          {/* Desktop: reveal on hover/focus */}
          <div className="hidden md:block">
            {reduce ? (
              <ExpandedContext project={project} />
            ) : (
              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className="overflow-hidden"
                  >
                    <ExpandedContext project={project} />
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        </div>
      </Link>
    </motion.li>
  );
}

export default function CaseStudies() {
  const [active, setActive] = useState<number | null>(null);
  const liveCount = PROJECTS.filter((p) => !isPlaceholder(p)).length;

  return (
    <section id="work" className="bg-canvas text-ink">
      <div className="mx-auto w-full max-w-7xl px-6 py-24 md:py-32">
        <div className="flex items-baseline justify-between">
          <h2 className="font-serif text-[clamp(1.75rem,3.4vw,2.75rem)] font-normal leading-none tracking-[-0.01em]">
            Selected work
          </h2>
          {/* Count only what exists. "· 4 planned" told a recruiter the
              portfolio was 80% empty. */}
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/70">
            {String(liveCount).padStart(2, "0")} live
          </span>
        </div>

        <DrawRule className="mt-14" />

        <ul>
          {PROJECTS.map((project, i) =>
            isPlaceholder(project) ? (
              <ComingSoonRow key={project.slug} project={project} />
            ) : (
              <ProjectRow
                key={project.slug}
                project={project}
                open={active === i}
                onOpen={() => setActive(i)}
                onClose={() => setActive((cur) => (cur === i ? null : cur))}
              />
            ),
          )}
        </ul>

        <p className="mt-10 max-w-md font-serif text-[15px] italic leading-relaxed text-ink/70">
          The rest are still in the studio — I&apos;d rather show them finished
          than fast.
        </p>
      </div>
    </section>
  );
}
