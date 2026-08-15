import Image from "next/image";

// Ratios match the real exports rather than idealised device sizes, so nothing
// is cropped: the screens ship at 830x1686 and the style-guide board at 16:9.
const RATIO = {
  phone: "aspect-[830/1686]",
  // Wide enough that a row of handsets fits without the block growing taller
  // than the viewport at full container width.
  banner: "aspect-[12/5]",
  wide: "aspect-[16/9]",
} as const;

// Rendered width per slot, so the browser can pick a candidate from the srcset
// instead of assuming 100vw. Phones cap at ~184px (a max-w-sm/max-w-3xl grid
// column); banner and wide run the full max-w-6xl reading container, 1104px
// once its px-6 padding is removed.
const SIZES = {
  phone: "200px",
  banner: "(min-width: 1152px) 1104px, calc(100vw - 48px)",
  wide: "(min-width: 1152px) 1104px, calc(100vw - 48px)",
} as const;

type Ratio = keyof typeof RATIO;

function PlaceholderMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="h-6 w-6"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="m21 15-5-5L5 21" />
    </svg>
  );
}

/**
 * A slot for artwork that has not been uploaded yet.
 *
 * The aspect ratio is declared on the empty state as well as the filled one, so
 * dropping the real image in later cannot shift the page (CLS).
 */
export function Figure({
  src,
  alt,
  label,
  caption,
  ratio = "wide",
  eager = false,
}: {
  src?: string;
  alt: string;
  label: string;
  caption?: string;
  ratio?: Ratio;
  // Set on the one figure above the fold. Everything else stays lazy.
  eager?: boolean;
}) {
  return (
    <figure>
      <div
        className={`relative ${RATIO[ratio]} overflow-hidden rounded-lg ${
          src ? "border border-ink/10" : "border border-dashed border-ink/25 bg-mist"
        }`}
      >
        {src ? (
          <Image
            src={src}
            alt={alt}
            fill
            sizes={SIZES[ratio]}
            loading={eager ? "eager" : "lazy"}
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-4 text-center text-ink/70">
            <PlaceholderMark />
            <span className="font-mono text-label uppercase leading-relaxed tracking-[0.14em]">
              {label}
            </span>
          </div>
        )}
      </div>
      {caption && (
        <figcaption className="mt-3 max-w-[60ch] font-sans text-sm leading-relaxed text-ink/70">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

// Capped per column count so a row of phone mockups stays near handset size
// instead of stretching to fill the reading container.
const COLS = {
  2: "grid-cols-2 max-w-sm",
  3: "grid-cols-2 sm:grid-cols-3 max-w-sm sm:max-w-lg",
  4: "grid-cols-2 sm:grid-cols-4 max-w-sm sm:max-w-3xl",
} as const;

// Phone screens read as a set, so they share one caption rather than one each.
export function FigureRow({
  items,
  caption,
  cols = 4,
}: {
  items: { label: string; alt: string; src?: string }[];
  caption?: string;
  cols?: keyof typeof COLS;
}) {
  return (
    <figure>
      <ul className={`grid gap-4 ${COLS[cols]}`}>
        {items.map((item) => (
          <li key={item.label}>
            <Figure
              ratio="phone"
              label={item.label}
              alt={item.alt}
              src={item.src}
            />
          </li>
        ))}
      </ul>
      {caption && (
        <figcaption className="mt-4 max-w-[60ch] font-sans text-sm leading-relaxed text-ink/70">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
