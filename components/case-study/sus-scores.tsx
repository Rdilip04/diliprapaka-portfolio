"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { animate, stagger } from "animejs";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const BENCHMARK = 68;

const SCORES = [
  { label: "Participant 1", value: 90 },
  { label: "Participant 2", value: 77.5 },
  { label: "Participant 3", value: 95 },
  { label: "Participant 4", value: 65 },
  { label: "Participant 5", value: 95 },
];

const AVERAGE = 84.5;

function Row({
  label,
  value,
  emphasis = false,
}: {
  label: string;
  value: number;
  emphasis?: boolean;
}) {
  return (
    <li className="grid grid-cols-[7.5rem_1fr_3.5rem] items-center gap-4 py-2.5">
      <span
        className={`font-mono text-[11px] uppercase tracking-[0.12em] ${
          emphasis ? "text-ink" : "text-ink/70"
        }`}
      >
        {label}
      </span>
      {/* The average is distinguished by bar height, not by a lighter fill:
          dimming it to /70 measured 2.80:1 in dark mode, under the 3:1 floor
          for a data mark. Every bar now runs at full accent in both themes. */}
      <span
        aria-hidden
        className={`relative block rounded-full bg-ink/10 ${
          emphasis ? "h-3" : "h-2"
        }`}
      >
        <span
          data-sus-bar
          className="absolute inset-y-0 left-0 origin-left rounded-full bg-cobalt"
          style={{ width: `${value}%` }}
        />
      </span>
      <span
        className={`text-right font-mono text-sm tabular-nums ${
          emphasis ? "font-medium text-ink" : "text-ink/75"
        }`}
      >
        {value}
      </span>
    </li>
  );
}

/**
 * The score is printed on every row, so the bars are a second encoding rather
 * than the only one — the table still reads correctly without colour.
 */
export function SusScores() {
  const ref = useRef<HTMLDivElement>(null);

  // The bars fill in sequence when the card is reached — the scores arrive as
  // a set, which is how they were gathered. Widths stay in the inline style, so
  // scaleX only ever animates the reveal, never the value.
  useIsoLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const bars = Array.from(
      root.querySelectorAll<HTMLElement>("[data-sus-bar]"),
    );
    if (bars.length === 0) return;
    bars.forEach((bar) => (bar.style.transform = "scaleX(0)"));

    const observer = new IntersectionObserver(
      ([entry], obs) => {
        if (!entry.isIntersecting) return;
        obs.disconnect();
        animate(bars, {
          scaleX: [0, 1],
          duration: 1000,
          delay: stagger(90),
          ease: "outQuart",
        });
      },
      { threshold: 0.25 },
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="rounded-lg border border-ink/12 p-6 md:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/70">
          System Usability Scale — Round 2
        </h3>
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink/70">
          Benchmark {BENCHMARK}
        </p>
      </div>

      <ul className="mt-6">
        {SCORES.map((score) => (
          <Row key={score.label} label={score.label} value={score.value} />
        ))}
        <li className="mt-2 border-t border-ink/12 pt-2">
          <ul>
            <Row label="Average" value={AVERAGE} emphasis />
          </ul>
        </li>
      </ul>

      <p className="mt-5 max-w-[58ch] font-sans text-sm leading-relaxed text-ink/70">
        An average of {AVERAGE} against a {BENCHMARK}-point benchmark. One
        participant scored 65 — below it — so the app still had gaps for some
        users. I don&apos;t have the qualitative notes from that session to know
        exactly why.
      </p>
    </div>
  );
}
