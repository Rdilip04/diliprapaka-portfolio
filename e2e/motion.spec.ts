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

test.describe("Motion — the scaleX reveals finish", () => {
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

test.describe("Motion — scripting off never hides content", () => {
  // Motion writes its `initial` prop into the server-rendered markup, so every
  // below-fold reveal shipped as an inline `opacity: 0` that only cleared once
  // JS hydrated and the observer fired. With scripting off that left the nav,
  // About, Approach and the whole contact block blank — the email included,
  // which is the page's primary CTA. globals.css forces `[data-reveal]` visible
  // under `(scripting: none)` and in print; these pin both.
  test.use({ javaScriptEnabled: false });

  for (const route of ["/", "/work/nextstep"] as const) {
    test(`renders every reveal on ${route} without JS`, async ({ page }) => {
      // domcontentloaded, not load: the case study's below-fold images are
      // lazy and stay deferred with no JS to scroll them into view, so `load`
      // never fires. The assertion is about server-rendered markup anyway.
      await page.goto(route, { waitUntil: "domcontentloaded" });

      const hidden = await page.$$eval("[data-reveal]", (els) =>
        els
          .filter((el) => parseFloat(getComputedStyle(el).opacity) < 0.99)
          .map((el) => (el.textContent || "").trim().slice(0, 40)),
      );

      expect(await page.locator("[data-reveal]").count()).toBeGreaterThan(0);
      expect(hidden, `still transparent: ${JSON.stringify(hidden)}`).toEqual([]);
    });
  }

  test("keeps the contact block and its email readable", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    // The email is the one piece of the page a recruiter has to be able to
    // read, and it sat inside a reveal.
    await expect(page.getByRole("link", { name: /gmail\.com/i })).toBeVisible();
    await expect(page.getByRole("banner")).toBeVisible();
    await expect(page.locator("#about")).toBeVisible();
    await expect(page.locator("#approach")).toBeVisible();
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
