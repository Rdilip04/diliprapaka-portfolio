"use client";

import { motion, useReducedMotion } from "motion/react";
import TiltedCard from "@/components/ui/tilted-card";
import { DrawRule } from "@/components/ui/draw-rule";

const EASE = [0.22, 1, 0.36, 1] as const;

const BLOCKS = [
  {
    heading: "Background",
    body: "MSc UX Design, Birmingham City University. Previously a UI/UX designer at Rapshift, working on real products before specialising in complex, data-rich digital environments.",
  },
  {
    heading: "Beyond work",
    body: "I enjoy walking through cities, trying new places, and understanding how things work, whether it's a product, a system, or the people around me.",
  },
];

export default function About() {
  const reduce = useReducedMotion();

  // `data-reveal` is the hook globals.css uses to force these visible wherever
  // nothing is driving the animation — without it Motion's serialised
  // `opacity: 0` ships the whole section blank to a scripting-off client.
  const reveal = (delay: number) =>
    reduce
      ? { "data-reveal": "", initial: { opacity: 0 }, whileInView: { opacity: 1 } }
      : {
          "data-reveal": "",
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          transition: { duration: 0.7, ease: EASE, delay },
        };

  return (
    <section id="about" className="border-t border-ink/10 bg-canvas text-ink">
      <div className="mx-auto w-full max-w-7xl px-6 py-24 md:py-32">
        {/* Two columns from lg, not md. At 768 the label column is ~160px but
            the portrait card is a fixed 220px, so it overlapped the statement
            and the "Background" label on tablets. At 1024 the column is 220px
            and the card fits; below that the section stacks like on phones. */}
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Label column */}
          <motion.div
            {...reveal(0)}
            viewport={{ once: true, margin: "-12%" }}
            className="lg:col-span-3"
          >
            <h2 className="font-display text-title font-medium tracking-[-0.01em]">
              About
            </h2>
            {/* The one place the accent appears as a mark rather than as text.
                `w-fit` keeps the wrapper the size of the card, and the block is
                offset down-right into the column gap — offsetting it left would
                push past the page padding and put 375px into horizontal scroll.

                Held at /35 rather than solid: at full strength the accent is a
                large saturated field sitting directly against a photograph, and
                it vibrated against the skin and jacket tones instead of framing
                them. The alpha rides the theme-aware token, so it lands as soft
                periwinkle on canvas and muted indigo on the dark surface with no
                `dark:` class — same mark, both themes, one declaration. */}
            <div className="relative mt-8 w-fit">
              <div
                aria-hidden
                className="absolute -bottom-4 -right-4 h-[280px] w-[220px] rounded-lg bg-cobalt/35"
              />
              {/* z-10, or the block above paints over the photo: an absolutely
                  positioned element outranks static content in the painting
                  order regardless of source order. */}
              <div className="relative z-10">
                <TiltedCard
                  imageSrc="/dilip-about.jpg"
                  altText="Dilip Rapaka, product designer"
                  captionText="Dilip Rapaka"
                  width="220px"
                  height="280px"
                  rotateAmplitude={8}
                  scaleOnHover={1.03}
                />
              </div>
            </div>
          </motion.div>

          {/* Content column. Starts at column 4, not 5 — leaving column 4 empty
              put 137px of dead space across the middle of the section and made
              the two halves read as unrelated. */}
          <div className="lg:col-span-9 lg:col-start-4">
            <motion.p
              {...reveal(0.05)}
              viewport={{ once: true, margin: "-12%" }}
              className="max-w-3xl text-pretty font-display text-subhead font-medium leading-[1.28] tracking-[-0.01em] text-ink"
            >
              I craft{" "}
              <span className="text-cobalt-ink">
                simple, thoughtful digital experiences
              </span>{" "}
              with a strong focus on clarity, usability, and long-term value
              across mobile and web.
            </motion.p>

            <DrawRule className="mt-20" />

            <dl>
              {BLOCKS.map((block, i) => (
                <motion.div
                  key={block.heading}
                  {...reveal(0.1 + i * 0.08)}
                  viewport={{ once: true, margin: "-8%" }}
                  className="grid gap-2 py-8 md:grid-cols-[7rem_1fr] md:gap-6"
                >
                  {/* Sentence-case label, not a mono eyebrow: mono caps are
                      kept to three on the page (Hero, Selected work count,
                      Contact). Medium weight at /70 against the /80 body keeps
                      the term a distinct level without the extra typeface. */}
                  <dt className="font-sans text-sm font-medium leading-relaxed text-ink/70">
                    {block.heading}
                  </dt>
                  <dd className="max-w-xl font-sans text-base leading-relaxed text-ink/80">
                    {block.body}
                  </dd>
                </motion.div>
              ))}
            </dl>

            {/* End of the reading path: the eye finishes "Beyond work" and the
                next thing it meets is the action. Sending it back across to the
                left rail was avoidable friction. */}
            <motion.div
              {...reveal(0.3)}
              viewport={{ once: true, margin: "-8%" }}
            >
              <a
                href="/Dilip-Rapaka-CV.pdf"
                download
                className="mt-8 inline-flex min-h-11 w-fit items-center gap-2 font-sans text-sm font-medium text-cobalt-ink transition-opacity hover:opacity-70"
              >
                Download Resume (PDF)
                <span aria-hidden="true">↓</span>
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
