import { describe, expect, it } from "vitest";
import {
  composite,
  contrastRatio,
  parseHex,
  relativeLuminance,
} from "./contrast";

describe("parseHex", () => {
  it("expands three-digit shorthand", () => {
    expect(parseHex("#fff")).toEqual([255, 255, 255]);
    expect(parseHex("#000")).toEqual([0, 0, 0]);
  });

  it("accepts a leading hash or none", () => {
    expect(parseHex("14181f")).toEqual(parseHex("#14181f"));
  });

  it("rejects anything that is not a hex colour", () => {
    expect(() => parseHex("rebeccapurple")).toThrow(/Not a hex colour/);
  });
});

describe("relativeLuminance", () => {
  it("anchors black at 0 and white at 1", () => {
    expect(relativeLuminance([0, 0, 0])).toBeCloseTo(0, 5);
    expect(relativeLuminance([255, 255, 255])).toBeCloseTo(1, 5);
  });
});

describe("contrastRatio", () => {
  // Reference values published in the WCAG 2.1 understanding docs.
  it("gives 21:1 for black on white", () => {
    expect(contrastRatio(parseHex("#000000"), parseHex("#ffffff"))).toBeCloseTo(
      21,
      4,
    );
  });

  it("gives 1:1 for a colour against itself", () => {
    expect(contrastRatio(parseHex("#4a7ebb"), parseHex("#4a7ebb"))).toBeCloseTo(
      1,
      5,
    );
  });

  it("puts #767676 on white just over the 4.5:1 AA threshold", () => {
    expect(contrastRatio(parseHex("#767676"), parseHex("#ffffff"))).toBeCloseTo(
      4.54,
      2,
    );
  });

  it("puts #949494 on white below the AA threshold", () => {
    expect(
      contrastRatio(parseHex("#949494"), parseHex("#ffffff")),
    ).toBeLessThan(4.5);
  });

  it("is order-independent", () => {
    const a = parseHex("#14181f");
    const b = parseHex("#f4f4f2");
    expect(contrastRatio(a, b)).toBeCloseTo(contrastRatio(b, a), 10);
  });
});

describe("composite", () => {
  it("returns the foreground at full alpha", () => {
    expect(composite([20, 24, 31], [244, 244, 242], 1)).toEqual([20, 24, 31]);
  });

  it("returns the background at zero alpha", () => {
    expect(composite([20, 24, 31], [244, 244, 242], 0)).toEqual([
      244, 244, 242,
    ]);
  });

  it("lands halfway at 50% alpha", () => {
    expect(composite([0, 0, 0], [255, 255, 255], 0.5)).toEqual([
      127.5, 127.5, 127.5,
    ]);
  });
});
