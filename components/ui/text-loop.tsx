"use client";

import { useId, useMemo, useRef, useState } from "react";
import {
  useAnimationFrame,
  useIsomorphicLayoutEffect,
  useReducedMotion,
} from "motion/react";

const VIEW_W = 1200;
const VIEW_H = 200;
const MID = VIEW_H / 2;
const AMPLITUDE = 26;
// The path runs past both edges so the point where the loop rejoins itself is
// always off-screen.
const OVERHANG = 400;
const HALF = 200;

// A shallow sine-ish wave: one quadratic to establish the curve, then mirrored
// segments via T. Shallow on purpose — this sits next to the award block, and a
// deep curve would compete with it.
function buildWave() {
  const start = -OVERHANG;
  const end = VIEW_W + OVERHANG;
  let d = `M ${start} ${MID} Q ${start + HALF / 2} ${MID - AMPLITUDE} ${start + HALF} ${MID}`;
  for (let x = start + HALF; x < end; x += HALF) {
    d += ` T ${x + HALF} ${MID}`;
  }
  return d;
}

const WAVE = buildWave();

const TYPE = "font-mono text-[34px] tracking-[2px]";

// Module scope, not inlined in render: React 19 rejects component declarations
// inside a render pass, and mapping over an array of refs trips its refs rule.
function CurvedText({
  ref,
  href,
  children,
  fitLength,
}: {
  ref: React.Ref<SVGTextPathElement>;
  href: string;
  children: string;
  fitLength?: number;
}) {
  return (
    <text
      aria-hidden
      fill="currentColor"
      dominantBaseline="central"
      className={`select-none ${TYPE}`}
    >
      <textPath
        ref={ref}
        href={href}
        startOffset={0}
        textLength={fitLength}
        lengthAdjust="spacing"
      >
        {children}
      </textPath>
    </text>
  );
}

/**
 * Text repeating along a curve, scrolling forever.
 *
 * Two <textPath> copies sit exactly one path-length apart, and each is stretched
 * to span the path precisely (textLength), so as one leaves the other arrives
 * and the join never shows.
 *
 * Fails safe the same way DrawRule does: the offsets only move inside the frame
 * callback, so with JS off or reduced motion on, the text renders statically
 * along the curve rather than disappearing.
 */
export function TextLoop({
  text,
  separator = "·",
  speed = 34,
  className,
}: {
  text: string;
  separator?: string;
  // Path units per second.
  speed?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const pathRef = useRef<SVGPathElement>(null);
  const measureRef = useRef<SVGTextElement>(null);
  const headRef = useRef<SVGTextPathElement>(null);
  const tailRef = useRef<SVGTextPathElement>(null);

  const [metrics, setMetrics] = useState({ length: 0, reps: 1 });

  // useId returns a colon-wrapped string, which is not a valid CSS selector.
  const pathId = `wave-${useId().replace(/:/g, "")}`;

  const unit = useMemo(
    () => `${text.toUpperCase()}  ${separator}  `,
    [text, separator],
  );

  useIsomorphicLayoutEffect(() => {
    const pathEl = pathRef.current;
    const measureEl = measureRef.current;
    if (!pathEl || !measureEl) return;

    let cancelled = false;

    const measure = () => {
      if (cancelled) return;
      const length = pathEl.getTotalLength();
      const unitWidth = measureEl.getComputedTextLength();
      if (!length || !unitWidth) return;

      const reps = Math.max(1, Math.round(length / unitWidth));
      setMetrics((prev) =>
        prev.length === length && prev.reps === reps ? prev : { length, reps },
      );
    };

    measure();
    // Martian Mono is a webfont, so the first measurement can land before it
    // swaps in and under-count the repetitions.
    document.fonts?.ready.then(measure).catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [unit]);

  useAnimationFrame((t) => {
    const { length } = metrics;
    const head = headRef.current;
    const tail = tailRef.current;
    if (reduce || !length || !head || !tail) return;

    const offset = ((t / 1000) * speed) % length;
    head.setAttribute("startOffset", String(offset));
    tail.setAttribute("startOffset", String(offset - length));
  });

  const loopText = unit.repeat(metrics.reps);
  // Only pin the length once measured — before that it would squash the single
  // unrepeated copy across the whole curve.
  const fitLength = metrics.length || undefined;

  return (
    <div className={`overflow-hidden ${className ?? ""}`}>
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        // `slice` keeps the type at a readable size on narrow screens by
        // cropping the curve instead of scaling the whole thing down.
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label={text}
        className="block h-[clamp(88px,14vw,168px)] w-full text-cobalt-ink"
      >
        <path ref={pathRef} id={pathId} d={WAVE} fill="none" />

        <text ref={measureRef} aria-hidden className={`invisible ${TYPE}`}>
          {unit}
        </text>

        <CurvedText ref={headRef} href={`#${pathId}`} fitLength={fitLength}>
          {loopText}
        </CurvedText>
        <CurvedText ref={tailRef} href={`#${pathId}`} fitLength={fitLength}>
          {loopText}
        </CurvedText>
      </svg>
    </div>
  );
}
