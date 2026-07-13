"use client";

import { PROJECTS, type Project } from "@/lib/projects";
import { PixelCanvas } from "@/components/ui/pixel-canvas";
import ScrollStack, { ScrollStackItem } from "@/components/ui/scroll-stack";

function ProjectCard({ project, dark }: { project: Project; dark: boolean }) {
  const accent = dark ? "text-cosmic" : "text-cosmic-ink";

  return (
    <article
      className={`relative overflow-hidden rounded-3xl border shadow-2xl ${
        dark ? "border-white/10 bg-ink" : "border-ink/10 bg-paper"
      }`}
    >
      <div className="grid gap-10 p-8 md:min-h-[56vh] md:grid-cols-2 md:items-center md:p-14">
        <div>
          <span className={`font-mono text-sm font-medium tracking-wider ${accent}`}>
            {project.index}
          </span>
          <h3
              className={`font-display text-5xl font-medium tracking-tight md:text-6xl ${
                dark ? "text-paper" : "text-ink"
              }`}
            >
              {project.title}
            </h3>
            <p
              className={`mt-6 max-w-md text-lg leading-relaxed ${
                dark ? "text-paper/70" : "text-ink/70"
              }`}
            >
              {project.description}
            </p>
            <p
              className={`mt-5 max-w-md text-sm leading-relaxed ${
                dark ? "text-paper/60" : "text-ink/60"
              }`}
            >
              <span className={`font-semibold ${accent}`}>Why it&apos;s here — </span>
              {project.why}
            </p>

            <ul className="mt-7 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <li
                  key={tag}
                  className={`rounded-full border px-3 py-1 text-xs font-medium ${
                    dark ? "border-white/15 text-paper/70" : "border-ink/10 text-ink/60"
                  }`}
                >
                  {tag}
                </li>
              ))}
            </ul>

            {/* Glassmorphic CTA with the nav's pixel-hover theme */}
            <a
              href={project.href}
              className={`group/btn relative mt-9 inline-flex items-center gap-2 overflow-hidden rounded-full border px-6 py-3 text-sm font-medium backdrop-blur-md transition-colors ${
                dark
                  ? "border-white/20 bg-white/10 text-paper hover:border-white/35"
                  : "border-ink/15 bg-ink/[0.04] text-ink hover:border-ink/30"
              }`}
            >
              <PixelCanvas gap={4} speed={45} colors={["#ff8a5c", "#ff6b35", "#c2410c"]} />
              <span className="relative z-10">Read case study</span>
              <span
                aria-hidden
                className="relative z-10 transition-transform duration-300 group-hover/btn:translate-x-1"
              >
                →
              </span>
            </a>
          </div>

          {/* Visual placeholder (swap for real screenshots later) */}
          <div
            className="relative hidden aspect-[4/3] overflow-hidden rounded-2xl md:block"
            style={{
              background: dark
                ? "linear-gradient(135deg, #ff6b35 0%, #c2410c 65%, #0a0a0a 100%)"
                : "linear-gradient(135deg, #14181f 0%, #c2410c 70%, #ff6b35 100%)",
            }}
          >
            <span className="absolute -bottom-6 -left-2 font-display text-[12rem] font-medium leading-none text-paper/15">
              {project.index}
            </span>
            <span className="absolute bottom-6 right-6 font-display text-2xl font-medium text-paper">
              {project.title}
            </span>
          </div>
        </div>
      </article>
  );
}

export default function SelectedWork() {
  return (
    <section id="work" className="relative bg-paper pt-24">
      <div className="sticky top-24 z-20 mx-auto flex max-w-5xl items-baseline justify-between px-6">
        <h2 className="font-display text-3xl font-medium tracking-tight text-ink">
          Selected work
        </h2>
        <span className="font-mono text-sm text-ink/40">
          {String(PROJECTS.length).padStart(2, "0")} projects
        </span>
      </div>

      <ScrollStack
        useWindowScroll
        className="mx-auto max-w-5xl px-6"
        itemDistance={40}
        itemStackDistance={30}
        stackPosition="22%"
        baseScale={0.86}
      >
        {PROJECTS.map((project, i) => (
          <ScrollStackItem key={project.slug}>
            <ProjectCard project={project} dark={i % 2 === 0} />
          </ScrollStackItem>
        ))}
      </ScrollStack>
    </section>
  );
}
