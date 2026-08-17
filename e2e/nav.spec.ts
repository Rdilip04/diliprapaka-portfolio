import { test, expect, type Page } from "@playwright/test";

const link = (page: Page, name: string) =>
  page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name });

/** Resolve a colour through the browser so oklab/alpha never gets regex-parsed. */
const colorOf = (page: Page, selector: string) =>
  page.evaluate((sel) => {
    const el = document.querySelector(sel)!;
    const c = document.createElement("canvas");
    c.width = c.height = 1;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = getComputedStyle(el).color;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    return `#${[r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("")}`;
  }, selector);

test.describe("Nav — clock hierarchy", () => {
  test("renders the clock lighter than the nav links", async ({ page }) => {
    await page.goto("/");

    const contrast = await page.evaluate(() => {
      const lum = (css: string) => {
        const c = document.createElement("canvas");
        c.width = c.height = 1;
        const ctx = c.getContext("2d")!;
        ctx.fillStyle = getComputedStyle(document.body).backgroundColor;
        ctx.fillRect(0, 0, 1, 1);
        ctx.fillStyle = css;
        ctx.fillRect(0, 0, 1, 1);
        const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
        const ch = (v: number) => {
          const n = v / 255;
          return n <= 0.03928 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4;
        };
        return 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b);
      };
      const nav = document.querySelector('nav[aria-label="Primary"]')!;
      return {
        clock: lum(getComputedStyle(nav.querySelector(".tabular-nums")!).color),
        navLink: lum(getComputedStyle(nav.querySelector("ul a")!).color),
        page: lum(getComputedStyle(document.body).backgroundColor),
      };
    });

    // Light page: higher luminance = closer to the background = more recessive.
    expect(contrast.clock).toBeGreaterThan(contrast.navLink);
  });

  test("keeps the dimmed clock above the AA floor", async ({ page }) => {
    await page.goto("/");

    const ratio = await page.evaluate(() => {
      const paint = (...layers: string[]) => {
        const c = document.createElement("canvas");
        c.width = c.height = 1;
        const ctx = c.getContext("2d")!;
        for (const l of layers) {
          ctx.fillStyle = l;
          ctx.fillRect(0, 0, 1, 1);
        }
        const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
        return [r, g, b] as [number, number, number];
      };
      const lum = (c: [number, number, number]) => {
        const ch = (v: number) => {
          const n = v / 255;
          return n <= 0.03928 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4;
        };
        return 0.2126 * ch(c[0]) + 0.7152 * ch(c[1]) + 0.0722 * ch(c[2]);
      };
      const clock = document.querySelector(
        'nav[aria-label="Primary"] .tabular-nums',
      )!;
      const bgCss = getComputedStyle(document.body).backgroundColor;
      const [hi, lo] = [
        lum(paint(bgCss, getComputedStyle(clock).color)),
        lum(paint(bgCss)),
      ].sort((a, b) => b - a);
      return (hi + 0.05) / (lo + 0.05);
    });

    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });
});

test.describe("Nav — active section", () => {
  test("highlights nothing while the reader is still on the hero", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.locator("nav [aria-current]")).toHaveCount(0);
  });

  for (const section of ["work", "about", "contact"] as const) {
    test(`marks ${section} active once it is the section being read`, async ({
      page,
    }) => {
      await page.goto("/");
      await page.locator(`#${section}`).scrollIntoViewIfNeeded();
      // Centre the section in the viewport — "active" is the middle band.
      await page.evaluate((id) => {
        document
          .getElementById(id)!
          .scrollIntoView({ block: "center", behavior: "instant" });
      }, section);

      const name = section === "work" ? "Work" : section === "about" ? "About" : "Contact";
      await expect(link(page, name)).toHaveAttribute("aria-current", "location");
      await expect(page.locator("nav [aria-current]")).toHaveCount(1);
    });
  }

  test("paints the active link in the same blue as the clock's dot", async ({
    page,
  }) => {
    await page.goto("/");
    await page.evaluate(() => {
      document
        .getElementById("about")!
        .scrollIntoView({ block: "center", behavior: "instant" });
    });
    await expect(link(page, "About")).toHaveAttribute(
      "aria-current",
      "location",
    );

    const dot = await page.evaluate(() => {
      const el = document.querySelector(
        'nav[aria-label="Primary"] .tabular-nums span',
      )!;
      const c = document.createElement("canvas");
      c.width = c.height = 1;
      const ctx = c.getContext("2d")!;
      ctx.fillStyle = getComputedStyle(el).backgroundColor;
      ctx.fillRect(0, 0, 1, 1);
      const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
      return `#${[r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("")}`;
    });

    expect(dot).toBe("#2f2be6");
    expect(await colorOf(page, "nav a[aria-current]")).toBe(dot);
  });

  test("leaves inactive links in the neutral ink colour", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      document
        .getElementById("about")!
        .scrollIntoView({ block: "center", behavior: "instant" });
    });

    const inactive = await colorOf(page, "nav ul li:first-child a");
    expect(inactive).not.toBe("#2f2be6");
  });
});

test.describe("Nav — every load starts at the homepage", () => {
  test("drops a deep-link hash and opens at the top", async ({ page }) => {
    await page.goto("/#about");

    expect(await page.evaluate(() => location.hash)).toBe("");
    expect(await page.evaluate(() => window.scrollY)).toBe(0);
  });

  test("returns to the top after a reload from deep in the page", async ({
    page,
  }) => {
    await page.goto("/");
    await page.evaluate(() => {
      document
        .getElementById("contact")!
        .scrollIntoView({ block: "center", behavior: "instant" });
    });
    expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(0);

    await page.reload();
    expect(await page.evaluate(() => window.scrollY)).toBe(0);
  });
});

test.describe("Nav — the mobile menu", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  const openMenu = async (page: Page) => {
    await page.getByRole("button", { name: /open menu/i }).click();
    await expect(page.locator("#mobile-menu")).toBeVisible();
    // The items rise out of masked boxes on a stagger; wait for the last one.
    await expect(page.locator("#mobile-menu a").last()).toBeVisible();
    await page.waitForTimeout(700);
  };

  test("reveals the three sections, numbered", async ({ page }) => {
    await page.goto("/");
    await openMenu(page);

    const panel = page.locator("#mobile-menu");
    for (const [i, label] of ["Work", "About", "Contact"].entries()) {
      await expect(panel.getByRole("link", { name: new RegExp(label, "i") })).toBeVisible();
      await expect(panel).toContainText(`0${i + 1}`);
    }
  });

  test("closes on Escape and hands focus back to the toggle", async ({ page }) => {
    await page.goto("/");
    await openMenu(page);

    await page.keyboard.press("Escape");
    await expect(page.locator("#mobile-menu")).toHaveCount(0);
    // Focus must not be left on <body>, or the next Tab restarts the page.
    const focused = await page.evaluate(() => document.activeElement?.getAttribute("aria-label"));
    expect(focused).toMatch(/menu/i);
  });

  test("keeps tab focus inside the panel", async ({ page }) => {
    await page.goto("/");
    await openMenu(page);

    // Tab well past the number of focusable items; every stop must stay inside.
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press("Tab");
      const inside = await page.evaluate(
        () => !!document.getElementById("mobile-menu")?.contains(document.activeElement),
      );
      expect(inside, `focus escaped on tab ${i + 1}`).toBe(true);
    }
  });

  test("locks the page behind it, and releases on close", async ({ page }) => {
    await page.goto("/");
    await openMenu(page);
    expect(await page.evaluate(() => getComputedStyle(document.body).overflow)).toBe("hidden");

    await page.getByRole("button", { name: /close menu/i }).click();
    await expect(page.locator("#mobile-menu")).toHaveCount(0);
    expect(await page.evaluate(() => getComputedStyle(document.body).overflow)).not.toBe("hidden");
  });

  test("renders every item at full opacity under reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await openMenu(page);

    const faded = await page.$$eval("#mobile-menu a", (els) =>
      els.filter((el) => {
        let n: HTMLElement | null = el as HTMLElement;
        while (n) {
          if (parseFloat(getComputedStyle(n).opacity) < 0.99) return true;
          n = n.parentElement;
        }
        return false;
      }).length,
    );
    expect(faded, "the reveal must not strand items transparent").toBe(0);
  });
});
