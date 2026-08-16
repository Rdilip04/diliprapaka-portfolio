import { test, expect, type Page } from "@playwright/test";

const RULE = "#work [aria-hidden].h-px";
const BAR = "[data-sus-bar]";

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

const yOf = (page: Page, selector: string) =>
  page.evaluate(
    (sel) =>
      [...document.querySelectorAll(sel)].map((el) =>
        Math.round(new DOMMatrixReadOnly(getComputedStyle(el).transform).f),
      ),
    selector,
  );

test.describe("Motion — the word rise", () => {
  test("holds the section heading out of frame until it is scrolled to", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForTimeout(400);

    // Below the fold, so it must still be waiting — collapsed, not played.
    const offsets = await yOf(page, "#work h2 [data-word]");
    expect(offsets.length).toBeGreaterThan(1);
    for (const y of offsets) expect(y).toBeGreaterThan(0);
  });

  test("raises each word after the one before it", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() =>
      window.scrollTo(
        0,
        document.querySelector<HTMLElement>("#work")!.offsetTop - 200,
      ),
    );
    // Sampling one instant is unreliable — the ease is fast, so the window
    // where the words differ is short. Poll frame by frame and assert we ever
    // catch the first word ahead of the last, which a plain fade never shows.
    const staggered = await page.evaluate(async (sel) => {
      const read = () =>
        [...document.querySelectorAll(sel)].map(
          (el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).f,
        );
      for (let frame = 0; frame < 60; frame++) {
        const y = read();
        if (y[y.length - 1] > 0.5 && y[0] < y[y.length - 1] - 0.5) return true;
        await new Promise((r) => requestAnimationFrame(r));
      }
      return false;
    }, "#work h2 [data-word]");

    expect(staggered, "words never moved independently").toBe(true);

    await page.waitForTimeout(1500);
    for (const y of await yOf(page, "#work h2 [data-word]")) expect(y).toBe(0);
  });

  test("rises the hero headline without breaking how it reads", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForTimeout(1600);

    // The words are individually masked; the heading must still serialise with
    // real spaces for screen readers and copy-paste.
    await expect(page.locator("h1")).toHaveText(
      "Hi, I’m Dilip Rapaka. I turn hard problems into products people can actually use.",
    );
  });
});

test.describe("Motion — click sparks", () => {
  test("paints sparks where the pointer clicks", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(500);

    const lit = await page.evaluate(async () => {
      const canvas = document.querySelector<HTMLCanvasElement>(
        "[data-spark-root] canvas",
      )!;
      const root = document.querySelector("[data-spark-root] > div")!;
      const rect = canvas.getBoundingClientRect();
      const [x, y] = [640, 300];

      root.dispatchEvent(
        new MouseEvent("click", {
          clientX: x + rect.left,
          clientY: y + rect.top,
          bubbles: true,
        }),
      );
      await new Promise((r) => setTimeout(r, 120));

      // Count painted pixels rather than trusting the element exists: the
      // canvas is the first child, so an opaque section would hide it and the
      // markup would still look right.
      const data = canvas.getContext("2d")!.getImageData(x - 60, y - 60, 120, 120).data;
      let count = 0;
      for (let i = 3; i < data.length; i += 4) if (data[i] > 0) count++;
      return count;
    });

    expect(lit).toBeGreaterThan(0);
  });

  test("lets clicks through to the page underneath", async ({ page }) => {
    await page.goto("/");
    // The canvas covers the whole document, so if it ever caught pointer
    // events the entire site would stop responding.
    await page.getByRole("link", { name: /selected work/i }).first().click();
    await expect(page.locator("#work")).toBeInViewport();
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

  test("never leaves a heading word out of frame", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(300);

    // Both halves of the gesture must opt out: the JS one never collapses, and
    // the CSS one must not sit on its start frame through the delay either.
    for (const sel of ["#work h2 [data-word]", "h1 [style*='--i']"]) {
      const offsets = await yOf(page, sel);
      expect(offsets.length).toBeGreaterThan(0);
      for (const y of offsets) expect(y).toBe(0);
    }
  });

  test("mounts no spark canvas at all", async ({ page }) => {
    await page.goto("/");
    // Opted out entirely rather than rendered-but-still: no canvas, no rAF
    // loop, no document-sized buffer.
    await expect(page.locator("[data-spark-root]")).toHaveCount(0);
    await expect(page.locator("h1")).toBeVisible();
  });

  test("never collapses the section rule", async ({ page }) => {
    await page.goto("/");
    await scrollTo(page, RULE);
    await page.waitForTimeout(400);

    const [rule] = await transforms(page, RULE);
    expect(isIdentity(rule), `rule transform was "${rule}"`).toBe(true);
  });
});
