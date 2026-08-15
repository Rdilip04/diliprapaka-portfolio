import type { CSSProperties } from "react";

/**
 * Types for the vendored React Bits `TextLoop`. Kept beside the .jsx rather
 * than converting it, so the component source stays byte-identical to
 * upstream and can be re-pulled without re-porting.
 *
 * Colours accept `var(--color-*)` as well as hex, which is how this project
 * feeds it the theme tokens.
 */
export interface TextLoopProps {
  text?: string;
  shape?: "wave" | "circle" | "infinity" | "arch" | "line";
  /** Custom SVG path data in a 1200x520 viewBox. Overrides `shape`. */
  path?: string;
  /** Travel speed along the path, in path units per second. */
  speed?: number;
  direction?: "forward" | "reverse";
  separator?: string;
  /** Wave amplitude, or radius for the closed shapes. */
  curviness?: number;
  fontSize?: number;
  fontWeight?: number;
  letterSpacing?: number;
  uppercase?: boolean;
  color?: string;
  ribbon?: boolean;
  ribbonColor?: string;
  ribbonWidth?: number;
  pauseOnHover?: boolean;
  className?: string;
  style?: CSSProperties;
}

declare const TextLoop: (props: TextLoopProps) => JSX.Element;

export default TextLoop;
