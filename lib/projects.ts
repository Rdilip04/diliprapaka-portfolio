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
    why: "1st Place — BCU Innovation Fest 2025. Recognised for innovation and impact in healthcare design.",
    // Deliverables only — not industry or role, which the copy already carries.
    tags: ["Mobile App", "Usability Testing", "NHS"],
    href: "/work/nextstep",
    image: "/nextstep/nextstep-thumb.webp",
  },
  {
    slug: "project-two",
    index: "02",
    title: "[Project Two]",
    role: "[Your role]",
    duration: "[Duration]",
    description: "[One line — the problem and who it was for.]",
    why: "[One line — the outcome or result that earns its place.]",
    tags: ["Add", "Your", "Tags"],
    href: "/work/project-two",
  },
  {
    slug: "project-three",
    index: "03",
    title: "[Project Three]",
    role: "[Your role]",
    duration: "[Duration]",
    description: "[One line — the problem and who it was for.]",
    why: "[One line — the outcome or result that earns its place.]",
    tags: ["Add", "Your", "Tags"],
    href: "/work/project-three",
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
