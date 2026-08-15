import { test, expect, type Page } from "@playwright/test";

const RULE = "#work [aria-hidden].h-px";
const BAR = "[data-sus-bar]";
const LOOP = ".logoloop";

/** How far the tool strip has travelled, read off its transform. */
const loopOffset = (page: Page) =>
  page.evaluate(
    (sel) =>
      getComputedStyle(document.querySelector(`${sel} .logoloop__track`)!)
        .transform,
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

test.describe("Motion — the tool strip", () => {
  test("scrolls the logos across", async ({ page }) => {
    await page.goto("/");
    await scrollTo(page, LOOP);

    const before = await loopOffset(page);
    await page.waitForTimeout(600);
    expect(await loopOffset(page)).not.toBe(before);
  });

  test("keeps moving while the pointer sits on it", async ({ page }) => {
    await page.goto("/");
    await scrollTo(page, LOOP);
    await page.locator(LOOP).hover();

    const before = await loopOffset(page);
    await page.waitForTimeout(600);

    // pauseOnHover is off, matching the rest of the site's motion.
    expect(await loopOffset(page)).not.toBe(before);
  });

  test("names every tool exactly once for assistive tech", async ({ page }) => {
    await page.goto("/");
    // The strip renders several copies to fill the width; all but the first
    // are aria-hidden, so each tool must be announced once and only once.
    const names = await page.evaluate(() =>
      [...document.querySelectorAll(".logoloop__list:not([aria-hidden=true])")]
        .flatMap((list) => [...list.querySelectorAll(".logoloop__item")])
        // One name per item: the icons carry a <title>, the wordmarks are text.
        // Reading both would count every icon twice, since the <title> lives
        // inside the span whose textContent also returns it.
        .map((item) =>
          (item.querySelector("svg title") ?? item).textContent?.trim(),
        )
        .filter((t): t is string => !!t),
    );

    for (const tool of [
      "Figma",
      "FigJam",
      "Miro",
      "Framer",
      "Illustrator",
      "Jira",
      "Claude Code",
      "Cursor",
    ]) {
      expect(names.filter((n) => n === tool), `${tool} appears once`).toHaveLength(1);
    }
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

  test("holds the tool strip still without emptying it", async ({ page }) => {
    await page.goto("/");
    await scrollTo(page, LOOP);

    const before = await loopOffset(page);
    await page.waitForTimeout(500);
    expect(await loopOffset(page)).toBe(before);

    // Frozen is the point; blank would not be.
    await expect(page.locator(`${LOOP} .logoloop__item`).first()).toBeVisible();
  });

  test("never collapses the section rule", async ({ page }) => {
    await page.goto("/");
    await scrollTo(page, RULE);
    await page.waitForTimeout(400);

    const [rule] = await transforms(page, RULE);
    expect(isIdentity(rule), `rule transform was "${rule}"`).toBe(true);
  });
});
