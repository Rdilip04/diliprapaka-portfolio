"use client";

import { useState, type CSSProperties } from "react";
import Image from "next/image";
import { Icon } from "./icon";

/* What iOS lets Quietly know: the person sees minutes in Apple's sealed report,
   the app's code only hears that the 10 minute line was crossed. */
export function Thresholds() {
  const [mins, setMins] = useState(4);
  const crossed = mins >= 10;
  return (
    <div className="demo mt-32">
      <div className="demo-label">
        <label htmlFor="mins">Minutes on counted apps after 10:30 pm</label>
        <output htmlFor="mins">{mins}</output>
      </div>
      <input
        className="slider"
        id="mins"
        type="range"
        min={0}
        max={30}
        step={1}
        value={mins}
        onChange={(e) => setMins(Number(e.target.value))}
        style={{ "--fill": `${(mins / 30) * 100}%` } as CSSProperties}
      />
      <div className="scale" aria-hidden="true">
        <span style={{ left: 0, translate: "0 0" }}>0</span>
        <span className="line" style={{ left: "33.33%" }}>10 min line</span>
        <span style={{ left: "100%", translate: "-100% 0" }}>30</span>
      </div>
      <div className="views" aria-live="polite">
        <div className="view">
          <p className="view-label"><Icon name="user-bold" />You see, in Apple&apos;s report</p>
          <div className="big">{mins} min</div>
        </div>
        <div className={`view${crossed ? " crossed" : ""}`}>
          <p className="view-label"><Icon name="code-bold" />Quietly&apos;s code learns</p>
          <p className="msg">
            {crossed
              ? "The 10 minute threshold was crossed. Tonight's new shoots will wait for tomorrow."
              : "Nothing yet. Tonight is still quiet."}
          </p>
        </div>
      </div>
    </div>
  );
}

const MORNINGS = [
  {
    label: "After a quiet night",
    src: "/quietly/screens/first-light.webp",
    alt: "First light: A quiet night. Two new shoots came up while you slept.",
    note: "First light, new shoots, Nori awake. The weather changes over 2.4 seconds, the time the world takes in the app.",
  },
  {
    label: "After a late night",
    src: "/quietly/screens/the-morning-after-a-late-night.webp",
    alt: "The morning after a late night: A late night. The grove kept everything it had.",
    note: "The same grove as yesterday, in a soft morning. Nothing grew, and nothing went.",
  },
];

export function WeatherSwitch() {
  const [on, setOn] = useState(0);
  return (
    <div className="weather">
      <div className="seg" data-on={on} role="group" aria-label="Which morning to show">
        <span className="knob" aria-hidden="true" />
        {MORNINGS.map((m, i) => (
          <button key={m.label} type="button" aria-pressed={on === i} onClick={() => setOn(i)}>
            {m.label}
          </button>
        ))}
      </div>
      <div className="phone">
        {MORNINGS.map((m, i) => (
          <Image key={m.src} src={m.src} alt={m.alt} fill sizes="320px" className={on === i ? undefined : "off"} />
        ))}
      </div>
      <div className="weather-note" aria-live="polite">
        <p key={on} className="foot">{MORNINGS[on].note}</p>
      </div>
    </div>
  );
}
