"use client";

import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { Icon } from "./icon";

type Night = "q" | "l" | "d";

// The same sample month as the Nights screen: 14 quiet evenings, 3 late nights,
// 1 night without data, and tonight is the 19th. October starts on a Wednesday,
// matching the screens' other dates.
const NIGHTS: Record<number, Night> = { 1: "q", 2: "l", 3: "q", 4: "q", 5: "l", 6: "q", 7: "q", 8: "q", 9: "d", 10: "q", 11: "q", 12: "q", 13: "q", 14: "q", 15: "q", 16: "l", 17: "q", 18: "q" };
const DAY = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const LEAD = 2;
const TONIGHT = 19;
const SAID: Record<Night, string> = { q: "quiet evening", l: "late night", d: "no Screen Time data" };
const RECORDED = Object.keys(NIGHTS).map(Number);
const dayName = (d: number) => DAY[(LEAD + d - 1) % 7];

function Mark({ night }: { night?: Night }) {
  if (night === "q") return <Icon name="moon-fill" />;
  if (night === "l") return <Icon name="moon-bold" />;
  if (night === "d") return <span className="mo-dash" aria-hidden="true" />;
  return <span className="mo-blank" aria-hidden="true" />;
}

function SheetBody({ d }: { d: number }) {
  const night = NIGHTS[d];
  const next = `${dayName(d + 1)} morning`;
  const [icon, tone, foot, rowLabel, rowValue, morning] =
    night === "l"
      ? (["moon-bold", "l", "A late night. Nothing was lost.", "Counted apps after 10:30 pm", "Over 10 min", "Nothing new grew. The grove kept everything."] as const)
      : night === "d"
        ? (["minus-bold", "l", "No Screen Time data. This night counts neither way.", "iOS didn't report this night", "No data", "The grove stayed as it was."] as const)
        : (["moon-fill", "q", "A quiet evening.", "Counted apps after 10:30 pm", "Under 10 min", "New shoots came up while you slept."] as const);
  return (
    <>
      <div className="sheet-head">
        <Icon name={icon} className={tone} />
        <div>
          <h3 id="sheetTitle">{dayName(d)} {d} October</h3>
          <p className="s-foot">{foot}</p>
        </div>
      </div>
      <div className="s-rows">
        <div><span>After bedtime<small>{rowLabel}</small></span><em>{rowValue}</em></div>
        <div><span>{next}<small>{morning}</small></span></div>
      </div>
    </>
  );
}

/* The Nights tab, live: one tab stop for the month, arrow keys between nights,
   and a sheet that rises on the default spring. Drag it down, press Escape or
   Done to close it; focus returns to the night that opened it. */
export function NightsMonth() {
  const [open, setOpen] = useState<number | null>(null);
  // The last night shown stays in the sheet while it slides away
  const [shown, setShown] = useState(16);
  const [current, setCurrent] = useState(RECORDED[RECORDED.length - 1]);
  const nights = useRef<Record<number, HTMLButtonElement | null>>({});
  const done = useRef<HTMLButtonElement>(null);
  const drag = useRef<number | null>(null);

  const show = (d: number) => {
    setCurrent(d);
    setShown(d);
    setOpen(d);
    requestAnimationFrame(() => done.current?.focus({ preventScroll: true }));
  };
  const close = () => {
    if (open === null) return;
    const d = open;
    setOpen(null);
    // The month is inert until this render lands, so focus moves on the next frame.
    requestAnimationFrame(() => nights.current[d]?.focus({ preventScroll: true }));
  };

  const onGridKey = (e: KeyboardEvent) => {
    const step = ({ ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 } as Record<string, number>)[e.key];
    let next: number | undefined;
    if (step) {
      for (let k = current + step; k >= 1 && k <= 31 && next === undefined; k += step) if (NIGHTS[k]) next = k;
      if (next === undefined && Math.abs(step) === 7) next = step > 0 ? RECORDED[RECORDED.length - 1] : RECORDED[0];
    }
    if (e.key === "Home") next = RECORDED[0];
    if (e.key === "End") next = RECORDED[RECORDED.length - 1];
    if (next !== undefined) {
      e.preventDefault();
      setCurrent(next);
      nights.current[next]?.focus();
    }
  };

  const onSheetKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") close();
    if (e.key === "Tab") { e.preventDefault(); done.current?.focus(); }
  };
  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("button")) return;
    drag.current = e.clientY;
    e.currentTarget.style.transition = "none";
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (drag.current === null) return;
    e.currentTarget.style.transform = `translateY(${Math.max(0, e.clientY - drag.current)}px)`;
  };
  const onUp = (e: PointerEvent<HTMLDivElement>) => {
    if (drag.current === null) return;
    const dy = e.clientY - drag.current;
    drag.current = null;
    e.currentTarget.style.transition = "";
    e.currentTarget.style.transform = "";
    if (dy > 80) close();
  };

  return (
    <div className={`device${open !== null ? " open" : ""}`}>
      <div className="lt">Nights</div>
      <p className="sub">Mostly quiet this week, with one late night on Thursday.</p>
      <div className="mo glass-thin" inert={open !== null}>
        <div className="mo-head"><b>October</b><span>14 quiet evenings</span></div>
        <div className="mo-grid" role="group" aria-label="October. Arrow keys move between nights" onKeyDown={onGridKey}>
          {["M", "T", "W", "T", "F", "S", "S"].map((x, i) => <small key={i} aria-hidden="true">{x}</small>)}
          {Array.from({ length: LEAD }, (_, i) => <div key={`lead${i}`} />)}
          {Array.from({ length: 31 }, (_, i) => {
            const d = i + 1;
            const night = NIGHTS[d];
            const label = `${dayName(d)} ${d} October${night ? `, ${SAID[night]}` : d === TONIGHT ? ", tonight" : ""}`;
            const cls = `mo-n${night ? ` mo-${night}` : ""}${d === TONIGHT ? " tonight" : ""}`;
            return night ? (
              <button
                key={d}
                ref={(el) => { nights.current[d] = el; }}
                type="button"
                className={cls}
                tabIndex={d === current ? 0 : -1}
                aria-label={label}
                aria-haspopup="dialog"
                aria-expanded={open === d}
                onClick={() => show(d)}
              >
                <Mark night={night} />
                <span aria-hidden="true">{d}</span>
              </button>
            ) : (
              <div key={d} className={cls} role="img" aria-label={label}>
                <Mark />
                <span aria-hidden="true">{d}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="mo-legend" aria-hidden="true">
        <span><Icon name="moon-fill" className="mo-q-key" />Quiet</span>
        <span><Icon name="moon-bold" className="mo-l-key" />Late</span>
        <span><span className="mo-dash" />No data</span>
      </div>
      <div className="dim" onClick={close} />
      <div
        className="sheet glass-thick"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sheetTitle"
        onKeyDown={onSheetKey}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        <div className="grabber" aria-hidden="true" />
        <SheetBody d={shown} />
        <button className="btn quiet" type="button" ref={done} onClick={close}>Done</button>
      </div>
    </div>
  );
}
