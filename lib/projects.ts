export type Project = {
  slug: string;
  index: string;
  title: string;
  description: string;
  why: string;
  tags: string[];
  href: string;
};

// NOTE: NextStep copy is grounded in what's confirmed (stroke-rehab app, NHS).
// The [bracketed] lines and all of Project Two are placeholders — edit freely.
export const PROJECTS: Project[] = [
  {
    slug: "nextstep",
    index: "01",
    title: "NextStep",
    description:
      "A stroke-rehabilitation app for the NHS that helps patients see their recovery progress.",
    why: "1st Place — BCU Innovation Fest 2025. Recognised for innovation and impact in healthcare design.",
    tags: ["UX Research", "Healthcare", "NHS", "Usability Testing"],
    href: "/work/nextstep",
  },
  {
    slug: "project-two",
    index: "02",
    title: "Project Two",
    description: "[One-line description — what it is and who it's for.]",
    why: "[One line on why it earns a place in your portfolio.]",
    tags: ["Add", "Your", "Tags"],
    href: "/work/project-two",
  },
  {
    slug: "project-three",
    index: "03",
    title: "Project Three",
    description: "[One-line description — what it is and who it's for.]",
    why: "[One line on why it earns a place in your portfolio.]",
    tags: ["Add", "Your", "Tags"],
    href: "/work/project-three",
  },
];
