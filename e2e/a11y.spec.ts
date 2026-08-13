import { test, expect, type Page } from "@playwright/test";

const ROUTES = ["/", "/work/nextstep"] as const;

/** WCAG 2.2 AA target size (2.5.8). AAA / Apple HIG is 44. */
const MIN_TARGET = 24;

/**
 * Composite through a real canvas: Tailwind emits alpha colours as
 * `oklab(... / .7)`, and parsing that by regex silently yields garbage.
 */
const probe = () => {
  const paint = (...layers: string[]): [number, number, number] => {
    const c = document.createElement("canvas");
    c.width = c.height = 1;
    const ctx = c.getContext("2d")!;
    for (const l of layers) {
      ctx.fillStyle = l;
      ctx.fillRect(0, 0, 1, 1);
    }
    const px = ctx.getImageData(0, 0, 1, 1).data;
    return [px[0], px[1], px[2]];
  };
  const lum = (c: [number, number, number]) => {
    const ch = (v: number) => {
      const n = v / 255;
      return n <= 0.03928 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * ch(c[0]) + 0.7152 * ch(c[1]) + 0.0722 * ch(c[2]);
  };
  const surfaceOf = (el: Element) => {
    let n: Element | null = el;
    while (n && n !== document.documentElement) {
      const b = getComputedStyle(n).backgroundColor;
      if (b && b !== "rgba(0, 0, 0, 0)" && b !== "transparent") return b;
      n = n.parentElement;
    }
    return "rgb(255,255,255)";
  };

  const lowContrast: { text: string; ratio: number; needs: number }[] = [];
  const smallTargets: { label: string; w: number; h: number }[] = [];

  for (const el of document.querySelectorAll("body *")) {
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden") continue;
    const r = el.getBoundingClientRect();

    const ownText = [...el.childNodes].some(
      (n) => n.nodeType === 3 && (n.textContent ?? "").trim().length > 1,
    );
    if (ownText && r.height > 0 && parseFloat(cs.opacity) > 0.9) {
      const size = parseFloat(cs.fontSize);
      const bold = parseInt(cs.fontWeight, 10) >= 700;
      const large = size >= 24 || (bold && size >= 18.66);
      const surf = surfaceOf(el);
      const [hi, lo] = [
        lum(paint(surf, cs.color)),
        lum(paint(surf)),
      ].sort((a, b) => b - a);
      const ratio = (hi + 0.05) / (lo + 0.05);
      const needs = large ? 3 : 4.5;
      if (ratio < needs)
        lowContrast.push({
          text: (el.textContent ?? "").trim().slice(0, 30),
          ratio: +ratio.toFixed(2),
          needs,
        });
    }

    // sr-only skip links measure 1x1 until focused — not a real target.
    const srOnly = r.width <= 1 && r.height <= 1;
    if (
      el.matches("a,button,[role=switch]") &&
      r.width > 0 &&
      !srOnly &&
      (r.width < 24 || r.height < 24)
    ) {
      smallTargets.push({
        label: (el.textContent || el.getAttribute("aria-label") || "")
          .trim()
          .slice(0, 24),
        w: Math.round(r.width),
        h: Math.round(r.height),
      });
    }
  }

  const heads = [...document.querySelectorAll("h1,h2,h3,h4")].map((h) =>
    Number(h.tagName[1]),
  );
  let skips = 0;
  for (let i = 1; i < heads.length; i++) if (heads[i] - heads[i - 1] > 1) skips++;

  return {
    lowContrast,
    smallTargets,
    h1Count: heads.filter((h) => h === 1).length,
    skips,
    missingAlt: [...document.querySelectorAll("img")].filter(
      (i) => !i.getAttribute("alt"),
    ).length,
    overflow:
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
  };
};

/** Settle every scroll-triggered reveal so nothing is measured mid-animation. */
const settle = async (page: Page) => {
  await page.evaluate(async () => {
    const step = window.innerHeight / 2;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 80));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 250));
  });
};

test("re-resolves every themed colour when the theme flips", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("switch").first().click();
  await page.waitForTimeout(500);

  // In dark mode --color-ink is #e9ecf1 (oklab L ~0.94). Anything still
  // resolving near L 0.21 is holding the light theme's ink: Chrome does not
  // re-resolve var() for a property mid-transition, so `transition-colors`
  // elements keep the old colour unless the swap suppresses transitions.
  const stuck = await page.evaluate(() =>
    [...document.querySelectorAll("[class*='text-ink/']")]
      .filter((el) => {
        const L = getComputedStyle(el).color.match(/oklab\(([\d.]+)/)?.[1];
        return L !== undefined && Number(L) < 0.5;
      })
      .map((el) => (el.textContent || "").trim().slice(0, 24)),
  );

  expect(stuck, `holding light-mode ink in dark mode: ${JSON.stringify(stuck)}`).toEqual([]);
});

for (const route of ROUTES) {
  for (const [name, width, height] of [
    ["mobile", 390, 844],
    ["desktop", 1280, 900],
  ] as const) {
    for (const theme of ["light", "dark"] as const) {
      test(`${route} · ${name} · ${theme} meets WCAG AA`, async ({ page }) => {
        await page.setViewportSize({ width, height });
        await page.goto(route);
        if (theme === "dark") {
          const toggle = page.getByRole("switch");
          if (await toggle.count()) await toggle.first().click();
        }
        await settle(page);

        const r = await page.evaluate(probe);

        expect(
          r.lowContrast,
          `below AA: ${JSON.stringify(r.lowContrast)}`,
        ).toEqual([]);
        expect(
          r.smallTargets,
          `under ${MIN_TARGET}px: ${JSON.stringify(r.smallTargets)}`,
        ).toEqual([]);
        expect(r.h1Count, "exactly one h1").toBe(1);
        expect(r.skips, "no skipped heading levels").toBe(0);
        expect(r.missingAlt, "every image has alt text").toBe(0);
        expect(r.overflow, "no horizontal scroll").toBeLessThanOrEqual(0);
      });
    }
  }
}
