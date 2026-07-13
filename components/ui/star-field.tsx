"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

// Lightweight pixel starfield — small squares (not dots) to match the site's
// pixel/mosaic language. Mostly white with occasional cosmic-orange sparks.
// Twinkle + very slow drift; a single static frame under reduced motion.

type Star = {
  x: number;
  y: number;
  size: number;
  base: number;
  tw: number;
  twSpeed: number;
  cosmic: boolean;
};

export function StarField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let stars: Star[] = [];

    const seed = () => {
      const count = Math.round((width * height) / 4500);
      stars = [];
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() < 0.35 ? 2 : 1,
          base: 0.4 + Math.random() * 0.55,
          tw: Math.random() * Math.PI * 2,
          twSpeed: 0.6 + Math.random() * 1.4,
          cosmic: Math.random() < 0.12,
        });
      }
    };

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      // If the element hasn't been laid out yet, retry next frame.
      if (width === 0 || height === 0) {
        requestAnimationFrame(resize);
        return;
      }
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height);
      for (const s of stars) {
        if (!reduceMotion) {
          s.y += 0.03; // gentle downward drift
          if (s.y > height) s.y = 0;
        }
        const twinkle = reduceMotion
          ? 1
          : 0.6 + 0.4 * Math.sin(t * 0.001 * s.twSpeed + s.tw);
        const alpha = s.base * twinkle;
        ctx.fillStyle = s.cosmic
          ? `rgba(255,138,92,${alpha})`
          : `rgba(240,244,255,${alpha})`;
        ctx.fillRect(s.x, s.y, s.size, s.size);
      }
    };

    let raf = 0;
    const loop = (t: number) => {
      draw(t);
      raf = requestAnimationFrame(loop);
    };

    resize();
    if (reduceMotion) {
      draw(0);
    } else {
      raf = requestAnimationFrame(loop);
    }
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [reduceMotion]);

  return <canvas ref={canvasRef} className={className} aria-hidden />;
}
