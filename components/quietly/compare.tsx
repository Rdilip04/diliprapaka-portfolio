"use client";

import { useState, type CSSProperties } from "react";
import Image from "next/image";

const PHONE_SIZES = "(max-width: 560px) 45vw, 300px";

/* Before sits on top of after, clipped by a real range input, so it works with
   the arrow keys as well as a drag. Phones get the two side by side instead. */
export function Compare({ before, after, beforeAlt, afterAlt }: { before: string; after: string; beforeAlt: string; afterAlt: string }) {
  const [pos, setPos] = useState(50);
  return (
    <div>
      <div className="cmp-tags" aria-hidden="true">
        <span className="tag">Before, 22 October</span>
        <span className="tag now">After</span>
      </div>
      <div className="cmp" style={{ "--pos": `${pos}%` } as CSSProperties}>
        <div className="phone">
          <Image src={after} alt={`After: ${afterAlt}`} fill sizes={PHONE_SIZES} />
          <span className="before-img">
            <Image src={before} alt={`Before: ${beforeAlt}`} fill sizes={PHONE_SIZES} />
          </span>
        </div>
        <span className="handle" aria-hidden="true" />
        <input
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label="Compare before and after. Left shows before, right shows after."
        />
      </div>
      <div className="pair">
        <figure>
          <div className="phone">
            <Image src={before} alt={`Before: ${beforeAlt}`} fill sizes={PHONE_SIZES} />
          </div>
          <figcaption className="foot">Before, 22 October</figcaption>
        </figure>
        <figure>
          <div className="phone">
            <Image src={after} alt={`After: ${afterAlt}`} fill sizes={PHONE_SIZES} />
          </div>
          <figcaption className="foot">After</figcaption>
        </figure>
      </div>
    </div>
  );
}
