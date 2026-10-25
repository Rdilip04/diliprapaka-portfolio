import { test, expect } from "@playwright/test";

const URL = "/work/cursor";

test.describe("Cursor case study — structure and honesty", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URL);
  });

  test("names the product as the only h1", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Cursor");
  });

  test("runs its nine sections in order", async ({ page }) => {
    const eyebrows = await page.locator("main section p.font-mono").allTextContents();
    const nums = eyebrows
      .map((t) => t.match(/^(\d{2}) ·/)?.[1])
      .filter((n): n is string => Boolean(n));
    expect(nums).toEqual(["01", "02", "03", "04", "05", "06", "07", "08", "09"]);
  });

  test("never skips a heading level", async ({ page }) => {
    const levels = await page
      .locator("main h1, main h2, main h3, main h4")
      .evaluateAll((els) => els.map((e) => Number(e.tagName[1])));
    for (let i = 1; i < levels.length; i++) {
      expect(levels[i] - levels[i - 1]).toBeLessThanOrEqual(1);
    }
  });

  // These lines pre-empt the first questions an interviewer asks. Keep them.
  test("says plainly what was not tested and who the testers were", async ({ page }) => {
    const main = page.locator("main");
    await expect(main).toContainText("A concept, not affiliated with Cursor");
    await expect(main).toContainText("They weren’t quite my user.");
    await expect(main).toContainText("I didn’t retest this version.");
    await expect(main).toContainText("this one hasn’t been tested yet.");
  });

  test("leads with what testing showed", async ({ page }) => {
    const outcome = page.locator("#outcome");
    await expect(outcome).toContainText("3 of 3");
    await expect(outcome).toContainText("1 of 3");
    await expect(outcome).toContainText("6 or 7");
  });

  test("uses no em or en dashes and UK spelling", async ({ page }) => {
    const text = await page.locator("main").innerText();
    expect(text).not.toMatch(/[–—]/);
    for (const us of ["color", "behavior", "analyz", "organiz", "recogniz", "utiliz", "specializ"]) {
      expect(text.toLowerCase(), `found "${us}"`).not.toContain(us);
    }
  });

  test("opens the prototype and the compared tools in a new tab", async ({ page }) => {
    const external = page.locator('main a[href^="https://"]');
    await expect(external).toHaveCount(4);
    for (const l of await external.all()) {
      await expect(l).toHaveAttribute("target", "_blank");
      await expect(l).toHaveAttribute("rel", /noopener/);
    }
  });

  test("every figure is a real image with alt text, served through next/image", async ({ page }) => {
    const imgs = page.locator("main figure img");
    expect(await imgs.count()).toBe(6);
    for (const img of await imgs.all()) {
      expect((await img.getAttribute("alt"))?.trim()).toBeTruthy();
      await expect(img).toHaveAttribute("src", /\/_next\/image/);
      await expect(img).toHaveAttribute("srcset", /.+/);
      await expect(img).toHaveAttribute("sizes", /.+/);
    }
  });

  test("ends with a way on, not a dead end", async ({ page }) => {
    await page.getByRole("link", { name: "Next: NextStep →" }).click();
    await expect(page).toHaveURL(/\/work\/nextstep$/);
  });
});

test.describe("Cursor in Selected work", () => {
  test("is project 03 and opens the case study", async ({ page }) => {
    await page.goto("/");
    const row = page.locator('#work a[href="/work/cursor"]');
    await expect(row).toHaveCount(1);
    await row.click();
    await expect(page).toHaveURL(/\/work\/cursor$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Cursor");
  });
});
