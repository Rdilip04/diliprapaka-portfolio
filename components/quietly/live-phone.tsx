"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "motion/react";
import { Icon } from "./icon";

/* A screen that plays its moment from the launch film. Mouse hover or keyboard
   focus plays it once and holds the last frame; leaving rewinds. A tap or Enter
   toggles. Under Reduce Motion nothing plays until it is asked to. */
export function LivePhone({ clip, label, sizes }: { clip: string; label: string; sizes: string }) {
  const video = useRef<HTMLVideoElement>(null);
  const lastPointer = useRef("mouse");
  const reduce = useReducedMotion();
  const [loaded, setLoaded] = useState(false);
  const [playing, setPlaying] = useState(false);

  const play = () => {
    setLoaded(true);
    // The video element mounts on the first play; wait a frame for it.
    requestAnimationFrame(() => {
      const v = video.current;
      if (!v) return;
      v.currentTime = 0;
      v.play().then(() => setPlaying(true)).catch(() => {});
    });
  };
  const stop = () => {
    setPlaying(false);
    window.setTimeout(() => {
      const v = video.current;
      if (v && v.paused === false) v.pause();
      if (v) v.currentTime = 0;
    }, 260);
  };

  return (
    <button
      type="button"
      className={`phone live${playing ? " playing" : ""}`}
      aria-label={`Play: ${label}`}
      aria-pressed={playing}
      onPointerEnter={(e) => { if (e.pointerType === "mouse" && !reduce) play(); }}
      onPointerLeave={(e) => { if (e.pointerType === "mouse" && !reduce) stop(); }}
      onPointerDown={(e) => { lastPointer.current = e.pointerType; }}
      onFocus={(e) => { if (!reduce && e.currentTarget.matches(":focus-visible")) play(); }}
      onBlur={stop}
      onClick={() => {
        const fromMouse = lastPointer.current === "mouse" && !reduce;
        lastPointer.current = "";
        if (fromMouse || !playing) play();
        else stop();
      }}
    >
      <Image src={`${clip}.webp`} alt={label} fill sizes={sizes} />
      {loaded && <video ref={video} src={`${clip}.mp4`} muted playsInline preload="auto" aria-hidden="true" />}
      <span className="live-hint" aria-hidden="true">
        <Icon name="play-fill" />
      </span>
    </button>
  );
}
