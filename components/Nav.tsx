"use client";

import { useEffect, useState } from "react";
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

function Clock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: "Europe/London",
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    // Recedes behind the nav links as secondary, ambient information. Held at
    // ink/70 (6.39:1 on paper) — the hierarchy comes from darkening the links,
    // not from dimming this below the AA floor.
    <span className="inline-flex items-center gap-2 tabular-nums text-ink/70">
      <span className="h-1 w-1 rounded-full bg-cobalt" />
      LDN {time ?? "--:--:--"}
    </span>
  );
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

  // Lock scroll and close on Escape while the mobile menu is open.
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const active = useActiveSection();

  // The section anchors only resolve on the home page. From a case-study route
  // they need the leading "/" so they point back at the right document.
  const pathname = usePathname();
  const onHome = pathname === "/";
  const hrefFor = (hash: string) => (onHome ? hash : `/${hash}`);

  // Editorial hero is light, so the bar reads dark from the top. Links sit at
  // /85 (10.8:1) so the /70 clock reads as clearly secondary beside them.
  const wordmark = "text-ink";
  const controls = "text-ink/85";

  return (
    <motion.header
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
        className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4"
      >
        <Link
          href={onHome ? "#main" : "/"}
          className={`relative z-10 -my-2 inline-flex min-h-11 items-center py-2 font-sans text-lg font-bold uppercase tracking-[0.22em] transition-colors ${wordmark}`}
        >
          DUX
        </Link>

        {/* Right-hand group. The toggle sits outside the desktop-only block so
            there is exactly one switch in the DOM at every breakpoint, but
            inside this wrapper so it stays beside the clock instead of being
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
                      // `text-cobalt` is the same token as the clock's dot.
                      className={isActive ? "text-cobalt" : undefined}
                      accent={isActive ? "text-cobalt" : "text-cobalt-ink"}
                      // "location" (not "page") — same document, different section.
                      ariaCurrent={isActive ? "location" : undefined}
                    />
                  </li>
                );
              })}
            </ul>
            <Clock />
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

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-0 top-full border-b border-ink/10 bg-paper/95 backdrop-blur-md sm:hidden"
          >
            <ul className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-4">
              {LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={hrefFor(link.href)}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between py-3 font-sans text-2xl font-medium text-ink"
                  >
                    {link.label}
                    <span aria-hidden className="text-cobalt-ink">
                      →
                    </span>
                  </Link>
                </li>
              ))}
              <li className="mt-2 border-t border-ink/10 pt-4">
                <a
                  href={`mailto:${EMAIL}`}
                  onClick={() => setOpen(false)}
                  className="font-mono text-label uppercase tracking-[0.16em] text-ink/70"
                >
                  {EMAIL}
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
