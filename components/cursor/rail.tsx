"use client";

import { useEffect, useState } from "react";

/* The Cursor case study's left rail, shaped like the file list in Cursor's own
   sidebar: one row per section, the one you're reading lit up. Desktop only;
   below lg the page reads as one column and the rail would only crowd it.

   The active row follows the section nearest the top third of the screen. An
   IntersectionObserver rather than a scroll listener, so nothing runs while
   the page sits still. */
export function Rail({ items }: { items: { id: string; label: string }[] }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const els = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => Boolean(el));
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);

  return (
    <nav aria-label="Case study sections" className="ccs-rail hidden lg:block">
      <div className="sticky top-28 pb-10 pl-6 pt-20">
        <p className="font-mono text-label uppercase tracking-[0.16em] text-ink/70">
          cursor-case-study
        </p>
        <ol className="mt-4 flex flex-col">
          {items.map((item, i) => {
            const on = item.id === active;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={on ? "location" : undefined}
                  className={`flex min-h-8 items-center gap-3 rounded-lg px-3 font-sans text-sm transition-colors ${
                    on ? "bg-mist text-ink" : "text-ink/70 hover:text-ink"
                  }`}
                >
                  <span
                    className={`font-mono text-label tabular-nums ${on ? "text-cobalt-ink" : "text-ink/70"}`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {item.label}
                </a>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
