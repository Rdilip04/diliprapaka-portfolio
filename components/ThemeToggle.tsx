"use client";

import { useSyncExternalStore } from "react";

// The theme lives on <html>, outside React. Subscribing to it beats mirroring
// it into state: no setState-in-effect (which React 19 flags), and the button
// stays correct even if the class is changed by something other than this
// component.
//
// Deliberately NOT persisted. Light is the primary design, so every load starts
// there; dark is a per-visit preference the reader opts into.
const subscribe = (onChange: () => void) => {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
};

const getSnapshot = () => document.documentElement.classList.contains("dark");

// Always light on the server, and nothing restores dark on the client.
const getServerSnapshot = () => false;

export default function ThemeToggle() {
  const isDark = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const toggle = () => {
    const root = document.documentElement;

    // Chrome does not re-resolve var() for a property that is mid-transition,
    // so every element carrying `transition-colors` kept its OLD theme's colour
    // permanently: 15 of them, including "Let's talk" at 1:1 contrast —
    // invisible on the dark hero. Killing transitions across the swap fixes it,
    // and matches the intent already documented for the theme change: instant.
    //
    // Injected rather than a class in globals.css: a `.theme-swapping` rule
    // there never won the cascade against Tailwind's utilities (verified — the
    // transition-duration stayed 0.15s with the class applied).
    const style = document.createElement("style");
    style.textContent = "*,*::before,*::after{transition:none !important}";
    document.head.appendChild(style);

    root.classList.toggle("dark", !isDark);

    // Force a synchronous style flush so the colour change commits while
    // transitions are still suppressed, then restore them.
    void document.body.offsetHeight;
    requestAnimationFrame(() =>
      requestAnimationFrame(() => style.remove()),
    );
  };

  return (
    <button
      type="button"
      onClick={toggle}
      role="switch"
      aria-checked={isDark}
      // Names the outcome, not the current state, so it reads as an action.
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className="relative grid h-11 w-11 place-items-center rounded-lg border border-ink/12 text-ink transition-colors duration-200 hover:border-cobalt/40 hover:text-cobalt-ink active:scale-95 motion-reduce:transition-none motion-reduce:active:scale-100"
    >
      {/* Both icons are always mounted and crossfaded, so the box never
          reflows and the swap reads as one continuous motion. */}
      <Icon visible={!isDark} label="sun">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </Icon>
      <Icon visible={isDark} label="moon">
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
      </Icon>
    </button>
  );
}

function Icon({
  visible,
  label,
  children,
}: {
  visible: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <svg
      aria-hidden="true"
      data-icon={label}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`absolute h-[18px] w-[18px] transition-all duration-200 ease-out motion-reduce:transition-none ${
        visible ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"
      }`}
    >
      {children}
    </svg>
  );
}
