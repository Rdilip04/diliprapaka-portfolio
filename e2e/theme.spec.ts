import { test, expect, type Page } from "@playwright/test";

const toggle = (page: Page) => page.getByRole("switch");
const isDark = (page: Page) =>
  page.evaluate(() => document.documentElement.classList.contains("dark"));

test.describe("Theme toggle", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("starts light for a first-time visitor", async ({ page }) => {
    expect(await isDark(page)).toBe(false);
    await expect(toggle(page)).toHaveAttribute("aria-checked", "false");
    await expect(toggle(page)).toHaveAccessibleName("Switch to dark theme");
  });

  test("switches the document theme and renames itself for the next action", async ({
    page,
  }) => {
    await toggle(page).click();

    expect(await isDark(page)).toBe(true);
    await expect(toggle(page)).toHaveAttribute("aria-checked", "true");
    await expect(toggle(page)).toHaveAccessibleName("Switch to light theme");

    await toggle(page).click();
    expect(await isDark(page)).toBe(false);
  });

  test("returns to light on reload — light is the primary design", async ({
    page,
  }) => {
    await toggle(page).click();
    expect(await isDark(page)).toBe(true);

    await page.reload();
    expect(await isDark(page)).toBe(false);
    await expect(toggle(page)).toHaveAttribute("aria-checked", "false");
  });

  test("keeps the choice to the visit, storing nothing", async ({ page }) => {
    await toggle(page).click();

    expect(await page.evaluate(() => localStorage.getItem("theme"))).toBeNull();
    expect(
      await page.evaluate(() => Object.keys(localStorage).length),
    ).toBe(0);
  });

  test("meets the 44px minimum touch target", async ({ page }) => {
    const size = await toggle(page).boundingBox();
    expect(size!.width).toBeGreaterThanOrEqual(44);
    expect(size!.height).toBeGreaterThanOrEqual(44);
  });

  test("stays reachable on mobile, where the nav collapses", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();

    await expect(toggle(page)).toBeVisible();
    await expect(page.getByRole("switch")).toHaveCount(1);
  });
});

test.describe("Theme contrast", () => {
  for (const theme of ["light", "dark"] as const) {
    test(`keeps body text and the footer readable in ${theme} mode`, async ({
      page,
    }) => {
      await page.goto("/");
      if (theme === "dark") await toggle(page).click();

      const ratios = await page.evaluate(() => {
        // Let the browser resolve and composite. Tailwind emits alpha colours
        // as `oklab(... / .75)`; parsing that by regex silently yields garbage,
        // so paint fg over bg on a 1x1 canvas and read the actual pixel.
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
        const lum = (c: [number, number, number]) => {
          const ch = (r: number) => {
            const v = r / 255;
            return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
          };
          return 0.2126 * ch(c[0]) + 0.7152 * ch(c[1]) + 0.0722 * ch(c[2]);
        };
        const ratio = (el: Element, surface: Element) => {
          const bgCss = getComputedStyle(surface).backgroundColor;
          const bg = paint(bgCss);
          const flat = paint(bgCss, getComputedStyle(el).color);
          const [hi, lo] = [lum(flat), lum(bg)].sort((x, y) => y - x);
          return (hi + 0.05) / (lo + 0.05);
        };

        const about = document.querySelector("#about")!;
        const footer = document.querySelector("footer")!;
        return {
          body: ratio(about.querySelector("dd")!, about),
          statement: ratio(about.querySelector("dl")!.previousElementSibling!, about),
          cv: ratio(about.querySelector('a[href$=".pdf"]')!, about),
          footerText: ratio(footer.querySelector("a")!, footer),
        };
      });

      for (const [name, value] of Object.entries(ratios)) {
        expect(value, `${name} in ${theme} mode is ${value.toFixed(2)}:1`).
          toBeGreaterThanOrEqual(4.5);
      }
    });
  }
});
