import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import {
  AA_NORMAL_TEXT,
  composite,
  contrastRatio,
  parseHex,
} from "@/lib/contrast";
import About from "./About";

describe("About", () => {
  it("exposes the #about anchor the nav links to", () => {
    const { container } = render(<About />);
    expect(container.querySelector("section#about")).toBeInTheDocument();
  });

  it("states the positioning line without repeating 'design'", () => {
    render(<About />);

    const statement = screen.getByText(/I craft/);
    expect(statement.textContent?.replace(/\s+/g, " ").trim()).toBe(
      "I craft simple, thoughtful digital experiences with a strong focus on " +
        "clarity, usability, and long-term value across mobile and web.",
    );
    expect(
      within(statement).getByText("simple, thoughtful digital experiences"),
    ).toBeInTheDocument();
    expect(screen.queryByText(/designing mobile apps/i)).not.toBeInTheDocument();
  });

  it("pairs each block heading with its description", () => {
    render(<About />);

    for (const heading of ["Background", "Beyond work"]) {
      const term = screen.getByText(heading);
      expect(term.tagName).toBe("DT");

      const description = term.parentElement?.querySelector("dd");
      expect(description).toBeInTheDocument();
      expect(description).not.toBeEmptyDOMElement();
    }
  });

  it("offers the CV as a download without announcing the decorative arrow", () => {
    render(<About />);

    const link = screen.getByRole("link", { name: "Download Resume (PDF)" });
    expect(link).toHaveAttribute("href", "/Dilip-Rapaka-CV.pdf");
    expect(link).toHaveAttribute("download");
  });

  it("places the CV link at the end of the reading path, after the last block", () => {
    const { container } = render(<About />);

    const link = screen.getByRole("link", { name: "Download Resume (PDF)" });
    const identity = screen.getByRole("heading", { name: "About" }).parentElement;
    const dl = container.querySelector("dl")!;

    // Not in the left identity rail — that made the eye jump back across the
    // page after it had finished reading.
    expect(identity?.contains(link)).toBe(false);
    expect(dl.contains(link)).toBe(false);
    expect(
      dl.compareDocumentPosition(link) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it("describes the background without narrowing him to one sector", () => {
    render(<About />);

    const background = screen.getByText(/MSc UX Design/);
    expect(background.textContent).toContain("complex, data-rich digital environments");
    expect(background.textContent).not.toMatch(/healthcare/i);
  });
});

describe("About — colour contrast", () => {
  // Resolve the real tokens rather than copying hex values, so retuning a
  // token in globals.css is re-checked here instead of silently diverging.
  const css = readFileSync(resolve(process.cwd(), "app/globals.css"), "utf8");

  const token = (name: string) => {
    const match = css.match(new RegExp(`--color-${name}:\\s*(#[0-9a-fA-F]{3,6})`));
    if (!match) throw new Error(`Token --color-${name} not found in globals.css`);
    return parseHex(match[1]);
  };

  const ink = token("ink");
  const canvas = token("canvas");

  const inkTextElements = () => {
    const { container } = render(<About />);
    const section = container.querySelector("section#about");
    expect(section?.className).toContain("bg-canvas");

    return [...container.querySelectorAll<HTMLElement>('[class*="text-ink"]')]
      .map((el) => {
        const match = el.className.match(/text-ink(?:\/(\d+))?(?:\s|$)/);
        if (!match) return null;
        const alpha = match[1] ? Number(match[1]) / 100 : 1;
        return { el, alpha, label: el.textContent?.trim().slice(0, 40) ?? "" };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);
  };

  it("finds ink-coloured text to check", () => {
    expect(inkTextElements().length).toBeGreaterThan(0);
  });

  it("renders every ink text element at AA against the canvas background", () => {
    const failures = inkTextElements()
      .map(({ alpha, label }) => ({
        label,
        alpha,
        ratio: contrastRatio(composite(ink, canvas, alpha), canvas),
      }))
      .filter(({ ratio }) => ratio < AA_NORMAL_TEXT);

    expect(failures).toEqual([]);
  });

  it("keeps the block labels above AA — the old meta label regressed to 3.32:1 at ink/50", () => {
    const { container } = render(<About />);
    const meta = container.querySelector<HTMLElement>("dt");
    expect(meta).toHaveTextContent("Background");

    const alpha = Number(meta?.className.match(/text-ink\/(\d+)/)?.[1]) / 100;
    expect(
      contrastRatio(composite(ink, canvas, alpha), canvas),
    ).toBeGreaterThanOrEqual(AA_NORMAL_TEXT);
  });
});
