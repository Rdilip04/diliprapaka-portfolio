export type Project = {
  slug: string;
  index: string;
  title: string;
  // Meta row reads "<role> · <duration>". Category and year were dropped: the
  // industry and date already appear in the description and the outcome line,
  // and repeating them in a floating corner label made the card read noisy.
  role: string;
  duration: string;
  // `description` is the problem/what line; `why` is the outcome/result line.
  description: string;
  why: string;
  tags: string[];
  href: string;
  image?: string;
  // Quietly's row wears its own world on hover (components/quietly/work-row.css).
  theme?: "quietly";
  // A short muted loop that plays in the grown thumbnail while the row is open.
  video?: string;
};

// NextStep copy is grounded in what's confirmed (stroke-rehab app, NHS).
// Everything in [brackets] is a placeholder to fill in later.
export const PROJECTS: Project[] = [
  {
    slug: "nextstep",
    index: "01",
    title: "NextStep",
    role: "UX/UI Design",
    duration: "12 weeks",
    description:
      "A stroke-rehabilitation app for the NHS that helps patients see their recovery progress.",
    why: "1st Place, BCU Innovation Fest 2025. Recognised for innovation and impact in healthcare design.",
    // Deliverables only — not industry or role, which the copy already carries.
    tags: ["Mobile App", "Usability Testing", "NHS"],
    href: "/work/nextstep",
    image: "/nextstep/nextstep-thumb.webp",
  },
  {
    slug: "quietly",
    index: "02",
    title: "Quietly",
    role: "Solo concept",
    duration: "October 2026",
    description:
      "An iPhone app concept for putting your phone down at bedtime, with a grove that grows by morning.",
    // Honest about what it is: nothing here has met a user yet.
    why: "Not built or tested with people yet. The bet, the trade-offs and the interface craft, with a 60 second film.",
    tags: ["iOS", "Interaction Design", "Motion"],
    href: "/work/quietly",
    image: "/quietly/clips/card.webp",
    theme: "quietly",
    video: "/quietly/clips/card.mp4",
  },
  {
    slug: "cursor",
    index: "03",
    title: "Cursor",
    role: "Solo concept",
    duration: "3 weeks",
    description:
      "A concept for Cursor that gets a solo designer from their own design to a first visual edit.",
    // Honest: tested with three people, and the final version is not retested.
    why: "Tested with 3 designers: all 3 misread the wait, which reshaped the design. The final version isn't tested yet.",
    tags: ["Desktop App", "Usability Testing", "Prototype"],
    href: "/work/cursor",
    image: "/cursor/cursor-thumb.webp",
  },
  {
    slug: "project-four",
    index: "04",
    title: "[Project Four]",
    role: "[Your role]",
    duration: "[Duration]",
    description: "[One line — the problem and who it was for.]",
    why: "[One line — the outcome or result that earns its place.]",
    tags: ["Add", "Your", "Tags"],
    href: "/work/project-four",
  },
];
