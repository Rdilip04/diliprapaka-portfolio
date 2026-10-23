"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useReducedMotion } from "motion/react";
import { nori, seed } from "@/lib/quietly/art";
import { Icon, type IconName } from "./icon";

const GLOW = "#8EF0D6";

export function PressDemo() {
  const [started, setStarted] = useState(false);
  return (
    <div className="stage">
      <button className="btn demo-press" type="button" onClick={() => setStarted((s) => !s)}>
        {started ? "Break started" : "Start a break"}
      </button>
    </div>
  );
}

const BREAKS: { id: string; label: string; icon: IconName }[] = [
  { id: "30 minutes", label: "30 minutes", icon: "timer-bold" },
  { id: "until morning", label: "Until morning", icon: "moon-stars-bold" },
  { id: "1 hour", label: "1 hour", icon: "timer-bold" },
  { id: "custom", label: "Custom", icon: "sliders-horizontal-bold" },
];
const toastTitle = (id: string) =>
  id === "until morning" ? "Started a break until 7:00 am." : id === "custom" ? "Started a custom break." : `Started a ${id === "30 minutes" ? "30-minute" : "1-hour"} break.`;

/* After bedtime a tap means Until morning, with Undo for 5 seconds. Holding
   (0.5 s here) or Shift and Enter opens the menu, which grows from the button. */
export function BreakDemo() {
  const [menu, setMenu] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [down, setDown] = useState(false);
  const [run, setRun] = useState(0);
  const btn = useRef<HTMLButtonElement>(null);
  const items = useRef<(HTMLButtonElement | null)[]>([]);
  const hold = useRef<number | undefined>(undefined);
  const held = useRef(false);
  const toastTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => { window.clearTimeout(hold.current); window.clearTimeout(toastTimer.current); }, []);
  useEffect(() => {
    if (!menu) return;
    const outside = (e: globalThis.PointerEvent) => { if (!(e.target as HTMLElement).closest(".break-wrap")) setMenu(false); };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [menu]);

  const openMenu = () => { setMenu(true); requestAnimationFrame(() => items.current[0]?.focus()); };
  const closeMenu = (focusBtn = true) => { setMenu(false); if (focusBtn) btn.current?.focus(); };
  const showToast = (id: string) => {
    setToast(toastTitle(id));
    setRun((r) => r + 1);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 5000);
  };
  const onMenuKey = (e: KeyboardEvent) => {
    const i = items.current.findIndex((el) => el === document.activeElement);
    if (e.key === "Escape") { e.preventDefault(); closeMenu(); }
    if (e.key === "ArrowDown") { e.preventDefault(); items.current[(i + 1) % BREAKS.length]?.focus(); }
    if (e.key === "ArrowUp") { e.preventDefault(); items.current[(i - 1 + BREAKS.length) % BREAKS.length]?.focus(); }
  };

  return (
    <div className="stage">
      <div className={`toast glass-thick${toast ? " show" : ""}`} role="status" aria-hidden={!toast}>
        <Icon name="moon-stars-fill" />
        <p><b>{toast ?? "Started a break until 7:00 am."}</b>Nori is asleep. Your phone can rest too.</p>
        <button className="undo" type="button" tabIndex={toast ? 0 : -1} onClick={() => { window.clearTimeout(toastTimer.current); setToast(null); btn.current?.focus(); }}>
          Undo
        </button>
        <span className="bar" aria-hidden="true">
          <i key={run} className={toast ? "running" : undefined} />
        </span>
      </div>
      <div className="break-wrap">
        <div className={`menu glass-thick${menu ? " open" : ""}`} role="menu" aria-label="Choose a break" onKeyDown={onMenuKey}>
          {BREAKS.map((b, i) => (
            <button
              key={b.id}
              ref={(el) => { items.current[i] = el; }}
              role="menuitem"
              type="button"
              onClick={() => { closeMenu(); showToast(b.id); }}
            >
              <Icon name={b.icon} />
              {b.label}
            </button>
          ))}
        </div>
        <button
          ref={btn}
          className={`break-btn${down ? " down" : ""}`}
          type="button"
          aria-label="Take a break. Hold, or press Shift and Enter, for more choices"
          aria-haspopup="menu"
          aria-expanded={menu}
          onPointerDown={(e) => {
            if (e.button !== 0) return;
            held.current = false;
            setDown(true);
            hold.current = window.setTimeout(() => { held.current = true; setDown(false); navigator.vibrate?.(10); openMenu(); }, 500);
          }}
          onPointerUp={() => { window.clearTimeout(hold.current); setDown(false); }}
          onPointerLeave={() => { window.clearTimeout(hold.current); setDown(false); }}
          onPointerCancel={() => { window.clearTimeout(hold.current); setDown(false); }}
          onContextMenu={(e) => e.preventDefault()}
          onKeyDown={(e) => { if (e.key === "ArrowUp") { e.preventDefault(); openMenu(); } }}
          onClick={(e) => {
            if (held.current) { held.current = false; return; }
            if (e.shiftKey) { openMenu(); return; }
            closeMenu(false);
            showToast("until morning");
          }}
        >
          <Icon name="moon-stars-fill" />
        </button>
      </div>
    </div>
  );
}

const HOLD = 2400;
const RING = 301.6;

/* Hold for about 2.5 seconds. Letting go early lets the crack close again. */
export function HatchDemo({ seedSvg, noriSvg }: { seedSvg: string; noriSvg: string }) {
  const reduce = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const [holding, setHolding] = useState(false);
  const [done, setDone] = useState(false);
  const [art, setArt] = useState(seedSvg);
  const live = useRef({ p: 0, holding: false, last: 0, raf: 0 });

  useEffect(() => () => cancelAnimationFrame(live.current.raf), []);

  const tick = (t: number) => {
    const s = live.current;
    const dt = s.last ? t - s.last : 16;
    s.last = t;
    s.p = Math.max(0, Math.min(1, s.p + (s.holding ? dt / HOLD : -dt / 600)));
    setProgress(s.p);
    setArt(seed({ crack: Math.min(1, s.p * 1.2) }));
    if (s.p >= 1) {
      s.holding = false;
      setHolding(false);
      setDone(true);
      navigator.vibrate?.([10, 40, 20]);
      s.raf = 0;
      return;
    }
    s.raf = s.p > 0 || s.holding ? requestAnimationFrame(tick) : 0;
  };
  const start = () => {
    const s = live.current;
    if (done) {
      s.p = 0;
      setProgress(0);
      setDone(false);
      setArt(seedSvg);
      return;
    }
    s.holding = true;
    s.last = 0;
    setHolding(true);
    if (!s.raf) s.raf = requestAnimationFrame(tick);
  };
  const end = () => { live.current.holding = false; setHolding(false); };

  return (
    <>
      <div className="stage">
        <button
          className={`hatch${done ? " done" : ""}`}
          type="button"
          aria-label={done ? "Nori hatched. Press to plant a new seed" : "Hold to hatch Nori"}
          onPointerDown={(e) => { if (e.button === 0) start(); }}
          onPointerUp={end}
          onPointerLeave={end}
          onPointerCancel={end}
          onContextMenu={(e) => e.preventDefault()}
          onKeyDown={(e) => { if ((e.key === " " || e.key === "Enter") && !e.repeat) { e.preventDefault(); start(); } }}
          onKeyUp={(e) => { if (e.key === " " || e.key === "Enter") end(); }}
          onClick={(e) => e.preventDefault()}
        >
          <svg className="hatch-ring" viewBox="0 0 100 100" aria-hidden="true">
            <circle cx="50" cy="50" r="48" stroke="rgb(255 255 255 / .1)" />
            <circle cx="50" cy="50" r="48" stroke={GLOW} strokeDasharray={RING} strokeDashoffset={RING * (1 - progress)} transform="rotate(-90 50 50)" strokeLinecap="round" />
          </svg>
          <span className={`seed-in${holding && progress > 0.15 && !reduce ? " shake" : ""}`} dangerouslySetInnerHTML={{ __html: art }} />
          <span className="nori-in" dangerouslySetInnerHTML={{ __html: noriSvg }} />
        </button>
      </div>
      <p className="spec">{done ? "Hatched. Press again to plant a new seed." : "About 2.5 seconds of holding. Let go early and the crack closes again."}</p>
    </>
  );
}

/* A hop on the one spring allowed to bounce, because the tap threw it. */
export function NoriDemo({ idleSvg }: { idleSvg: string }) {
  const [art, setArt] = useState(idleSvg);
  const [hops, setHops] = useState(0);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  return (
    <div className="stage">
      <button
        className={`nori-btn${hops ? " go" : ""}`}
        type="button"
        aria-label="Tap Nori"
        onClick={() => {
          setArt(nori({ mood: "playful", glow: GLOW, glowAmt: 0.9, night: true }));
          setHops((h) => h + 1);
          window.clearTimeout(timer.current);
          timer.current = window.setTimeout(() => setArt(idleSvg), 1400);
        }}
      >
        <span key={hops} className="hop" style={{ display: "block" }} dangerouslySetInnerHTML={{ __html: art }} />
      </button>
    </div>
  );
}

export function ShieldSwitch() {
  const [on, setOn] = useState(false);
  return (
    <div className="stage">
      <button className="switch-row" type="button" role="switch" aria-checked={on} onClick={() => setOn((o) => !o)}>
        <span>Ask before opening apps<small>During a break, asks before an app opens. You can always open it.</small></span>
        <span className="switch" aria-hidden="true" />
      </button>
    </div>
  );
}

const CURVES = [
  { name: "--spring-default", t: 520, color: "#EEF2EC" },
  { name: "--spring-gentle", t: 890, color: "#8EF0D6" },
  { name: "--spring-momentum", t: 410, color: "#F2C46B" },
];
const W = 240, TOP = 22, BOTTOM = 140, MAX_T = 890;
const yOf = (v: number) => BOTTOM - v * (BOTTOM - TOP);

/* Every curve is drawn from the token itself (CSS linear()), so the picture can't drift from the motion.
   The tokens only exist once the stylesheet applies, so the paths are written after mount. */
export function SpringCurves() {
  const reduce = useReducedMotion();
  const svg = useRef<SVGSVGElement>(null);
  const curves = useRef<number[][]>([]);

  useEffect(() => {
    const el = svg.current;
    const root = el?.closest(".qcs-main");
    if (!el || !root) return;
    const css = getComputedStyle(root);
    curves.current = CURVES.map((c) => css.getPropertyValue(c.name).trim().replace(/^linear\(|\)$/g, "").split(",").map(Number));
    el.querySelectorAll<SVGPathElement>("path").forEach((path, i) => {
      const pts = curves.current[i];
      const t = CURVES[i].t;
      path.setAttribute("d", pts.map((v, j) => `${j ? "L" : "M"}${((j / (pts.length - 1)) * (t / MAX_T) * W).toFixed(1)} ${yOf(v).toFixed(1)}`).join(" "));
    });
  }, []);

  const replay = () => {
    svg.current?.querySelectorAll<SVGCircleElement>(".ball").forEach((b, i) => {
      const pts = curves.current[i];
      const t = CURVES[i].t;
      if (!pts) return;
      if (reduce) { b.setAttribute("cx", String((t / MAX_T) * W)); b.setAttribute("cy", String(yOf(1))); return; }
      const begin = performance.now();
      const step = (now: number) => {
        const k = Math.min(1, (now - begin) / t);
        const f = k * (pts.length - 1), j = Math.floor(f);
        const v = pts[j] + (pts[Math.min(j + 1, pts.length - 1)] - pts[j]) * (f - j);
        b.setAttribute("cx", String(k * (t / MAX_T) * W));
        b.setAttribute("cy", String(yOf(v)));
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  };

  return (
    <>
      <div className="stage">
        <svg ref={svg} viewBox="0 0 240 150" role="img" aria-label="Three spring curves: default and gentle settle without overshoot, momentum overshoots slightly.">
          <g className="grid-lines">
            <line x1="0" x2={W} y1={yOf(1)} y2={yOf(1)} />
            <line x1="0" x2={W} y1={yOf(0)} y2={yOf(0)} />
          </g>
          {CURVES.map((c) => (
            <g key={c.name}>
              <path stroke={c.color} />
              <circle className="ball" r="5" fill={c.color} cx="0" cy={yOf(0)} />
            </g>
          ))}
        </svg>
      </div>
      <div className="curve-keys" aria-hidden="true">
        <span><i style={{ background: "#EEF2EC" }} />Default 0.52 s</span>
        <span><i style={{ background: "#8EF0D6" }} />Gentle 0.89 s</span>
        <span><i style={{ background: "#F2C46B" }} />After a flick 0.41 s</span>
      </div>
      <button className="btn quiet" type="button" onClick={replay}>Replay</button>
    </>
  );
}
