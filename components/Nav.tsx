"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { SwapLink } from "@/components/ui/swap-link";
import ThemeToggle from "@/components/ThemeToggle";

const EMAIL = "dilipuxdesigner04@gmail.com";

const LINKS = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const SECTION_IDS = LINKS.map((l) => l.href.slice(1));

const LINKEDIN = "https://www.linkedin.com/in/diliprapaka";
const EASE = [0.22, 1, 0.36, 1] as const;

/* The panel arrives behind two coloured layers rather than on its own — the
   layers land first, at a 70ms offset, so the reveal reads as depth instead of
   a single sliding sheet. Both are tokens, so the whole thing re-maps in dark
   mode without a `dark:` class. Cobalt is used sparingly on this site; here it
   is in flight for ~400ms and never at rest, which is why a full-bleed band of
   it is affordable. */
const PRELAYERS = ["bg-mist", "bg-cobalt/25"];

/* `createPortal` reads `document` during render, so it cannot run on the
   server. Same mechanism ThemeToggle uses, and for the same reason: the value
   lives outside React, and React 19 rejects a synchronous setState in an
   effect. The menu is closed on first paint either way, so nothing is lost. */
const subscribeNoop = () => () => {};
const useMounted = () =>
  useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );

/**
 * Which section is currently under the reader.
 *
 * This is a single page of hash anchors, not separate routes — `usePathname()`
 * would return "/" forever and Next's router does not track the hash. Observing
 * the sections themselves also beats reading `location.hash`, because it stays
 * correct while the reader scrolls rather than only after a click.
 */
function useActiveSection() {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Collapse the root to a band across the middle of the viewport, so
        // "active" means "the section you are actually reading" rather than
        // "any section touching the screen".
        const onScreen = entries.filter((e) => e.isIntersecting);
        if (onScreen.length > 0) {
          setActive(onScreen[0].target.id);
        } else if (entries.some((e) => e.boundingClientRect.top > 0)) {
          // Scrolled back above the first section — nothing is active.
          setActive(null);
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return active;
}

export default function Nav() {
  const reduceMotion = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const panelRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const mounted = useMounted();

  // Lock scroll, close on Escape, and keep the tab ring inside the panel while
  // it is open. A full-screen menu that leaks focus back to the page behind it
  // strands a keyboard user on links they cannot see.
  useEffect(() => {
    if (!open) return;
    openerRef.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";

    const focusables = () =>
      Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );

    focusables()[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) return;
      const [first, last] = [items[0], items[items.length - 1]];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      // Send focus back where it came from, or it lands on <body>.
      openerRef.current?.focus();
    };
  }, [open]);

  const active = useActiveSection();

  // The section anchors only resolve on the home page. From a case-study route
  // they need the leading "/" so they point back at the right document.
  const pathname = usePathname();
  const onHome = pathname === "/";
  const hrefFor = (hash: string) => (onHome ? hash : `/${hash}`);

  // Editorial hero is light, so the bar reads dark from the top. Links sit at
  // /85 (10.8:1).
  const wordmark = "text-ink";
  const controls = "text-ink/85";

  return (
    <motion.header
      data-reveal
      initial={reduceMotion ? false : { y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
        delay: reduceMotion ? 0 : 0.2,
      }}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? "border-b border-ink/10 bg-paper/85 backdrop-blur-md" : ""
      }`}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded-lg focus:bg-paper focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-ink"
      >
        Skip to content
      </a>

      <nav
        aria-label="Primary"
        className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-4"
      >
        <Link
          href={onHome ? "#main" : "/"}
          className={`relative z-10 -my-2 inline-flex min-h-11 items-center py-2 font-sans text-lg font-bold uppercase tracking-[0.22em] transition-colors ${wordmark}`}
        >
          DUX
        </Link>

        {/* Right-hand group. The toggle sits outside the desktop-only block so
            there is exactly one switch in the DOM at every breakpoint, but
            inside this wrapper so it stays beside the links instead of being
            flung to the window edge by the header's justify-between. */}
        <div className="ml-auto flex items-center gap-6">
          <div
            className={`hidden items-center gap-7 font-mono text-label uppercase tracking-[0.14em] transition-colors sm:flex ${controls}`}
          >
            <ul className="flex items-center gap-7">
              {LINKS.map((link) => {
                const isActive = active === link.href.slice(1);
                return (
                  <li key={link.href}>
                    <SwapLink
                      label={link.label}
                      href={hrefFor(link.href)}
                      className={isActive ? "text-cobalt" : undefined}
                      accent={isActive ? "text-cobalt" : "text-cobalt-ink"}
                      // "location" (not "page") — same document, different section.
                      ariaCurrent={isActive ? "location" : undefined}
                    />
                  </li>
                );
              })}
            </ul>
          </div>

          <ThemeToggle />
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className={`relative z-10 -mr-2 flex h-11 w-11 items-center justify-center sm:hidden ${
            open ? "text-ink" : wordmark
          }`}
        >
          <span className="relative block h-3 w-6">
            <span
              className={`absolute left-0 h-[2px] w-6 bg-current transition-all duration-300 ${
                open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute bottom-0 left-0 h-[2px] w-6 bg-current transition-all duration-300 ${
                open ? "bottom-1/2 translate-y-1/2 -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </nav>

      {/* Mobile menu, portalled to <body>.
          ⚠️ It cannot live inside <header>. Once the page scrolls, the header
          gains `backdrop-blur-md`, and a backdrop-filter ancestor becomes the
          containing block for `position: fixed` — which collapsed the panel to
          the height of the bar (measured: 390×152 instead of 390×844) and left
          the page showing through. Scroll-dependent, so it looked fine on every
          test that opened the menu at the top. The portal puts the panel beyond
          the reach of any header style. `z-40` keeps it under the bar's `z-50`,
          so the close button and theme toggle stay usable on top of it. */}
      {mounted &&
        createPortal(
          <AnimatePresence>
          {open && (
            <div className="fixed inset-0 z-40 sm:hidden">
            {/* Coloured layers, arriving first and offset from each other. */}
            {PRELAYERS.map((surface, i) => (
              <motion.div
                key={surface}
                aria-hidden
                initial={reduceMotion ? { opacity: 0 } : { x: "100%" }}
                animate={reduceMotion ? { opacity: 1 } : { x: 0 }}
                exit={reduceMotion ? { opacity: 0 } : { x: "100%" }}
                transition={{
                  duration: 0.5,
                  ease: EASE,
                  delay: reduceMotion ? 0 : i * 0.07,
                }}
                className={`absolute inset-0 ${surface}`}
              />
            ))}

            <motion.div
              id="mobile-menu"
              ref={panelRef}
              initial={reduceMotion ? { opacity: 0 } : { x: "100%" }}
              animate={reduceMotion ? { opacity: 1 } : { x: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { x: "100%" }}
              transition={{
                duration: 0.55,
                ease: EASE,
                delay: reduceMotion ? 0 : PRELAYERS.length * 0.07,
              }}
              className="absolute inset-0 flex flex-col overflow-y-auto bg-paper px-6 pb-10 pt-28"
            >
              <ul className="flex flex-col">
                {LINKS.map((link, i) => {
                  const isActive = active === link.href.slice(1);
                  // The label rises out of a masked box, so it enters from
                  // behind the line above rather than simply fading.
                  return (
                    <li key={link.href} className="overflow-hidden py-1.5">
                      <motion.div
                        initial={reduceMotion ? { opacity: 0 } : { y: "115%" }}
                        animate={reduceMotion ? { opacity: 1 } : { y: 0 }}
                        transition={{
                          duration: 0.7,
                          ease: EASE,
                          delay: reduceMotion ? 0 : 0.28 + i * 0.09,
                        }}
                      >
                        <Link
                          href={hrefFor(link.href)}
                          onClick={() => setOpen(false)}
                          aria-current={isActive ? "location" : undefined}
                          className="flex items-baseline gap-4 font-serif text-hero font-normal leading-[1.02] tracking-[-0.03em] text-ink"
                        >
                          <span
                            aria-hidden
                            className="font-mono text-label tabular-nums text-cobalt-ink"
                          >
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          {link.label}
                        </Link>
                      </motion.div>
                    </li>
                  );
                })}
              </ul>

              <motion.div
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.55,
                  ease: EASE,
                  delay: reduceMotion ? 0 : 0.55,
                }}
                className="mt-auto flex flex-col gap-4 border-t border-ink/12 pt-8"
              >
                <span className="font-mono text-label uppercase tracking-[0.16em] text-ink/70">
                  Elsewhere
                </span>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                  <a
                    href={LINKEDIN}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => setOpen(false)}
                    className="inline-flex min-h-11 items-center font-sans text-sm text-ink/85"
                  >
                    LinkedIn ↗
                  </a>
                  <a
                    href="/Dilip-Rapaka-CV.pdf"
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => setOpen(false)}
                    className="inline-flex min-h-11 items-center font-sans text-sm text-ink/85"
                  >
                    CV / Résumé ↗
                  </a>
                </div>
                <a
                  href={`mailto:${EMAIL}`}
                  onClick={() => setOpen(false)}
                  className="inline-flex min-h-11 items-center font-mono text-label uppercase tracking-[0.14em] text-cobalt-ink"
                >
                  {EMAIL}
                </a>
              </motion.div>
            </motion.div>
            </div>
          )}
          </AnimatePresence>,
          document.body,
        )}
    </motion.header>
  );
}
