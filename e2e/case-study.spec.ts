import { test, expect, type Page } from "@playwright/test";

const URL = "/work/nextstep";

/** Composite through a canvas — Tailwind emits oklab(… / alpha) that regex parsing mangles. */
const contrastIn = (page: Page, selector: string, surfaceSelector: string) =>
  page.evaluate(
    ([sel, surfSel]) => {
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
      const el = document.querySelector(sel)!;
      const surface = getComputedStyle(
        document.querySelector(surfSel)!,
      ).backgroundColor;
      const isBar = !el.textContent?.trim();
      const fg = isBar
        ? getComputedStyle(el).backgroundColor
        : getComputedStyle(el).color;
      const [hi, lo] = [lum(paint(surface, fg)), lum(paint(surface))].sort(
        (a, b) => b - a,
      );
      return (hi + 0.05) / (lo + 0.05);
    },
    [selector, surfaceSelector] as const,
  );

const toDark = async (page: Page) => {
  await page.getByRole("switch").click();
  await expect(
    page.locator("html"),
  ).toHaveClass(/dark/);
};

test.describe("NextStep case study — structure", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URL);
  });

  test("leads with the project name as the only h1", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("NextStep");
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  });

  test("never skips a heading level", async ({ page }) => {
    const levels = await page.evaluate(() =>
      [...document.querySelectorAll("h1,h2,h3,h4")].map((h) =>
        Number(h.tagName[1]),
      ),
    );
    expect(levels.length).toBeGreaterThan(8);
    for (let i = 1; i < levels.length; i++) {
      expect(levels[i] - levels[i - 1]).toBeLessThanOrEqual(1);
    }
  });

  test("states the outcome above the fold of the second screen", async ({
    page,
  }) => {
    const outcome = page.locator("#outcome");
    await expect(outcome.getByText("1st place", { exact: true })).toBeVisible();
    await expect(outcome.getByText("84.5", { exact: true })).toBeVisible();
  });

  // The site targets UK roles, so US spelling reads as carelessness.
  for (const route of ["/", URL]) {
    test(`uses UK spelling throughout ${route}`, async ({ page }) => {
      await page.goto(route);
      const text = await page.evaluate(() => document.body.innerText);
      // \btoward\b does not match "towards" — the trailing s is a word char.
      const american = [
        /\butiliz/i,
        /\borganiz/i,
        /\brecogniz/i,
        /\banalyz/i,
        /\bsynthesiz/i,
        /\bprioritiz/i,
        /\bspecializ/i,
        /\bcolors?\b/i,
        /\bbehaviors?\b/i,
        /\btoward\b/i,
        /\blabeled\b/i,
        /\bfulfill\b/i,
      ];
      expect(american.filter((re) => re.test(text)).map(String)).toEqual([]);
    });
  }

  test("names the sample skew instead of leaving it to be spotted", async ({
    page,
  }) => {
    await page.goto(URL);
    await expect(page.locator("#testing")).toContainText(
      "Three of the five participants were clinicians",
    );
    await expect(page.locator("#testing")).toContainText(
      "we never directly addressed the comprehension finding",
    );
  });

  test("reports SUS as a score, never as a percentage", async ({ page }) => {
    // SUS runs 0–100 but is not a percentage; "84.5%" reads as a factual error.
    await expect(page.locator("body")).not.toContainText("84.5%");
    await expect(page.locator("body")).not.toContainText("68%");
  });
});

test.describe("NextStep case study — framing", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URL);
  });

  test("numbers its sections in an unbroken sequence", async ({ page }) => {
    const nums = await page.evaluate(() =>
      [...document.querySelectorAll("p")]
        .map((p) => /^(\d{2}) — /.exec(p.textContent?.trim() ?? "")?.[1])
        .filter((n): n is string => Boolean(n))
        .map(Number),
    );
    expect(nums).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });

  test("says what constrained the project", async ({ page }) => {
    const body = page.locator("body");
    await expect(body).toContainText("No patient access until round two");
    await expect(body).toContainText("A concept, not a commission");
  });

  test("traces every How Might We back to a finding stated in the research", async ({
    page,
  }) => {
    const { froms, findings } = await page.evaluate(() => ({
      froms: [...document.querySelectorAll("p")]
        .map((p) => p.textContent?.trim() ?? "")
        .filter((t) => t.startsWith("From — "))
        .map((t) => t.replace("From — ", "")),
      findings: [...document.querySelectorAll("h3")].map(
        (h) => h.textContent?.trim() ?? "",
      ),
    }));

    expect(froms.length).toBeGreaterThan(0);
    // An HMW citing a finding the page never states is an unsupported leap.
    for (const from of froms) expect(findings).toContain(from);
  });

  test("shows a considered-and-rejected alternative for each core flow", async ({
    page,
  }) => {
    // The rejected options are what separate a design decision from a layout.
    const body = page.locator("body");
    await expect(body).toContainText("An earlier version led with recovery progress");
    await expect(body).toContainText("flick through exercises like Tinder");
    await expect(body).toContainText("Hand mobility recovery");
  });

  test("states the community insight once, at the top of the outcome", async ({
    page,
  }) => {
    const hits = await page.evaluate(
      () =>
        (document.body.innerText.match(/needs more trust-building/g) || [])
          .length,
    );
    // It was moved up, not copied — repeating it would read as padding.
    expect(hits).toBe(1);
  });

  test("marks the unordered lists with decorative icons, not numbers", async ({
    page,
  }) => {
    const marks = await page.evaluate(() =>
      [...document.querySelectorAll("ol > li")].map((li) => ({
        icon: Boolean(li.querySelector("svg")),
        hidden: li.querySelector("svg")?.getAttribute("aria-hidden") ?? null,
        stroke: li.querySelector("svg")?.getAttribute("stroke-width") ?? null,
        size: li.querySelector("svg")?.getBoundingClientRect().width ?? 0,
      })),
    );

    const icons = marks.filter((m) => m.icon);
    // Constraints (3) + visual system (5). Findings stay numbered.
    expect(icons).toHaveLength(8);
    for (const i of icons) {
      // Decorative: the term beside it already carries the meaning.
      expect(i.hidden).toBe("true");
      // Same icon language as Approach.tsx and ThemeToggle.
      expect(i.stroke).toBe("1.5");
      expect(Math.round(i.size)).toBe(18);
    }
  });

  test("admits the finding it did not answer", async ({ page }) => {
    await expect(page.locator("body")).toContainText(
      "It is not answered here.",
    );
  });
});

test.describe("NextStep case study — image placeholders", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URL);
  });

  test("reserves space for every pending image so uploads cannot shift the page", async ({
    page,
  }) => {
    const boxes = await page.evaluate(() =>
      [...document.querySelectorAll("figure div")]
        .filter((d) => d.className.includes("aspect-"))
        .map((d) => ({
          ratio: getComputedStyle(d).aspectRatio,
          height: d.getBoundingClientRect().height,
        })),
    );

    expect(boxes.length).toBeGreaterThan(5);
    for (const box of boxes) {
      expect(box.ratio).not.toBe("auto");
      expect(box.height).toBeGreaterThan(0);
    }
  });

  test("is either a real image with alt text, or a labelled placeholder", async ({
    page,
  }) => {
    // Must hold in all three states: every slot empty, some filled, all filled.
    // A filled Figure drops its label on purpose — the image replaces it — so
    // asserting "every figure has text" would break on the first upload.
    const figures = await page.evaluate(() =>
      [...document.querySelectorAll("figure")].map((f) => {
        const img = f.querySelector("img");
        return {
          filled: Boolean(img),
          alt: img?.getAttribute("alt") ?? "",
          text: f.textContent?.trim() ?? "",
        };
      }),
    );

    expect(figures.length).toBeGreaterThan(5);
    for (const fig of figures) {
      if (fig.filled) expect(fig.alt.length).toBeGreaterThan(0);
      else expect(fig.text.length).toBeGreaterThan(0);
    }
  });

  test("keeps a phone mockup near handset proportions, not viewport-tall", async ({
    page,
  }) => {
    const tallest = await page.evaluate(() =>
      Math.max(
        ...[...document.querySelectorAll("figure div")]
          .filter((d) => d.className.includes("aspect-"))
          .map((d) => d.getBoundingClientRect().height),
      ),
    );
    // Nothing should exceed a comfortable desktop viewport height.
    expect(tallest).toBeLessThan(700);
  });
});

test.describe("NextStep case study — navigation", () => {
  test("points the nav back at the home document from a sub-route", async ({
    page,
  }) => {
    await page.goto(URL);
    const hrefs = await page
      .getByRole("navigation", { name: "Primary" })
      .getByRole("link")
      .evaluateAll((els) => els.map((e) => e.getAttribute("href")));

    expect(hrefs).toContain("/#work");
    expect(hrefs).not.toContain("#work");
  });

  test("returns to the work index from the back link", async ({ page }) => {
    await page.goto(URL);
    await page.getByRole("link", { name: "← All work" }).click();
    await expect(page).toHaveURL(/\/#work$/);
    await expect(page.locator("#work")).toBeVisible();
  });

  test("is reachable from the work index", async ({ page }) => {
    await page.goto("/");
    // No manual scroll — click() auto-scrolls, and scrolling first raced the
    // whileInView reveals and detached the node.
    await page.getByRole("link", { name: /NextStep/ }).first().click();
    await expect(page).toHaveURL(/\/work\/nextstep$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("NextStep");
  });
});

test.describe("NextStep case study — readability", () => {
  for (const theme of ["light", "dark"] as const) {
    test(`keeps body copy and data marks legible in ${theme} mode`, async ({
      page,
    }) => {
      await page.goto(URL);
      if (theme === "dark") await toDark(page);

      const body = await contrastIn(page, "#screens p", "#screens");
      expect(body, `body copy in ${theme} is ${body.toFixed(2)}:1`).toBeGreaterThanOrEqual(4.5);

      const eyebrow = await contrastIn(page, "#screens .font-mono", "#screens");
      expect(eyebrow, `eyebrow in ${theme} is ${eyebrow.toFixed(2)}:1`).toBeGreaterThanOrEqual(4.5);

      // Data marks carry a 3:1 floor, not 4.5:1 — they are graphics, not text.
      const bar = await contrastIn(
        page,
        "#testing li span[aria-hidden] > span",
        "#testing",
      );
      expect(bar, `SUS bar in ${theme} is ${bar.toFixed(2)}:1`).toBeGreaterThanOrEqual(3);
    });
  }

  test("prints every SUS score as text, so the bars are not the only encoding", async ({
    page,
  }) => {
    await page.goto(URL);
    const region = page.locator("#testing");
    for (const score of ["90", "77.5", "95", "65", "84.5"]) {
      await expect(region.getByText(score, { exact: true }).first()).toBeVisible();
    }
  });

  test("holds the reading column to a sane measure", async ({ page }) => {
    await page.goto(URL);
    // Body copy only — mono eyebrows are short labels whose box width says
    // nothing about line length.
    const widest = await page.evaluate(() =>
      Math.max(
        ...[
          ...document.querySelectorAll(
            "#screens p.font-sans, #testing p.font-sans",
          ),
        ].map((p) => p.getBoundingClientRect().width),
      ),
    );
    // ~680px is roughly 75 characters of 16px Inter — the upper bound before
    // the eye starts losing the line return.
    expect(widest).toBeLessThanOrEqual(680);
  });
});

test.describe("NextStep case study — mobile", () => {
  test("fits 375px without horizontal scroll", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(URL);

    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
});
