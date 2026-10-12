import { test, expect, type Page } from "@playwright/test";

/**
 * The resting thumbnail is sized to span its row's text block exactly: top
 * level with the title's first line, bottom level with the description's last.
 * That only holds while the description fits on one line, which is why the
 * size steps at md and why these assertions run at desktop widths.
 */
const settle = async (page: Page) => {
  await page.evaluate(async () => {
    document.querySelector("#work")?.scrollIntoView({ block: "center" });
    await new Promise((r) => setTimeout(r, 900));
  });
  await page.waitForFunction(() => {
    const t = document.querySelector("#work .rounded-lg.border");
    return !!t && t.getBoundingClientRect().height > 0;
  });
};

const geometry = (page: Page) =>
  page.evaluate(() => {
    const row = [...document.querySelectorAll("#work a")].find((a) =>
      a.textContent?.includes("NextStep"),
    )!;
    const title = row.querySelector("h3")!;
    const desc = title.parentElement!.parentElement!.querySelector("p")!;
    const thumb = row.querySelector(".rounded-lg.border")!;
    const box = (el: Element) => el.getBoundingClientRect();
    return {
      titleTop: box(title).top,
      descBottom: box(desc).bottom,
      thumbTop: box(thumb).top,
      thumbBottom: box(thumb).bottom,
      thumbW: box(thumb).width,
      thumbH: box(thumb).height,
    };
  });

test.describe("Selected work — the thumbnail spans its text block", () => {
  for (const width of [1280, 1440] as const) {
    test(`aligns top and bottom with the copy at ${width}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      await settle(page);

      const g = await geometry(page);
      expect(Math.abs(g.thumbTop - g.titleTop), "top level with the title").toBeLessThanOrEqual(2);
      expect(
        Math.abs(g.thumbBottom - g.descBottom),
        "bottom level with the description",
      ).toBeLessThanOrEqual(2);
    });
  }

  test("keeps the small size below md, where the description wraps", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await settle(page);

    const g = await geometry(page);
    // A 1.6:1 thumb tall enough to span three wrapped lines would take 160px of
    // a 342px row, so the row keeps the 76x56 size instead.
    expect(g.thumbW).toBeLessThanOrEqual(80);
    expect(g.thumbH).toBeLessThanOrEqual(60);
  });

  test("shows only title, description and CTA on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await settle(page);

    const row = page.locator("#work li").first().locator("a").first();
    const text = ((await row.textContent()) ?? "").replace(/\s+/g, " ");

    // There is no hover on mobile, so the meta, outcome and tags used to render
    // inline and stack the row into a wall of text — 384px tall. They are
    // desktop-only now; the case study carries all of it one tap away.
    await expect(row).toContainText("NextStep");
    await expect(row).toContainText(/stroke-rehabilitation/i);
    await expect(row).toContainText(/read case study/i);
    expect(text, "outcome line is desktop-only").not.toMatch(/Outcome:/i);
    expect(text, "tags are desktop-only").not.toMatch(/Usability Testing/i);

    const height = (await row.boundingBox())!.height;
    expect(height, `row was ${Math.round(height)}px`).toBeLessThan(260);
  });

  test("still grows to the full preview on hover", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await settle(page);

    const before = await geometry(page);
    expect(before.thumbW).toBeCloseTo(128, 0);

    await page.hover("#work ul li:first-child a");
    // expect.poll rather than a one-shot read: the growth is a 0.5s animation,
    // and a threshold check returns while it is still in flight — an earlier
    // version of this test caught it at 291.
    await expect
      .poll(async () => Math.round((await geometry(page)).thumbW), { timeout: 5000 })
      .toBe(300);

    const after = await geometry(page);
    expect(Math.round(after.thumbH)).toBe(188);
  });
});
