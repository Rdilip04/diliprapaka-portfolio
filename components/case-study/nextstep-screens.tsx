import { Body, Eyebrow, Section, SectionTitle } from "./section";
import { FigureRow } from "./figure";
import { Reveal } from "./reveal";

// Paste the shared Figma prototype URL here and the link appears in §05.
// Deliberately empty rather than a placeholder href — a dead link in a
// portfolio is worse than no link, so nothing renders until this is set.
const PROTOTYPE_URL: string =
  "https://www.figma.com/proto/fgdAXF0fe4dQUbxoS5VI9f/NextStep--Grp-B3-?node-id=739-47057&starting-point-node-id=739%3A47057&scaling=scale-down&content-scaling=fixed";

function ScreenTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-serif text-[clamp(1.4rem,2.6vw,2rem)] font-normal leading-[1.1] tracking-[-0.01em]">
      {children}
    </h3>
  );
}

// Hairline-separated so each screen reads as its own record in a set, which is
// the same structural language the work index uses.
function Screen({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Reveal className="border-t border-ink/12 pt-10 md:pt-14">
      <ScreenTitle>{title}</ScreenTitle>
      <div className="mt-5 flex flex-col gap-6">{children}</div>
    </Reveal>
  );
}

function Points({ items }: { items: { term: string; detail: string }[] }) {
  return (
    <ul className="flex max-w-[65ch] flex-col gap-3">
      {items.map((item) => (
        <li key={item.term} className="flex gap-3">
          <span aria-hidden className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-cobalt" />
          <p className="font-sans text-base leading-[1.7] text-ink/75">
            <span className="font-medium text-ink">{item.term}</span> —{" "}
            {item.detail}
          </p>
        </li>
      ))}
    </ul>
  );
}

export function NextStepScreens() {
  return (
    <Section id="screens" surface="canvas">
      <Reveal>
        <Eyebrow>05 — Design evolution</Eyebrow>
        <SectionTitle>Three flows, taken end to end</SectionTitle>
        <Body className="mt-6">
          Each one traces back to a research finding — cognitive load, isolation,
          motivation. I took all three from wireframe through mid-fidelity to
          final hi-fidelity, alongside the secondary system screens below.
        </Body>
        {PROTOTYPE_URL && (
          <a
            href={PROTOTYPE_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex min-h-11 items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-cobalt-ink transition-opacity hover:opacity-70"
          >
            Open the interactive prototype
            <span aria-hidden>↗</span>
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        )}
      </Reveal>

      <div className="mt-16 flex flex-col gap-14 md:gap-20">
        <Screen title="Homepage">
          <Body>
            The homepage needed to answer one question immediately:{" "}
            <span className="font-medium text-ink">
              &ldquo;What do I do today?&rdquo;
            </span>{" "}
            I designed it around three priorities.
          </Body>
          <Points
            items={[
              {
                term: "Recovery progress",
                detail:
                  "at the top — the streak counter and progress bar give patients a reason to come back daily.",
              },
              {
                term: "Today's Rehab Plan",
                detail:
                  "in the centre — the exercises for today, visible without scrolling.",
              },
              {
                term: "Next appointment",
                detail:
                  "a quick reference so patients don't miss follow-ups.",
              },
            ]}
          />
          <Body>
            An earlier version led with recovery progress — a large streak
            counter at the top. I moved it down after realising the emotional
            weight of &ldquo;you&apos;re on day 12&rdquo; isn&apos;t what
            someone needs when they open the app. They need to know what to do
            next. Progress became supporting context, not the headline.
          </Body>
          <FigureRow
            cols={4}
            items={[
              {
                label: "Sketch",
                alt: "Homepage sketch",
                src: "/nextstep/home-1-sketch.webp",
              },
              {
                label: "Lo-fi",
                alt: "Homepage low-fidelity wireframe",
                src: "/nextstep/home-2-lofi.webp",
              },
              {
                label: "Mid-fi",
                alt: "Homepage mid-fidelity design",
                src: "/nextstep/home-3-midfi.webp",
              },
              {
                label: "Hi-fi",
                alt: "Homepage final high-fidelity design",
                src: "/nextstep/home-4-hifi.webp",
              },
            ]}
            caption="The homepage moved through four stages, each driven by feedback."
          />
        </Screen>

        <Screen title="Exercise screens">
          <Body>
            The exercise flow needed to work for users with limited mobility and
            varying confidence with technology. Each exercise shows a video or
            image demonstration, written instructions alongside it, and the
            duration and rep count, with clear{" "}
            <span className="font-medium text-ink">Restart</span> and{" "}
            <span className="font-medium text-ink">Next</span> controls.
          </Body>
          <Body>
            I used large tap targets and a simple linear flow — one exercise at a
            time, no branching — to reduce cognitive load for users who may be
            fatigued or in discomfort.
          </Body>
          <Body>
            I considered a card-swipe pattern where users flick through
            exercises like Tinder — it looked good, but it removed the sense of
            a structured session. A linear list with clear progress felt more
            like a plan and less like a game.
          </Body>
          <FigureRow
            cols={3}
            items={[
              {
                label: "Exercise list",
                alt: "Exercise list screen",
                src: "/nextstep/exercise-list.webp",
              },
              {
                label: "Exercise detail",
                alt: "Exercise detail screen",
                src: "/nextstep/exercise-detail.webp",
              },
              {
                label: "Completion",
                alt: "Exercise completion screen",
                src: "/nextstep/exercise-complete.webp",
              },
            ]}
          />
        </Screen>

        <Screen title="Community">
          <Body>
            The community screen addresses the isolation finding from research.
            Patients browse support groups by category — Mental Wellness, Heart
            Health, Recovery Fitness, Health Diet, Chronic Illness — and join
            conversations with others in similar situations.
          </Body>
          <Body>
            I kept the layout simple: search bar, category cards with member
            counts, and group guidelines visible before joining, so the barrier
            to participation stays low.
          </Body>
          <Body>
            Worth flagging: the categories here are broad health topics rather
            than stroke-specific ones. In hindsight, stroke patients would
            benefit more from condition-specific groups — &ldquo;Hand mobility
            recovery,&rdquo; &ldquo;Managing fatigue,&rdquo; &ldquo;Returning to
            daily activities&rdquo; — where shared experience is more directly
            relevant. It&apos;s one of the first things I&apos;d redesign.
          </Body>
          <FigureRow
            cols={3}
            items={[
              {
                label: "Community",
                alt: "Community landing screen",
                src: "/nextstep/community-main.webp",
              },
              {
                label: "Group browse",
                alt: "Community group browsing screen",
                src: "/nextstep/community-browse.webp",
              },
              {
                label: "Group detail",
                alt: "Community group detail screen",
                src: "/nextstep/community-detail.webp",
              },
            ]}
          />
        </Screen>

        {/* Secondary screens get one collage and a single line — they solved no
            hard problem, so a deep-dive would dilute the three flows above. */}
        <Reveal className="border-t border-ink/12 pt-10 md:pt-14">
          <FigureRow
            cols={2}
            items={[
              {
                label: "Notifications",
                alt: "Notifications screen",
                src: "/nextstep/notifications.webp",
              },
              {
                label: "Profile",
                alt: "Profile screen",
                src: "/nextstep/profile.webp",
              },
            ]}
            caption="Secondary screens (Notifications & Profile) use standard iOS patterns to ensure a familiar, low-friction experience."
          />
        </Reveal>
      </div>
    </Section>
  );
}
