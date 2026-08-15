import type { CSSProperties, Key, ReactNode } from "react";

/**
 * Types for the vendored React Bits `LogoLoop`. Kept beside the .jsx rather
 * than converting it, so the component source stays byte-identical to upstream
 * and can be re-pulled without re-porting. Same arrangement as `text-loop`.
 */
export type LogoItem =
  | {
      node: ReactNode;
      title?: string;
      href?: string;
      ariaLabel?: string;
    }
  | {
      src: string;
      alt?: string;
      title?: string;
      href?: string;
      srcSet?: string;
      sizes?: string;
      width?: number;
      height?: number;
    };

export interface LogoLoopProps {
  logos: LogoItem[];
  /** Pixels per second. */
  speed?: number;
  direction?: "left" | "right" | "up" | "down";
  width?: number | string;
  logoHeight?: number;
  gap?: number;
  pauseOnHover?: boolean;
  /** Speed while hovered. 0 pauses; a lower number decelerates. */
  hoverSpeed?: number;
  fadeOut?: boolean;
  /** Accepts `var(--color-*)`, which is how this project passes theme tokens. */
  fadeOutColor?: string;
  scaleOnHover?: boolean;
  renderItem?: (item: LogoItem, key: Key) => ReactNode;
  ariaLabel?: string;
  className?: string;
  style?: CSSProperties;
}

export declare const LogoLoop: (props: LogoLoopProps) => JSX.Element;

export default LogoLoop;
