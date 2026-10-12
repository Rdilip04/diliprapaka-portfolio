import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { Body, Eyebrow, Section, SectionTitle } from "@/components/case-study/section";
import { Figure } from "@/components/case-study/figure";
import { Reveal } from "@/components/case-study/reveal";
import { NextStepScreens } from "@/components/case-study/nextstep-screens";
import { NextStepTesting } from "@/components/case-study/nextstep-testing";

export const metadata: Metadata = {
  title: "NextStep: rehabilitation app case study",
  description:
    "Designing core screens for a rehabilitation app that helps outpatients stay on track with recovery after discharge. 1st place, BCU Innovation Fest 2025.",
};

const META = [
  {
    term: "My role",
    detail: "UX/UI Designer. Core flows: Homepage, Exercises, Community",
  },
  {
    term: "Team",
    detail: "Ben, Max, Rafianna, Dilip: four designers across UX and UI",
  },
  { term: "Duration", detail: "12 weeks" },
  { term: "Tools", detail: "Figma, Maze, Notion" },
];

// Matches the icon language already used in Approach.tsx and ThemeToggle.
const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: "h-[18px] w-[18px]",
  "aria-hidden": true,
};

const CONSTRAINTS = [
  {
    term: "12 weeks",
    detail: "Four designers, one term, alongside coursework.",
    icon: (
      <svg {...iconProps}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    ),
  },
  {
    term: "No patient access until round two",
    detail:
      "We could not recruit patients for early testing, so the first round ran with students. It is the single biggest limitation on this project.",
    icon: (
      <svg {...iconProps}>
        <circle cx="9" cy="8" r="3.5" />
        <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
        <path d="M16.5 5.6a3.5 3.5 0 0 1 0 6.8" />
        <path d="M18 14.8a6.5 6.5 0 0 1 3.5 5.2" />
      </svg>
    ),
  },
  {
    term: "A concept, not a commission",
    detail:
      "NextStep was grounded in NHS guidance and stroke recovery literature, but it was a university project, not work commissioned by a trust.",
    icon: (
      <svg {...iconProps}>
        <path d="M9.5 18h5" />
        <path d="M10.5 21h3" />
        <path d="M12 3a6 6 0 0 0-3.4 10.9c.5.4.9 1 .9 1.6V18h5v-2.5c0-.6.4-1.2.9-1.6A6 6 0 0 0 12 3Z" />
      </svg>
    ),
  },
];

const HMW = [
  {
    q: "How might we make today's plan impossible to lose or misread?",
    from: "Instructions get lost",
  },
  {
    q: "How might we give someone a reason to come back tomorrow?",
    from: "Motivation drops without direction",
  },
  {
    q: "How might we make it easier to reach people going through the same thing?",
    from: "Recovery is isolating",
  },
];

const FINDINGS = [
  {
    title: "Instructions get lost",
    detail:
      "Paper plans go missing, and verbal instructions are forgotten within days.",
  },
  {
    title: "Motivation drops without direction",
    detail:
      "Patients don't know what they should be doing each day once they're home.",
  },
  {
    title: "Clinicians lose visibility",
    detail:
      "Once a patient leaves hospital there is no feedback loop on whether exercises are actually happening.",
  },
  {
    title: "Recovery is isolating",
    detail:
      "Limited peer support and difficulty reaching the care team adds anxiety on top of the physical recovery.",
  },
];

const VISUAL_SYSTEM = [
  {
    term: "Typeface",
    detail: "SF Pro, the iOS system font, chosen for readability and accessibility.",
    icon: (
      <svg {...iconProps}>
        <path d="M4 7V4.5h16V7" />
        <path d="M12 4.5v15" />
        <path d="M9 19.5h6" />
      </svg>
    ),
  },
  {
    term: "Primary colour",
    detail:
      "Shifted from a muted blue to a stronger, more vibrant blue after guerrilla testing. Users found the original palette dull and hard to distinguish.",
    icon: (
      <svg {...iconProps}>
        <path d="M12 2.8 6.9 8.3a7.3 7.3 0 1 0 10.2 0Z" />
      </svg>
    ),
  },
  {
    term: "Spacing & radius",
    detail: "A seven-step spacing scale and four-step radius scale applied across every screen.",
    icon: (
      <svg {...iconProps}>
        <rect x="2.5" y="9" width="19" height="6" rx="1.5" />
        <path d="M7.5 9v2.5M12 9v3M16.5 9v2.5" />
      </svg>
    ),
  },
  {
    term: "Button states",
    detail:
      "Primary, tinted, disabled and plain variants at three sizes, all meeting minimum tap-target guidelines.",
    icon: (
      <svg {...iconProps}>
        <rect x="2.5" y="8" width="19" height="8" rx="4" />
        <circle cx="8" cy="12" r="2" />
      </svg>
    ),
  },
  {
    term: "Icons",
    detail:
      "Outlined for navigation, filled for categories, with consistent stroke weight throughout.",
    icon: (
      <svg {...iconProps}>
        <circle cx="7" cy="7" r="3.4" />
        <rect x="13.6" y="3.6" width="6.8" height="6.8" rx="1.6" />
        <path d="M7.2 13.8 10.9 20.4H3.5Z" />
      </svg>
    ),
  },
];

function MetaGrid() {
  return (
    <dl className="grid gap-px overflow-hidden border-t border-ink/12 sm:grid-cols-2 lg:grid-cols-4">
      {META.map((item) => (
        <div key={item.term} className="pt-5 sm:pr-6">
          <dt className="font-mono text-label uppercase tracking-[0.16em] text-ink/70">
            {item.term}
          </dt>
          <dd className="mt-2 max-w-[34ch] font-sans text-sm leading-[1.6] text-ink/75">
            {item.detail}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-serif text-statement font-normal leading-[0.95] tracking-[-0.02em] text-cobalt-ink">
        {value}
      </p>
      <p className="mt-3 max-w-[32ch] font-sans text-sm leading-relaxed text-ink/70">
        {label}
      </p>
    </div>
  );
}

// A labelled term/detail pair — used for both research findings and the
// visual system, so the two sections share one structural rhythm.
function TermList({
  items,
  numbered = false,
}: {
  items: { title?: string; term?: string; detail: string; icon?: ReactNode }[];
  numbered?: boolean;
}) {
  return (
    <ol className="border-t border-ink/12">
      {items.map((item, i) => {
        const heading = item.title ?? item.term ?? "";
        return (
          <li
            key={heading}
            className="grid gap-x-8 gap-y-2 border-b border-ink/12 py-6 md:grid-cols-[3rem_14rem_minmax(0,1fr)] md:py-7"
          >
            {/* One slot, two markers: an index where the list is a sequence,
                an icon where it is a set. Keeps both variants on one grid. */}
            {numbered ? (
              <span className="font-mono text-label tabular-nums tracking-[0.14em] text-cobalt-ink">
                {String(i + 1).padStart(2, "0")}
              </span>
            ) : item.icon ? (
              <span className="text-cobalt-ink md:pt-0.5">{item.icon}</span>
            ) : (
              <span aria-hidden className="hidden md:block" />
            )}
            <h3 className="font-sans text-base font-medium leading-snug text-ink">
              {heading}
            </h3>
            <p className="max-w-[58ch] font-sans text-sm leading-[1.7] text-ink/75">
              {item.detail}
            </p>
          </li>
        );
      })}
    </ol>
  );
}

export default function NextStepCaseStudy() {
  return (
    <>
      <Nav />
      <main id="main">
        {/* Hero */}
        <section className="bg-paper text-ink">
          <div className="mx-auto w-full max-w-6xl px-6 pb-16 pt-32 md:pb-20 md:pt-40">
            <div className="anim-fade-up">
              <Link
                href="/#work"
                className="-my-3 inline-flex min-h-11 items-center font-mono text-label uppercase tracking-[0.16em] text-ink/70 transition-colors hover:text-cobalt-ink"
              >
                ← All work
              </Link>

              <p className="mt-10 font-mono text-label uppercase tracking-[0.18em] text-ink/70">
                UX/UI case study · Team project
              </p>

              <h1 className="mt-5 font-serif text-hero font-normal leading-[0.92] tracking-[-0.035em]">
                NextStep
              </h1>

              <p className="mt-7 max-w-[52ch] font-sans text-lead leading-[1.5] text-ink/75">
                Designing core screens for a rehabilitation app that helps
                outpatients stay on track with recovery after discharge.
              </p>
            </div>

            <div className="anim-fade-up mt-14" style={{ animationDelay: "120ms" }}>
              <MetaGrid />
            </div>

            <div className="anim-fade-up mt-14" style={{ animationDelay: "200ms" }}>
              <Figure
                ratio="banner"
                eager
                src="/nextstep/hero.webp"
                label="Hero: key app screens"
                alt="NextStep app key screens"
              />
            </div>
          </div>
        </section>

        {/* Outcome, surfaced early — this is the proof that earns the read. */}
        <Section id="outcome" surface="mist">
          <Reveal>
            <div className="grid gap-10 sm:grid-cols-2 sm:gap-12">
              <Stat
                value="1st place"
                label="BCU Innovation Fest 2025. Recognised for innovation and impact in healthcare design."
              />
              {/* SUS is a 0–100 score, not a percentage — "84.5%" is a
                  technical error a UX-literate interviewer will catch. */}
              <Stat
                value="84.5"
                label="Average SUS score across five participants (two patients and three clinicians) against the 68-point usability benchmark."
              />
            </div>
          </Reveal>
        </Section>

        {/* 01 — Problem */}
        <Section surface="paper">
          <Reveal>
            <Eyebrow>01 · The problem</Eyebrow>
            <SectionTitle>
              Recovery instructions arrive on paper, then go missing
            </SectionTitle>
            <div className="mt-6 flex flex-col gap-5">
              <Body>
                Many outpatients leave hospital with paper-based rehabilitation
                plans. These handouts are easily misplaced or misunderstood,
                leading to poor treatment adherence, inconsistent recovery, and
                limited support once patients are home.
              </Body>
              <Body>
                We set out to design a mobile app that gives patients clear daily
                rehab instructions, connects them with their care team, and
                tracks their recovery progress, all in one place.
              </Body>
            </div>
          </Reveal>

          <Reveal className="mt-16">
            <h3 className="font-mono text-label uppercase tracking-[0.16em] text-ink/70">
              Constraints
            </h3>
            <div className="mt-6">
              <TermList items={CONSTRAINTS} />
            </div>
          </Reveal>
        </Section>

        {/* 02 — Role */}
        <Section surface="canvas">
          <Reveal>
            <Eyebrow>02 · My contribution</Eyebrow>
            <SectionTitle>
              One of four designers, across research and interface
            </SectionTitle>
            <Body className="mt-6">
              Ben led the appointment booking flow. Max and Rafianna focused on
              onboarding and the wider component system. Research and testing
              were shared across the team.
            </Body>
          </Reveal>

          <Reveal className="mt-12">
            <div className="grid gap-10 border-t border-ink/12 pt-10 md:grid-cols-2 md:gap-16">
              <div>
                <h3 className="font-mono text-label uppercase tracking-[0.16em] text-ink/70">
                  Research
                </h3>
                <ul className="mt-5 flex flex-col gap-4">
                  {[
                    "Conducted secondary research on NHS discharge processes, stroke recovery pathways, and existing rehab tools.",
                    "Helped design and distribute the patient survey we used to understand recovery experiences.",
                    "Joined the team synthesis sessions where we clustered survey responses into the four themes that shaped the problem.",
                  ].map((item) => (
                    <li
                      key={item}
                      className="font-sans text-sm leading-[1.7] text-ink/75"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-mono text-label uppercase tracking-[0.16em] text-ink/70">
                  UI/UX design
                </h3>
                <ul className="mt-5 flex flex-col gap-4">
                  {[
                    "Led the end-to-end design of the app's core user flows: Homepage, Exercises and Community, alongside secondary system screens.",
                    "Took each screen from wireframe through mid-fidelity to final hi-fidelity.",
                    "Created the visual style guide (palette, typography, spacing scale, radius tokens, button states and icon system), following iOS Human Interface Guidelines.",
                    "Built the interactive Figma prototype used in both rounds of usability testing.",
                  ].map((item) => (
                    <li
                      key={item}
                      className="font-sans text-sm leading-[1.7] text-ink/75"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>

          <Reveal className="mt-12">
            <Body>
              I&apos;ve focused this case study on the three flows that connect
              most directly back to research findings: Homepage, Exercises and
              Community. Notifications and Profile used standard iOS patterns
              and get a lighter treatment below.
            </Body>
          </Reveal>
        </Section>

        {/* 03 — Research */}
        <Section surface="paper">
          <Reveal>
            <Eyebrow>03 · Research</Eyebrow>
            <SectionTitle>Four problems came up again and again</SectionTitle>
            <Body className="mt-6">
              A patient survey, professional interviews, and a review of NHS
              guidelines and stroke recovery literature surfaced four recurring
              problems. Each one shaped a screen.
            </Body>
          </Reveal>
          <Reveal className="mt-12">
            <TermList items={FINDINGS} numbered />
          </Reveal>
        </Section>

        {/* 04 — Problem statement & HMW. Sits after the research because a
            How Might We is a synthesis output, not an opening assumption. */}
        <Section surface="mist">
          <Reveal>
            <Eyebrow>04 · Framing</Eyebrow>
            <SectionTitle>
              Outpatients are sent home with a plan they can lose, no direction
              for the day in front of them, and no easy line back to the people
              treating them.
            </SectionTitle>
          </Reveal>

          <Reveal className="mt-14">
            <h3 className="font-mono text-label uppercase tracking-[0.16em] text-ink/70">
              How might we
            </h3>
            <ul className="mt-6 border-t border-ink/12">
              {HMW.map((item) => (
                <li
                  key={item.q}
                  className="grid gap-x-8 gap-y-2 border-b border-ink/12 py-6 md:grid-cols-[minmax(0,1fr)_14rem]"
                >
                  <p className="max-w-[52ch] font-serif text-lead font-normal leading-[1.25] tracking-[-0.01em]">
                    {item.q}
                  </p>
                  <p className="font-mono text-label uppercase leading-relaxed tracking-[0.12em] text-ink/70 md:text-right">
                    From: {item.from}
                  </p>
                </li>
              ))}
            </ul>
            <p className="mt-6 max-w-[62ch] font-sans text-sm leading-[1.7] text-ink/75">
              The Homepage answers the first, Community the third, and Exercises
              picks up the second.
            </p>
            <p className="mt-6 max-w-[62ch] font-serif text-sm italic leading-relaxed text-ink/70">
              The fourth finding (clinicians losing sight of a patient once
              they leave hospital) needed a clinician-side view, which sat
              outside the screens I owned. It is not answered here. A clinician
              view would have surfaced adherence at a glance: which patients are
              on plan, which have gone quiet, which need a check-in. It
              wasn&apos;t in scope for this project, but it&apos;s the piece
              that would make NextStep useful to the NHS, not just to patients.
            </p>
          </Reveal>
        </Section>

        {/* 05 */}
        <NextStepScreens />

        {/* 05 — Visual system */}
        <Section surface="paper">
          <Reveal>
            <Eyebrow>06 · Visual system</Eyebrow>
            <SectionTitle>Built on iOS conventions, for good reason</SectionTitle>
            <Body className="mt-6">
              We followed the iOS Human Interface Guidelines to create a
              familiar, trustworthy experience for our target users, many of
              whom are older adults or neurologically impaired. Familiarity is an
              accessibility decision, not an aesthetic one.
            </Body>
          </Reveal>
          <Reveal className="mt-12">
            <TermList items={VISUAL_SYSTEM} />
          </Reveal>
          <Reveal className="mt-12">
            <Figure
              ratio="wide"
              src="/nextstep/style-guide.webp"
              label="Style guide: colour, type, spacing, buttons, icons"
              alt="NextStep visual style guide"
            />
          </Reveal>
        </Section>

        {/* 07 */}
        <NextStepTesting />

        {/* 07 — Outcome & reflection */}
        <Section surface="paper">
          <Reveal>
            <Eyebrow>08 · Outcome</Eyebrow>
            <SectionTitle>
              1st place at BCU Innovation Fest 2025
            </SectionTitle>
            <Body className="mt-6">
              NextStep was recognised for innovation and impact in healthcare
              design. The project taught me how small decisions (an icon label,
              a colour shift, a button position) directly affect whether someone
              can use an app independently during a vulnerable time in their
              life.
            </Body>
            <p className="mt-8 max-w-[46ch] font-serif text-subhead font-normal leading-[1.2] tracking-[-0.01em] text-cobalt-ink">
              Joining a health community needs more trust-building than a
              standard social app.
            </p>
          </Reveal>

          <Reveal className="mt-16">
            <h3 className="font-mono text-label uppercase tracking-[0.16em] text-ink/70">
              What I&apos;d do differently
            </h3>
            <div className="mt-6 grid gap-8 border-t border-ink/12 pt-8 md:grid-cols-2 md:gap-12">
              <Body>
                <span className="font-medium text-ink">
                  Test with real patients earlier, and more of them.
                </span>{" "}
                Round one was students, which caught layout and hierarchy issues
                but missed the accessibility and comprehension gaps. Round two
                reached only two actual patients against three clinicians, so
                the strongest number in this case study rests on the smallest
                part of the sample. I&apos;d weight it towards patients next time.
              </Body>
              <Body>
                <span className="font-medium text-ink">
                  Spend more time on community onboarding.
                </span>{" "}
                Joining a group was the clearest pain point in round one and
                never got a dedicated fix. The changes that shipped were about
                contrast and labelling. The flow still assumes someone will join
                a health group as readily as a social one.
              </Body>
            </div>
          </Reveal>
        </Section>

        {/* Escape route back to the index */}
        <Section surface="mist">
          <Reveal>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <p className="max-w-[40ch] font-serif text-subhead font-normal leading-[1.1] tracking-[-0.015em]">
                That&apos;s NextStep. More work is on the way.
              </p>
              <Link
                href="/#work"
                className="-my-3 inline-flex min-h-11 items-center font-mono text-label uppercase tracking-[0.16em] text-cobalt-ink transition-opacity hover:opacity-70"
              >
                ← Back to all work
              </Link>
            </div>
          </Reveal>
        </Section>
      </main>
      <Footer />
    </>
  );
}
