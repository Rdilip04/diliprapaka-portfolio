import { test, expect, type Page } from "@playwright/test";

/**
 * Layout assertions that jsdom cannot make: it performs no layout, so
 * getBoundingClientRect returns zeros and `md:` breakpoints never apply.
 */

const DESKTOP = { width: 1280, height: 900 };
const MOBILE = { width: 390, height: 844 };

/** Scroll About into view and wait for the reveal animation to settle. */
async function showAbout(page: Page, viewport = DESKTOP) {
  await page.setViewportSize(viewport);
  await page.goto("/");
  const about = page.locator("#about");
  await about.scrollIntoViewIfNeeded();

  // `whileInView` animates opacity AND translateY, so measuring before it
  // settles would read shifted coordinates. On short viewports the section is
  // taller than the screen, so each row has to be scrolled to individually —
  // the last one never enters view otherwise.
  const identity = page.locator("#about h2").locator("..");
  const revealed = [identity, ...(await page.locator("#about dl > div").all())];
  for (const el of revealed) {
    await el.scrollIntoViewIfNeeded();
    await expect(el).toHaveCSS("opacity", "1");
    await expect(el).toHaveCSS("transform", "none");
  }
  return about;
}

const box = async (page: Page, selector: string) => {
  const rect = await page.locator(selector).first().boundingBox();
  if (!rect) throw new Error(`No box for ${selector}`);
  return rect;
};

test.describe("About — desktop layout", () => {
  test("keeps each block label on one line in the narrowed track", async ({
    page,
  }) => {
    await showAbout(page);

    const labels = await page.locator("#about dl dt").evaluateAll((els) =>
      els.map((el) => {
        const range = document.createRange();
        range.selectNodeContents(el);
        const rects = [...range.getClientRects()];
        return {
          text: el.textContent ?? "",
          lines: rects.length,
          textWidth: Math.max(...rects.map((r) => r.width)),
          trackWidth: el.clientWidth,
        };
      }),
    );

    expect(labels.length).toBeGreaterThan(0);
    for (const label of labels) {
      expect(label.lines, `"${label.text}" wrapped`).toBe(1);
      expect(label.textWidth).toBeLessThanOrEqual(label.trackWidth);
    }
  });

  test("sits the description close to its label, not across a canyon", async ({
    page,
  }) => {
    await showAbout(page);

    const dt = await box(page, "#about dl dt");
    const dd = await box(page, "#about dl dd");

    // Was 192px (10rem track + 2rem gap) and read as trapped whitespace.
    expect(dd.x - dt.x).toBeLessThanOrEqual(140);
    expect(dd.x).toBeGreaterThan(dt.x); // still two columns, not stacked
  });

  test("ends the reading path with the CV link, aligned to the content column", async ({
    page,
  }) => {
    await showAbout(page);

    // The reader finishes "Beyond work" and meets the action next — sending the
    // eye back to the far-left rail was avoidable friction.
    const heading = await box(page, "#about h2");
    const dt = await box(page, "#about dl dt");
    const link = await box(page, '#about a[href$=".pdf"]');

    expect(Math.round(link.x)).toBe(Math.round(dt.x));
    expect(link.x).toBeGreaterThan(heading.x);
    expect(link.y).toBeGreaterThan(dt.y);
  });
});

test.describe("About — vertical rhythm", () => {
  test("spaces the section on a strict 8pt grid", async ({ page }) => {
    await showAbout(page);

    const spacing = await page.evaluate(() => {
      const list = document.querySelector("#about dl")!;
      const rows = [...list.children] as HTMLElement[];
      const px = (v: string) => parseFloat(v);

      return {
        listMarginTop: px(getComputedStyle(list).marginTop),
        rows: rows.map((row) => {
          const s = getComputedStyle(row);
          return {
            paddingTop: px(s.paddingTop),
            paddingBottom: px(s.paddingBottom),
          };
        }),
      };
    });

    const values = [
      spacing.listMarginTop,
      ...spacing.rows.flatMap((r) => [r.paddingTop, r.paddingBottom]),
    ];

    for (const value of values) {
      expect(value % 8, `${value}px is off the 8pt grid`).toBe(0);
    }
  });

  test("pads block rows symmetrically above and below their rules", async ({
    page,
  }) => {
    await showAbout(page);

    const rows = await page
      .locator("#about dl > div")
      .evaluateAll((els) =>
        els
          .filter((el) => el.querySelector("dt"))
          .map((el) => {
            const s = getComputedStyle(el);
            return {
              top: parseFloat(s.paddingTop),
              bottom: parseFloat(s.paddingBottom),
            };
          }),
      );

    expect(rows.length).toBeGreaterThan(0);
    for (const row of rows) {
      expect(row.top).toBe(row.bottom);
    }
  });
});

test.describe("About — rendered contrast", () => {
  test("renders the meta label at AA once Tailwind has generated the colour", async ({
    page,
  }) => {
    await showAbout(page);

    // Complements the token-level unit test: this proves the alpha utility
    // actually reached the pixel, rather than silently failing to compile.
    const ratio = await page.evaluate(() => {
      // Composite via canvas rather than parsing the computed colour: Tailwind
      // emits alpha utilities as `oklab(... / .7)`, which no naive rgb regex
      // reads correctly.
      const paint = (...layers: string[]): [number, number, number] => {
        const c = document.createElement("canvas");
        c.width = c.height = 1;
        const ctx = c.getContext("2d")!;
        for (const layer of layers) {
          ctx.fillStyle = layer;
          ctx.fillRect(0, 0, 1, 1);
        }
        const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
        return [r, g, b];
      };

      const lum = (rgb: [number, number, number]) => {
        const ch = (raw: number) => {
          const c = raw / 255;
          return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
        };
        return 0.2126 * ch(rgb[0]) + 0.7152 * ch(rgb[1]) + 0.0722 * ch(rgb[2]);
      };

      const el = document.querySelector("#about p.font-mono") as HTMLElement;
      const section = document.querySelector("#about") as HTMLElement;

      const bgCss = getComputedStyle(section).backgroundColor;
      const bg = paint(bgCss);
      const flat = paint(bgCss, getComputedStyle(el).color);

      const [a, b] = [lum(flat), lum(bg)].sort((x, y) => y - x);
      return (a + 0.05) / (b + 0.05);
    });

    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });
});

test.describe("About — mobile layout", () => {
  test("stacks the label above its description", async ({ page }) => {
    await showAbout(page, MOBILE);

    const dt = await box(page, "#about dl dt");
    const dd = await box(page, "#about dl dd");

    expect(Math.round(dd.x)).toBe(Math.round(dt.x));
    expect(dd.y).toBeGreaterThan(dt.y);
  });

  test("keeps the CV link reachable and left-aligned with the content", async ({
    page,
  }) => {
    await showAbout(page, MOBILE);

    // Mobile stacks to one column, so every element shares the same edge.
    const heading = await box(page, "#about h2");
    const link = await box(page, '#about a[href$=".pdf"]');

    expect(Math.round(link.x)).toBe(Math.round(heading.x));
    await expect(page.locator('#about a[href$=".pdf"]')).toBeVisible();
  });
});
