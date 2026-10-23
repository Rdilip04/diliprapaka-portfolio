"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { Icon } from "./icon";

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

/* Plays muted on its own while it is mostly on screen, with pause and sound
   always visible. Under Reduce Motion it waits on the still until asked. */
export function Film() {
  const video = useRef<HTMLVideoElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const userPaused = useRef(false);
  const reduce = useReducedMotion();
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [time, setTime] = useState({ now: 0, total: 60 });

  useEffect(() => {
    const v = video.current;
    const f = frame.current;
    if (!v || !f || reduce) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.intersectionRatio > 0.5 && v.paused && !userPaused.current) v.play().catch(() => {});
        else if (e.intersectionRatio < 0.2 && !v.paused) v.pause();
      },
      { threshold: [0, 0.2, 0.5, 1] },
    );
    io.observe(f);
    return () => io.disconnect();
  }, [reduce]);

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    userPaused.current = !v.paused;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };

  const toggleSound = () => {
    const v = video.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    if (!v.muted && v.paused) v.play().catch(() => {});
  };

  return (
    <figure>
      <div className={`film-frame${playing ? " playing" : ""}`} ref={frame}>
        <video
          ref={video}
          playsInline
          muted
          loop
          preload="metadata"
          poster="/quietly/film-poster.webp"
          aria-label="Quietly launch film, 60 seconds, with a voice-over and captions"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onTimeUpdate={(e) => setTime({ now: e.currentTarget.currentTime, total: e.currentTarget.duration || 60 })}
        >
          <source src="/quietly/film.mp4" type="video/mp4" />
        </video>
        {/* eslint-disable-next-line @next/next/no-img-element -- the poster has to sit exactly under the video, fading as it plays */}
        <img
          src="/quietly/film-poster.webp"
          alt="A frame from the film: the grove at first light on an iPhone, with the caption: Quiet night. A quiet night grows the grove by morning."
        />
        <div className="film-bar glass-thin">
          <button className="icon-btn gold" type="button" onClick={toggle} aria-label={playing ? "Pause the film" : "Play the film"}>
            <Icon name={playing ? "pause-fill" : "play-fill"} />
          </button>
          <button className="icon-btn" type="button" onClick={toggleSound} aria-pressed={!muted} aria-label={muted ? "Turn sound on" : "Turn sound off"}>
            <Icon name={muted ? "speaker-slash-bold" : "speaker-high-bold"} />
          </button>
          <div className="film-track" aria-hidden="true">
            <i style={{ width: `${(time.now / time.total) * 100}%` }} />
          </div>
          <span className="film-time" aria-hidden="true">
            {fmt(time.now)} / {fmt(time.total)}
          </span>
        </div>
      </div>
      <figcaption className="foot film-note">
        The 60 second launch film, made in Remotion from the same design system as the screens. The captions repeat the
        voice-over word for word.
      </figcaption>
    </figure>
  );
}
