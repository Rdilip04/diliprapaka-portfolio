const SURFACE = {
  paper: "bg-paper text-ink",
  canvas: "bg-canvas text-ink",
  mist: "border-y border-ink/10 bg-mist text-ink",
} as const;

export function Section({
  id,
  surface = "paper",
  children,
}: {
  id?: string;
  surface?: keyof typeof SURFACE;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={SURFACE[surface]}>
      <div className="mx-auto w-full max-w-6xl px-6 py-20 md:py-28">
        {children}
      </div>
    </section>
  );
}

// Mono eyebrow. Held at /70 — /50 measured 3.32:1 and fails AA at this size.
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-label uppercase tracking-[0.18em] text-ink/70">
      {children}
    </p>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-4 max-w-3xl font-display text-title font-medium leading-[1.05] tracking-[-0.015em]">
      {children}
    </h2>
  );
}

// Reading column. Capped near 75 characters (680px), past which the eye loses
// the line return. 62ch, not 65ch: `ch` is the width of the "0" glyph, which
// Instrument Sans sets wider than Inter, so 65ch measured 693px.
export function Body({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`max-w-[62ch] font-sans text-base leading-[1.7] text-ink/75 ${
        className ?? ""
      }`}
    >
      {children}
    </p>
  );
}
