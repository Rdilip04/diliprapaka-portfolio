import { test, expect, type Page } from "@playwright/test";

const RULE = "#work [aria-hidden].h-px";
const BAR = "[data-sus-bar]";
const LOOP = ".text-loop";

/** Where each copy of the award text currently sits along the ribbon. */
const loopOffsets = (page: Page) =>
  page.evaluate(
    (sel) =>
      [...document.querySelectorAll(`${sel} textPath`)].map((p) =>
        p.getAttribute("startOffset"),
      ),
    LOOP,
  );

/**
 * Scroll from inside the page rather than with scrollIntoViewIfNeeded: these
 * sections re-render as their reveals fire, and Playwright's version detaches
 * mid-scroll ("Element is not attached to the DOM").
 */
const scrollTo = async (page: Page, selector: string) => {
  await page.waitForSelector(selector, { state: "attached" });
  // Twice: the reveals above expand as they fire and shift the target by
  // thousands of pixels, so the first scroll lands in the wrong place.
  for (const wait of [250, 250]) {
    await page.evaluate((sel) => {
      document.querySelector(sel)?.scrollIntoView({ block: "center" });
    }, selector);
    await page.waitForTimeout(wait);
  }
};

/** Wait for the reveal to actually finish rather than guessing a duration. */
const settled = (page: Page, selector: string) =>
  page.waitForFunction(
    (sel) => {
      const els = [...document.querySelectorAll(sel)];
      if (els.length === 0) return false;
      return els.every((el) => {
        const t = getComputedStyle(el).transform;
        if (t === "none") return true;
        const m = t.match(/matrix\(([^)]+)\)/);
        return m ? parseFloat(m[1].split(",")[0]) > 0.99 : true;
      });
    },
    selector,
    { timeout: 15_000 },
  );

const transforms = (page: Page, selector: string) =>
  page.evaluate(
    (sel) =>
      [...document.querySelectorAll(sel)].map(
        (el) => getComputedStyle(el).transform,
      ),
    selector,
  );

const scaleXOf = (t: string) => {
  if (t === "none") return 1;
  const m = t.match(/matrix\(([^)]+)\)/);
  return m ? parseFloat(m[1].split(",")[0]) : 1;
};

const isIdentity = (t: string) => t === "none" || scaleXOf(t) === 1;

test.describe("Motion — anime.js reveals finish", () => {
  test("fills every SUS bar to full scale", async ({ page }) => {
    await page.goto("/work/nextstep");
    await scrollTo(page, BAR);
    await settled(page, BAR);

    const bars = await transforms(page, BAR);
    expect(bars).toHaveLength(6);
    for (const t of bars) expect(scaleXOf(t)).toBeCloseTo(1, 1);
  });

  test("draws the section rule out to full width", async ({ page }) => {
    await page.goto("/");
    await scrollTo(page, RULE);
    await settled(page, RULE);

    const [rule] = await transforms(page, RULE);
    expect(scaleXOf(rule)).toBeCloseTo(1, 1);
  });
});

test.describe("Motion — the award ribbon", () => {
  test("scrolls the award text around the curve", async ({ page }) => {
    await page.goto("/");
    await scrollTo(page, LOOP);

    const before = await loopOffsets(page);
    expect(before).toHaveLength(2);
    await page.waitForTimeout(600);
    const after = await loopOffsets(page);

    expect(after[0]).not.toBe(before[0]);
  });

  // The SVG scales to its width, so the band grows as the viewport does. A
  // fixed px height fits at one width and slices the peaks flat at every
  // wider one — which is exactly what shipped before this test existed.
  for (const width of [768, 1280, 1920, 2560]) {
    test(`keeps the whole wave inside its crop at ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      await scrollTo(page, LOOP);

      const r = await page.evaluate((sel) => {
        const root = document.querySelector(sel)!;
        const svg = root.querySelector("svg")!;
        const path = svg.querySelector("path")!;
        const bb = path.getBBox();
        const sw = parseFloat(path.getAttribute("stroke-width") ?? "0");
        // getBBox excludes the stroke, so grow it by half a ribbon each side.
        const m = svg.getScreenCTM()!;
        const toClient = (u: number) => m.f + u * m.d;
        const box = root.getBoundingClientRect();
        return {
          top: toClient(bb.y - sw / 2) - box.top,
          bottom: box.bottom - toClient(bb.y + bb.height + sw / 2),
        };
      }, LOOP);

      expect(r.top, `wave clipped at the top (${width}px)`).toBeGreaterThanOrEqual(0);
      expect(r.bottom, `wave clipped at the bottom (${width}px)`).toBeGreaterThanOrEqual(0);
    });
  }

  test("keeps looping while the pointer sits on it", async ({ page }) => {
    await page.goto("/");
    await scrollTo(page, LOOP);
    await page.locator(LOOP).hover();

    const before = await loopOffsets(page);
    await page.waitForTimeout(600);

    // pauseOnHover is off on purpose — the ribbon should never stall.
    expect((await loopOffsets(page))[0]).not.toBe(before[0]);
  });

  test("announces the award once, not once per repetition", async ({ page }) => {
    await page.goto("/");
    // The ribbon repeats the phrase a dozen times; every <text> inside is
    // aria-hidden so the accessible name is the phrase exactly once.
    const svg = page.locator(`${LOOP} svg[role="img"]`);
    await expect(svg).toHaveAttribute("aria-label", /1st Place.*BCU Innovation Fest/i);
  });

  test("re-maps the ribbon to the dark accent token", async ({ page }) => {
    await page.goto("/");
    const stroke = () =>
      page.evaluate(
        (sel) => getComputedStyle(document.querySelector(`${sel} path`)!).stroke,
        LOOP,
      );

    // The colours come in as var(--color-*), so the ribbon has to follow the
    // theme rather than staying on a hardcoded hex.
    expect(await stroke()).toBe("rgb(47, 43, 230)");
    await page.getByRole("switch").first().click();
    await page.waitForTimeout(400);
    expect(await stroke()).toBe("rgb(111, 107, 255)");
  });
});

test.describe("Motion — reduced motion never hides content", () => {
  // emulateMedia rather than test.use({ reducedMotion }): the describe-level
  // option did not reach matchMedia in this config (verified — the page kept
  // reporting false and the reveals ran). Set before goto so the mount effect
  // reads the right value.
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
  });

  test("never collapses the SUS bars", async ({ page }) => {
    await page.goto("/work/nextstep");
    await scrollTo(page, BAR);
    await page.waitForTimeout(400);

    const bars = await transforms(page, BAR);
    expect(bars).toHaveLength(6);
    for (const t of bars) {
      expect(isIdentity(t), `bar transform was "${t}"`).toBe(true);
    }
  });

  test("holds the award ribbon still without emptying it", async ({ page }) => {
    await page.goto("/");
    await scrollTo(page, LOOP);

    const before = await loopOffsets(page);
    await page.waitForTimeout(500);
    expect(await loopOffsets(page)).toEqual(before);

    // Frozen is the point; blank would not be.
    const text = await page.locator(`${LOOP} textPath`).first().textContent();
    expect(text?.trim().length ?? 0).toBeGreaterThan(0);
  });

  test("never collapses the section rule", async ({ page }) => {
    await page.goto("/");
    await scrollTo(page, RULE);
    await page.waitForTimeout(400);

    const [rule] = await transforms(page, RULE);
    expect(isIdentity(rule), `rule transform was "${rule}"`).toBe(true);
  });
});
