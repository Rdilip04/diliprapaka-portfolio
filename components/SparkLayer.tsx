"use client";

import { useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import { useReducedMotion } from "motion/react";
import ClickSpark from "@/components/ui/click-spark";

// Same subscription ThemeToggle uses: the theme lives on <html>, outside React,
// and mirroring it into state would be a setState-in-effect that React 19
// flags. Duplicated rather than extracted so ThemeToggle — which carries the
// documented transition-suppression fix — is not touched.
const subscribe = (onChange: () => void) => {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
};

const getSnapshot = () => document.documentElement.classList.contains("dark");
const getServerSnapshot = () => false;

// Canvas takes a paint value, not a CSS variable, so `var(--color-cobalt)`
// cannot be handed to strokeStyle. These mirror that token's two values —
// keep them in step with `@theme` and `.dark` in globals.css.
const COBALT = { light: "#2f2be6", dark: "#6f6bff" } as const;

/**
 * Click sparks, site-wide.
 *
 * Renders children untouched under reduced motion, so the effect is opt-out
 * the same way every other piece of motion on the site is.
 */
export default function SparkLayer({ children }: { children: ReactNode }) {
  const isDark = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const reduce = useReducedMotion();

  if (reduce) return <>{children}</>;

  return (
    <div data-spark-root>
      <ClickSpark
        sparkColor={isDark ? COBALT.dark : COBALT.light}
        sparkSize={11}
        sparkRadius={18}
        sparkCount={8}
        duration={420}
      >
        {children}
      </ClickSpark>
    </div>
  );
}
