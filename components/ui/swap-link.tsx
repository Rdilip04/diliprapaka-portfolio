import Link from "next/link";

// Shared hover: the label slides up and an accent copy slides in from below.
// This is the site-wide link interaction (used in the nav).
export function SwapLink({
  label,
  href,
  external = false,
  onClick,
  className,
  accent = "text-cobalt-ink",
  ariaCurrent,
}: {
  label: string;
  href: string;
  external?: boolean;
  onClick?: () => void;
  className?: string;
  // Use "text-cobalt-lite" on dark backgrounds, "text-cobalt-ink" on light.
  accent?: string;
  // Announces the active section — colour alone tells a screen reader nothing.
  ariaCurrent?: React.AriaAttributes["aria-current"];
}) {
  // The clip lives on an inner span, not the anchor: the anchor needs vertical
  // padding to reach a 44px tap target, and padding on the clipping box would
  // knock the second label copy out of alignment with the first.
  const inner = (
    <span className="relative block overflow-hidden leading-none">
      <span className="block transition-transform duration-300 ease-out group-hover:-translate-y-full">
        {label}
      </span>
      <span
        aria-hidden
        className={`absolute inset-x-0 top-0 block translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0 ${accent}`}
      >
        {label}
      </span>
    </span>
  );

  const shared = {
    onClick,
    "aria-current": ariaCurrent,
    className: `group relative inline-flex min-h-11 items-center ${
      className ?? ""
    }`,
  };

  // Cross-route hrefs go through next/link so the hash survives. A full page
  // load would hit the head script, which strips the hash by design.
  if (href.startsWith("/") && !external) {
    return (
      <Link href={href} {...shared}>
        {inner}
      </Link>
    );
  }

  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      {...shared}
    >
      {inner}
    </a>
  );
}
