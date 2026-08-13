import { test, expect, type Page } from "@playwright/test";

const h1 = (page: Page) => page.getByRole("heading", { level: 1 });

test.describe("Hero — positioning", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("opens with the full introduction, greeting and all", async ({
    page,
  }) => {
    // Dilip's wording, chosen deliberately — the greeting stays in the H1.
    await expect(h1(page)).toContainText(
      "Hi, I’m Dilip Rapaka. I turn hard problems into products people can actually use.",
    );
  });

  test("keeps the headline short enough to read in one pass", async ({
    page,
  }) => {
    const words = (await h1(page).innerText()).trim().split(/\s+/).length;
    expect(words).toBeLessThanOrEqual(16);
  });

  test("follows the headline with the positioning line and availability", async ({
    page,
  }) => {
    await expect(page.locator("#top")).toContainText(
      "A product designer based in the UK. I keep things simple and easy to use.",
    );
    await expect(page.locator("#top")).toContainText(
      "Currently open to junior roles",
    );
  });

  test("does not repeat the name in the eyebrow above it", async ({ page }) => {
    const eyebrow = page.locator("#top").getByText("Product Designer", {
      exact: true,
    });
    await expect(eyebrow).toBeVisible();
    await expect(eyebrow).not.toContainText("Dilip");
  });

  test("keeps the eyebrow above the AA floor", async ({ page }) => {
    const ratio = await page.evaluate(() => {
      const paint = (...layers: string[]): [number, number, number] => {
        const c = document.createElement("canvas");
        c.width = c.height = 1;
        const ctx = c.getContext("2d")!;
        for (const l of layers) {
          ctx.fillStyle = l;
          ctx.fillRect(0, 0, 1, 1);
        }
        const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
        return [r, g, b];
      };
      const lum = (c: [number, number, number]) => {
        const ch = (v: number) => {
          const n = v / 255;
          return n <= 0.03928 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4;
        };
        return 0.2126 * ch(c[0]) + 0.7152 * ch(c[1]) + 0.0722 * ch(c[2]);
      };
      const el = [...document.querySelectorAll("p")].find(
        (p) => p.textContent?.trim() === "Product Designer",
      )!;
      const surface = getComputedStyle(el.closest("section")!).backgroundColor;
      const [hi, lo] = [
        lum(paint(surface, getComputedStyle(el).color)),
        lum(paint(surface)),
      ].sort((a, b) => b - a);
      return (hi + 0.05) / (lo + 0.05);
    });

    expect(ratio, `hero eyebrow is ${ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(4.5);
  });
});

test.describe("Hero — fits the first screen", () => {
  for (const [name, width, height] of [
    ["small phone", 375, 812],
    ["laptop", 1280, 720],
  ] as const) {
    test(`keeps the primary CTA above the fold on a ${name}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height });
      await page.goto("/");

      const cta = page.getByRole("link", { name: /Selected work/ });
      const box = (await cta.boundingBox())!;
      // A longer H1 pushes the CTA down — it must not fall off the screen.
      expect(box.y + box.height).toBeLessThanOrEqual(height);
    });
  }

  test("does not overflow horizontally at 375px", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");

    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
});
