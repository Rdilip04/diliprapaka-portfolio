import { test, expect } from "@playwright/test";

const URL = "/work/quietly";

test.describe("Quietly case study — structure and honesty", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URL);
  });

  test("names the product as the only h1", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(page.getByRole("heading", { level: 1 })).toHaveAccessibleName("Quietly");
  });

  test("runs its nine sections in order", async ({ page }) => {
    const nums = await page.locator(".sec-num").allTextContents();
    expect(nums).toEqual(["01", "02", "03", "04", "05", "06", "07", "08", "09"]);
  });

  test("says up front that it is an untested concept", async ({ page }) => {
    await expect(page.locator(".hero")).toContainText("A concept. Not built, not tested with people.");
    await expect(page.locator("#s9")).toHaveText("What I don't know yet");
  });

  test("uses no em or en dashes and UK spelling", async ({ page }) => {
    const text = await page.locator("main").innerText();
    expect(text).not.toMatch(/[–—]/);
    for (const us of ["color", "behavior", "analyz", "organiz", "recogniz"]) {
      expect(text.toLowerCase(), `found "${us}"`).not.toContain(us);
    }
  });

  test("links the Figma prototype in a new tab", async ({ page }) => {
    const links = page.locator('a[href^="https://www.figma.com/design/"]');
    await expect(links).toHaveCount(2);
    for (const l of await links.all()) {
      await expect(l).toHaveAttribute("target", "_blank");
      await expect(l).toHaveAttribute("rel", /noopener/);
    }
  });
});

test.describe("Quietly case study — interactions", () => {
  test("the film always shows a pause or play control", async ({ page }) => {
    await page.goto(URL);
    await expect(page.getByRole("button", { name: /(play|pause) the film/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /turn sound on/i })).toBeVisible();
  });

  test("under Reduce Motion the film waits for the viewer", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(URL);
    await page.locator(".film-frame").scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    expect(await page.locator(".film-frame video").evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
    await expect(page.getByRole("button", { name: "Play the film" })).toBeVisible();
  });

  test("the month is one tab stop, and a night opens its sheet", async ({ page }) => {
    await page.goto(URL);
    const tabbable = page.locator(".mo-grid button[tabindex='0']");
    await expect(tabbable).toHaveCount(1);

    await page.getByRole("button", { name: "Thursday 16 October, late night" }).click();
    const sheet = page.getByRole("dialog");
    await expect(sheet).toContainText("A late night. Nothing was lost.");
    await expect(page.getByRole("button", { name: "Done" })).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(page.getByRole("button", { name: "Thursday 16 October, late night" })).toBeFocused();
  });

  test("arrow keys move between nights", async ({ page }) => {
    await page.goto(URL);
    await page.getByRole("button", { name: "Saturday 18 October, quiet evening" }).focus();
    await page.keyboard.press("ArrowUp");
    await expect(page.getByRole("button", { name: "Saturday 11 October, quiet evening" })).toBeFocused();
    await page.keyboard.press("Home");
    await expect(page.getByRole("button", { name: "Wednesday 1 October, quiet evening" })).toBeFocused();
  });

  test("the before and after slider works with the keyboard", async ({ page }) => {
    await page.goto(URL);
    const slider = page.getByRole("slider", { name: /compare before and after/i }).first();
    await slider.focus();
    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("ArrowLeft");
    const pos = await page.locator(".cmp").first().evaluate((el) => (el as HTMLElement).style.getPropertyValue("--pos"));
    expect(pos).toBe("48%");
  });

  test("the threshold demo only tells the app when the line is crossed", async ({ page }) => {
    await page.goto(URL);
    const mins = page.locator("#mins");
    await mins.fill("9");
    await expect(page.locator(".view .msg")).toHaveText("Nothing yet. Tonight is still quiet.");
    await mins.fill("10");
    await expect(page.locator(".view .msg")).toContainText("threshold was crossed");
  });
});

test.describe("Quietly styles stay on the Quietly page", () => {
  test("moving on to NextStep leaves no night styling behind", async ({ page }) => {
    await page.goto(URL);
    await page.getByRole("link", { name: /next case study/i }).click();
    await expect(page).toHaveURL(/\/work\/nextstep$/);
    const h1 = await page.getByRole("heading", { level: 1 }).evaluate((el) => getComputedStyle(el).fontFamily);
    expect(h1.toLowerCase()).not.toContain("outfit");
    const bg = await page.locator("main section").first().evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(bg).toBe("rgb(247, 248, 250)");
  });
});

test.describe("Selected work — the Quietly nameplate", () => {
  const row = ".qrow";

  test("turns into Quietly's world on hover", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");
    await page.locator("#work").scrollIntoViewIfNeeded();
    await expect(page.locator(row)).toHaveAttribute("data-on", "false");

    await page.hover(`${row} a`);
    await expect(page.locator(row)).toHaveAttribute("data-on", "true");
    await expect.poll(async () => page.locator(`${row} .qrow-logo`).evaluate((el) => Number(getComputedStyle(el).opacity)), { timeout: 3000 }).toBe(1);
    await expect.poll(async () => page.locator(`${row} > a`).evaluate((el) => getComputedStyle(el).backgroundColor), { timeout: 3000 }).toBe("rgb(14, 23, 20)");
    await expect(page.locator(`${row} .qrow-thumb video`)).toHaveCount(1);
  });

  test("keyboard focus opens it too", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");
    await page.locator(`${row} a`).focus();
    await expect(page.locator(row)).toHaveAttribute("data-on", "true");
  });

  test("wears a quiet nameplate at rest on phones", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    const bg = await page.locator(`${row} > a`).evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(bg).toBe("rgb(14, 23, 20)");
    await expect(page.locator(`${row} .qrow-thumb video`)).toHaveCount(0);
  });

  test("keeps the accessible name plain", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(`${row} h3`)).toHaveAccessibleName(/^Quietly/);
  });
});
