"use client";

import { Fragment, useRef } from "react";
import {
  animate,
  stagger,
  useIsomorphicLayoutEffect,
  useReducedMotion,
} from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Display type that rises into view a word at a time, each word masked by its
 * own clipping box.
 *
 * This is the site's one signature gesture. It exists because the page is
 * legitimately text-heavy — three images on the whole homepage — so the
 * typography carries the motion rather than decoration being added around it.
 * It replaces the generic fade on the elements it is applied to.
 *
 * Fails safe exactly like `DrawRule`: the words are only pushed out of frame
 * *inside* the effect, so with JS disabled, or reduced motion on, the heading
 * renders as ordinary static text.
 */
export function WordRise({ text }: { text: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = ref.current;
    if (!root || reduce) return;

    const words = [...root.querySelectorAll<HTMLElement>("[data-word]")];
    if (!words.length) return;

    // 130%, not 110%: the mask carries bottom padding so descenders are not
    // clipped at rest, and a shorter offset lets the word peek into it.
    for (const w of words) w.style.transform = "translateY(130%)";

    const observer = new IntersectionObserver(
      ([entry], obs) => {
        if (!entry.isIntersecting) return;
        obs.disconnect();
        animate(
          words,
          { transform: ["translateY(130%)", "translateY(0%)"] },
          { duration: 0.7, delay: stagger(0.045), ease: EASE },
        );
      },
      { rootMargin: "0px 0px -12% 0px" },
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, [reduce]);

  const words = text.split(" ");

  return (
    <span ref={ref}>
      {words.map((word, i) => (
        <Fragment key={i}>
          {/* The mask clips its own word. Bottom padding keeps descenders
              (g, y, p) intact, since overflow-hidden would otherwise shave
              them off at rest. */}
          <span className="inline-block overflow-hidden pb-[0.12em] align-bottom">
            <span data-word className="inline-block will-change-transform">
              {word}
            </span>
          </span>
          {/* A real space, not a margin — without it the heading serialises as
              one run-on word for screen readers and for copy-paste. */}
          {i < words.length - 1 && " "}
        </Fragment>
      ))}
    </span>
  );
}
