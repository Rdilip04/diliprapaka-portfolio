import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { Body, Eyebrow, Section, SectionTitle } from "@/components/case-study/section";
import { Figure } from "@/components/case-study/figure";
import { Reveal } from "@/components/case-study/reveal";

// Copy is Dilip's own where he confirmed it section by section on 26 October
// 2026 (CASE.md in the Cursor project). The added context is drafted from his
// project log (SCOPE, RESEARCH, BRIEF, STRESS, CRAFT, TEST) for him to review.
// Every number traces to that log. It is a concept: say so, and never imply it
// is Cursor's work or shipped. Real Cursor screens from a tutorial are labelled
// as such; only the Windows screens are Dilip's own runs.

export const metadata: Metadata = {
  title: "Cursor: a designer's first edit, case study",
  description:
    "A concept for Cursor that gets a solo designer from their own design to a first visual edit. Tested with three designers, who showed the real problem was the wait.",
};

const PROTOTYPE_URL = "https://claude.ai/artifact/Ha12K27VmMY7oWtW1TW565";

const META = [
  { term: "My role", detail: "Solo: research, design, prototype and testing" },
  { term: "Context", detail: "Product Anatomy course capstone. A concept, not affiliated with Cursor" },
  { term: "Duration", detail: "3 weeks, October 2026" },
  { term: "Tested with", detail: "3 designers, in a self-serve test with a built-in click log" },
];

// ---------------------------------------------------------------------------
// Content tables. Kept as data so the JSX below reads as the story.
// ---------------------------------------------------------------------------

const FIRST_RUN = [
  {
    title: "I picked “Designer”",
    detail:
      "Web sign-up, 17:41. Cursor asks for your role, so it knows I’m a designer. The next screen was an ad for a different product, then “Start your Pro plan to continue”.",
  },
  {
    title: "“Connect GitHub to finish setup”",
    detail:
      "17:45. The reasons given were about codebases, code review and pull requests. “Maybe later” was there, but small, and the title said I needed it to finish.",
  },
  {
    title: "Still no prompt sent",
    detail:
      "17:47. Four routes to pick from, then a prompt box under “Cloud Agents requires a Pro Account”. Six minutes, seven screens, and I hadn’t asked for anything yet.",
  },
  {
    title: "The desktop app asked about code",
    detail:
      "I pasted my design and asked for one screen. Before building, the agent asked me to pick a tech stack (Vite + React, Expo, a single HTML file) and then “code-first” or “comp-first”. Seven minutes in, no page on screen.",
  },
  {
    title: "The editor had no name",
    detail:
      "Design Mode only appears in Cursor’s built-in browser, as a pen icon whose name shows on hover. I found it after watching a tutorial. On a second new account, typing “Open Design Mode” in the chat didn’t open it.",
  },
];

const WALLS = [
  { wall: "AI broke something", posts: 4 },
  { wall: "Something else", posts: 3 },
  { wall: "Stuck at setup", posts: 2 },
  { wall: "Setup was easy", posts: 1 },
];

// All sixteen, so the rejected ones are visible with their reasons.
const IDEAS = [
  { n: "1", idea: "A guided tour of the Agents Window", fate: "Thrown away: explains today’s path instead of changing it" },
  { n: "2", idea: "A “designer view” that hides developer panels", fate: "Thrown away: the obvious answer, 8 out of 10 designers would think of it" },
  { n: "3", idea: "A pulsing hint on the pen icon", fate: "Thrown away: 9 out of 10 would think of it in a minute" },
  { n: "4", idea: "Plain-language hovers on words like “Vite”", fate: "Thrown away: explains the path, doesn’t change it" },
  { n: "5", idea: "A welcome video, design to first edit", fate: "Thrown away: same move as the tour" },
  { n: "6", idea: "The agent picks the tech stack itself", fate: "Thrown away, but its move lives on inside 11" },
  { n: "7", idea: "Open Design Mode automatically", fate: "Thrown away: 12 does the same and says more" },
  { n: "8", idea: "Mark up the Figma picture while it builds", fate: "Thrown away: Design Mode only edits a running page" },
  { n: "9", idea: "Pour your design into a starter page", fate: "Lost: you can’t start from someone else’s page" },
  { n: "10", idea: "Move “Connect GitHub” to after the first edit", fate: "Lost: it doesn’t touch the first edit" },
  { n: "11", idea: "A quick running preview first, the full build behind it", fate: "Chosen" },
  { n: "12", idea: "Open on the finished page, ready to edit", fate: "Lost: only helps after the full build, so the wait stays" },
  { n: "13", idea: "Before building, say what will change in design words", fate: "Lost: adds a step where designers already stall" },
  { n: "14", idea: "A card of what was set up, for tomorrow", fate: "Lost: useful, but not about the first edit" },
  { n: "15", idea: "No chat in the first session", fate: "Lost: a designer needs a conversation and a plan" },
  { n: "16", idea: "A throwaway sandbox until you press “keep”", fate: "Lost: not a big enough change" },
];

const TODAY = [
  "Sign up and pick “Designer”",
  "Download the app, see “Connect GitHub” in the checklist",
  "Paste your design and send it",
  "Answer the tech stack and setup questions",
  "Wait for the whole build (12 min 45 s in a tutorial’s best case)",
  "Open the Browser tab yourself",
  "Find the pen icon, named only on hover",
  "Select something and describe the change",
];

const MINE = [
  "Attach your design and send it. No stack question",
  "Watch “Preview” being made in the chat",
  "The Browser panel opens by itself with your page",
  "Press “Edit in Design Mode”",
  "Select something, describe the change. First edit done",
];

const WORDS = [
  { use: "your design", not: "screenshot, spec, frame", because: "Cursor’s agent called it “the spec”. A designer calls it their design." },
  { use: "your page", not: "localhost, dev server, app", because: "Cursor shows “localhost:5173”. No designer in my notes used those words for their own work." },
  { use: "Preview", not: "scaffold, draft build", because: "Bolt already uses it for this panel, so designers know the word." },
  { use: "Design Mode", not: "pen icon, design sidebar", because: "Cursor’s own name for it. I kept the host product’s word." },
];

const BREAKS = [
  {
    what: "Usage limit hit while an edit is waiting",
    found: "No state for it. The edit never applies, so the job never finishes. The only blocker.",
    fix: "“Your 2 edits are saved” and they apply when usage resets.",
  },
  {
    what: "A second edit while the first is waiting",
    found: "The second silently replaced the first.",
    fix: "“2 edits waiting”, applied in order.",
  },
  {
    what: "A 1440px frame in a 706px panel",
    found: "The page squashes with nothing saying so, so she “fixes” things that aren’t broken.",
    fix: "“Showing 706 px · your frame is 1440 px” and Fit to frame.",
  },
  {
    what: "Empty box, then Enter",
    found: "A change she never wrote got queued.",
    fix: "Nothing sends. Starters fill the box instead.",
  },
  {
    what: "The edit changes the wrong thing",
    found: "No undo where she made it.",
    fix: "Undo on the “Edit applied” line.",
  },
];

const PEOPLE = [
  {
    name: "Vishwa",
    code: "A few times",
    how: "“Edit in Design Mode”, 18 seconds into the task",
    ease: "6",
    said: "“I was just waiting for the change.”",
  },
  {
    name: "Yogesh",
    code: "Often",
    how: "Typed in the chat. Clicked the page 4 times with Design Mode off",
    ease: "7",
    said: "“It changed straight away.” Both changes were still waiting.",
  },
  {
    name: "Ben",
    code: "A few times",
    how: "Typed both changes in one message",
    ease: "7",
    said: "“I couldn’t see any loading indicators.”",
  },
];

const TOOLS = [
  {
    name: "v0",
    href: "https://v0.app/docs/design-mode",
    does: "Edits stay pending until you press Apply. Undo, and a before and after toggle.",
    took: "Seeing the change before it’s saved. Before and after became Compare with Figma.",
  },
  {
    name: "Figma Make",
    href: "https://figma.com/blog/properties-panel-and-annotations-now-in-figma-make",
    does: "A properties panel. Edits wait in the prompt box and can be dropped for free.",
    took: "Remove on a waiting change. Not the panel.",
  },
  {
    name: "Lovable",
    href: "https://docs.lovable.dev/features/design.md",
    does: "Select, text, draw and comment modes. Requests queue and run after the current task.",
    took: "Proof that a queue of waiting edits is normal. Not inline text or multi-select.",
  },
];

const EDGES = [
  { n: "E1", when: "A change while the full build runs", now: "Shows at once, tagged “Preview · not saved”" },
  { n: "E2", when: "She changes her mind", now: "Remove on each waiting change" },
  { n: "E3", when: "The same part changed twice", now: "The newer one replaces the older, and says so" },
  { n: "E4", when: "A vague message, “make it pop”", now: "The agent asks which part to change" },
  { n: "E5", when: "Clicking a link after the full build", now: "Links work. The offer stays for text and cards" },
  { n: "E6", when: "The full build stops", now: "Changes are kept as a preview, with Try again" },
  { n: "E7", when: "Seven changes waiting", now: "Shows 3, then “Show 4 more”" },
  { n: "E8", when: "A screen reader", now: "The waiting card is announced only when it changes" },
];

// ---------------------------------------------------------------------------
// Local building blocks, in the same voice as the NextStep page.
// ---------------------------------------------------------------------------

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
      <p className="font-display text-statement font-medium leading-[0.95] tracking-[-0.02em] text-cobalt-ink">
        {value}
      </p>
      <p className="mt-3 max-w-[32ch] font-sans text-sm leading-relaxed text-ink/70">
        {label}
      </p>
    </div>
  );
}

function SubHead({ children }: { children: ReactNode }) {
  return (
    <h3 className="font-mono text-label uppercase tracking-[0.16em] text-ink/70">
      {children}
    </h3>
  );
}

function PullQuote({ children }: { children: ReactNode }) {
  return (
    <p className="max-w-[46ch] font-display text-subhead font-medium leading-[1.2] tracking-[-0.01em] text-cobalt-ink">
      {children}
    </p>
  );
}

function Steps({ items }: { items: { title: string; detail: string }[] }) {
  return (
    <ol className="border-t border-ink/12">
      {items.map((item, i) => (
        <li
          key={item.title}
          className="grid gap-x-8 gap-y-2 border-b border-ink/12 py-6 md:grid-cols-[3rem_14rem_minmax(0,1fr)] md:py-7"
        >
          <span className="font-mono text-label tabular-nums tracking-[0.14em] text-cobalt-ink">
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3 className="font-sans text-base font-medium leading-snug text-ink">
            {item.title}
          </h3>
          <p className="max-w-[58ch] font-sans text-sm leading-[1.7] text-ink/75">
            {item.detail}
          </p>
        </li>
      ))}
    </ol>
  );
}

// A plain table. Scrolls inside itself on a phone so the page never does.
function Table({
  label,
  head,
  rows,
}: {
  label: string;
  head: string[];
  rows: ReactNode[][];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[36rem] border-collapse text-left font-sans text-sm">
        <caption className="sr-only">{label}</caption>
        <thead>
          <tr className="border-b border-ink/25">
            {head.map((h) => (
              <th
                key={h}
                scope="col"
                className="py-3 pr-6 align-bottom font-mono text-label font-normal uppercase tracking-[0.14em] text-ink/70"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, r) => (
            <tr key={r} className="border-b border-ink/12">
              {row.map((cell, c) => (
                <td
                  key={c}
                  className={`py-4 pr-6 align-top leading-[1.6] ${
                    c === 0 ? "font-medium text-ink" : "text-ink/75"
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StepColumn({ title, items, tone }: { title: string; items: string[]; tone: "muted" | "accent" }) {
  return (
    <div>
      <SubHead>{title}</SubHead>
      <ol className="mt-4 border-t border-ink/12">
        {items.map((item, i) => (
          <li key={item} className="flex gap-4 border-b border-ink/12 py-3 font-sans text-sm leading-[1.6] text-ink/75">
            <span
              className={`font-mono text-label tabular-nums tracking-[0.14em] ${
                tone === "accent" ? "text-cobalt-ink" : "text-ink/70"
              }`}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function CursorCaseStudy() {
  const maxPosts = Math.max(...WALLS.map((w) => w.posts));

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
                UX case study · Solo concept
              </p>

              <h1 className="mt-5 font-display text-hero font-medium leading-[0.92] tracking-[-0.035em]">
                Cursor
              </h1>

              <p className="mt-7 max-w-[52ch] font-sans text-lead leading-[1.5] text-ink/75">
                Getting a designer from their own Figma design to their first
                visual edit in Cursor. I bet designers couldn’t find the visual
                editor. Three designers showed me the real problem was the wait,
                and that most of them would rather type.
              </p>
            </div>

            <div className="anim-fade-up mt-14" style={{ animationDelay: "120ms" }}>
              <MetaGrid />
            </div>

            <div className="anim-fade-up mt-14" style={{ animationDelay: "200ms" }}>
              <Figure
                ratio="screen"
                eager
                src="/cursor/screen-not-saved.webp"
                label="Final design: changes preview on the page"
                alt="The final design: two changes show on the designer's page straight away, tagged Preview, not saved, while the full build finishes"
                caption="The final design. Both changes show on the page straight away, tagged “Preview · not saved”, and the chat lists them, each with Remove."
              />
            </div>
          </div>
        </section>

        {/* What testing showed, surfaced early */}
        <Section id="outcome" surface="mist">
          <Reveal>
            <div className="grid gap-10 sm:grid-cols-3 sm:gap-12">
              <Stat value="3 of 3" label="testers misread the wait for their changes." />
              <Stat value="1 of 3" label="used Design Mode. The others typed their changes in the chat." />
              <Stat value="6 or 7" label="out of 7 for ease, even when the task failed." />
            </div>
          </Reveal>
        </Section>

        {/* 01 · Context */}
        <Section surface="paper">
          <Reveal>
            <Eyebrow>01 · Context</Eyebrow>
            <SectionTitle>A code tool that now has a visual editor</SectionTitle>
            <div className="mt-6 flex flex-col gap-5">
              <Body>
                Cursor is an AI code editor. You describe what you want, and an
                agent plans it and writes a real project on your own computer. In
                April 2026 Cursor added Design Mode: you click part of a page
                running in Cursor’s built-in browser, describe the change, and the
                agent edits the code for you. For a designer, that’s the
                interesting part.
              </Body>
              <Body>
                I’m a designer who tried it, and I didn’t get there on my own.
                That became the project.
              </Body>
            </div>
          </Reveal>

          <Reveal className="mt-12">
            <Figure
              ratio="wide"
              src="/cursor/design-mode-tutorial.webp"
              label="Design Mode in use"
              alt="Cursor's Design Mode: a heading on a running web page is selected and a floating box asks to describe the change"
              caption="Design Mode once you’re in it: select part of the page, describe the change. From a tutorial by a practised user, not my own run."
            />
          </Reveal>

          <Reveal className="mt-16">
            <div className="grid gap-10 md:grid-cols-3">
              <div>
                <SubHead>Who it’s for</SubHead>
                <p className="mt-3 font-sans text-sm leading-[1.7] text-ink/75">
                  A solo designer, new to code tools, with a Figma design and no
                  developer to ask.
                </p>
              </div>
              <div>
                <SubHead>The goal</SubHead>
                <p className="mt-3 font-sans text-sm leading-[1.7] text-ink/75">
                  Activation. The share of first-time designers (people who pick
                  “Designer” at sign-up) who apply their first Design Mode edit in
                  their first session.
                </p>
              </div>
              <div>
                <SubHead>The limits</SubHead>
                <p className="mt-3 font-sans text-sm leading-[1.7] text-ink/75">
                  Three weeks, no interviews, a concept. Not in scope: teaching
                  code, pricing, designers in teams, or what happens when the AI
                  breaks things later.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal className="mt-16">
            <SubHead>The bet</SubHead>
            <div className="mt-4">
              <PullQuote>
                Solo designers new to code tools don’t reach their first visual
                edit in Cursor, because it asks developer questions first, and
                only names the editor when you hover over it.
              </PullQuote>
            </div>
          </Reveal>
        </Section>

        {/* 02 · The problem */}
        <Section surface="canvas">
          <Reveal>
            <Eyebrow>02 · The problem</Eyebrow>
            <SectionTitle>Setup questions first, an editor named only on hover</SectionTitle>
            <Body className="mt-6">
              I started where my user would: new accounts, my own design, no
              developer. These are my first runs on 5 October, step by step.
            </Body>
          </Reveal>

          <Reveal className="mt-10">
            <Steps items={FIRST_RUN} />
          </Reveal>

          <Reveal className="mt-12">
            <div className="grid gap-6 md:grid-cols-2">
              <Figure
                ratio="panel"
                src="/cursor/run-questions.webp"
                label="Questions before building"
                alt="Cursor's agent replies to a design brief with nine questions, ending with a choice of tech stack, before building anything"
                caption="Even in a tutorial’s best case, the agent asks nine questions before it builds. The last one is the tech stack."
              />
              <Figure
                ratio="panel"
                src="/cursor/run-stack.webp"
                label="My own run: stack and code-first"
                alt="My own Cursor chat: the agent recommends Vite and React, then asks code-first or comp-first before building one screen"
                caption="My own run: Vite + React recommended, then code-first or comp-first. All I’d asked for was one screen."
              />
            </div>
          </Reveal>

          <Reveal className="mt-12">
            <Body>
              Lovable, Bolt and Replit start you with a prompt in the browser, and
              you never see a file. Cursor is a different kind of tool: it plans
              and builds a real project on your own computer, which is exactly why
              it asks setup questions. So I kept their prompt-first start, but I
              couldn’t copy their “no files” trick. I had to make the setup
              disappear inside Cursor instead.
            </Body>
          </Reveal>

          <Reveal className="mt-12">
            <SubHead>Problem statement</SubHead>
            <p className="mt-4 max-w-[62ch] font-display text-lead leading-[1.45] text-ink">
              Solo designers who are new to code tools and start Cursor from their
              own design meet technical choices (a tech stack, GitHub) before their
              design is on screen, and the way into the visual editing they came
              for is an icon with no visible label, so they go back to tools that
              start from a picture.
            </p>
          </Reveal>
        </Section>

        {/* 03 · Research */}
        <Section surface="paper">
          <Reveal>
            <Eyebrow>03 · Research</Eyebrow>
            <SectionTitle>No interviews: 10 posts and my own runs</SectionTitle>
            <div className="mt-6 flex flex-col gap-5">
              <Body>
                I couldn’t get anyone for interviews, so I worked from three
                things: 10 public posts from designers using Cursor, my own runs
                on fresh accounts, and Cursor’s own screens.
              </Body>
              <Body>
                I only counted posts from October 2025 onwards, from people who
                said they weren’t developers and said where they got stuck.
                Before I started, I said I needed 5 of 15 posts to name setup.
                I found 10, and 2 did.
              </Body>
            </div>
          </Reveal>

          <Reveal className="mt-12">
            <SubHead>Where the 10 posts got stuck</SubHead>
            <ul className="mt-4 flex max-w-3xl flex-col gap-3">
              {WALLS.map((w) => (
                <li
                  key={w.wall}
                  className="grid grid-cols-[9rem_minmax(0,1fr)_2rem] items-center gap-4 font-sans text-sm text-ink/75 sm:grid-cols-[12rem_minmax(0,1fr)_2rem]"
                >
                  <span>{w.wall}</span>
                  <span className="h-3 rounded-lg bg-ink/10" aria-hidden>
                    <span
                      className="block h-3 rounded-lg bg-cobalt"
                      style={{ width: `${(w.posts / maxPosts) * 100}%` }}
                    />
                  </span>
                  <span className="text-right font-mono tabular-nums text-ink">{w.posts}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal className="mt-12">
            <div className="flex flex-col gap-5">
              <Body>
                The posts were weak evidence. And people who post are the ones
                who got past the start, so the designers I was designing for
                mostly weren’t there.
              </Body>
              <Body>
                My own run was clearer. On the web, a new account took me through
                6 minutes of setup screens, ending in “Connect GitHub to finish
                setup”, before I’d sent a single prompt. That’s why I kept the
                bet, and why testing it later mattered.
              </Body>
            </div>
          </Reveal>

          <Reveal className="mt-16">
            <SubHead>What narrowed it</SubHead>
            <div className="mt-4 flex flex-col gap-5">
              <Body>
                Two things narrowed the bet. Designers in teams just hand the
                setup to a developer, and the two non-developers who got through
                easily had used tools like v0 and Bolt before. So my user became
                solo designers new to code tools.
              </Body>
              <Body>
                The specifics held up in Cursor’s own screens: a “Connect GitHub”
                step, a tech-stack question, a second window at launch asking to
                open a project or clone a repo, and the editor only named on
                hover. But I had to admit one thing: my big idea, “Cursor is a
                developer tool”, was what I believed before I started. The
                research backed the details, not the headline.
              </Body>
            </div>
          </Reveal>
        </Section>

        {/* 04 · Ideas */}
        <Section surface="mist">
          <Reveal>
            <Eyebrow>04 · Ideas</Eyebrow>
            <SectionTitle>16 ideas, and why number 11 won</SectionTitle>
            <div className="mt-6 flex flex-col gap-5">
              <Body>
                I ran four rounds: the obvious ideas, then ideas with the obvious
                moves banned, then ideas borrowed from a print shop, then ideas
                that would get a no in a meeting.
              </Body>
              <Body>
                The first round taught me the most. Four of the five obvious
                ideas, a tour, a video, a hint on the icon, hover explanations,
                all explain the path that exists today. None of them changes it.
              </Body>
            </div>
          </Reveal>

          <Reveal className="mt-12">
            <Table
              label="All sixteen ideas and what happened to each"
              head={["#", "Idea", "What happened"]}
              rows={IDEAS.map((i) => [
                i.n,
                i.idea,
                i.fate === "Chosen" ? (
                  <span className="font-medium text-cobalt-ink">Chosen</span>
                ) : (
                  i.fate
                ),
              ])}
            />
          </Reveal>

          <Reveal className="mt-12">
            <SubHead>Why 11</SubHead>
            <div className="mt-4 flex flex-col gap-5">
              <Body>
                It puts the designer’s own design on screen early, and that’s the
                moment Design Mode becomes reachable. So it moves both halves of
                the problem at once: the wait and the hidden editor.
              </Body>
              <Body>
                Opening on the finished page (12) only helps after the whole build,
                so the questions and the wait stay. Explaining changes first (13)
                adds a step right where designers already stall. The open question
                I carried forward was cost: a second build on a free plan is a
                guess.
              </Body>
            </div>
          </Reveal>
        </Section>

        {/* 05 · The design */}
        <Section surface="paper">
          <Reveal>
            <Eyebrow>05 · The design</Eyebrow>
            <SectionTitle>Your design first, the full build behind it</SectionTitle>
            <div className="mt-6 flex flex-col gap-5">
              <Body>
                The idea: your own design shows up first as a preview you can
                already edit, while the full build finishes behind it. Designers
                skip the tech-stack question, the browser opens by itself, and the
                pen icon becomes a button that says “Edit in Design Mode”.
              </Body>
              <Body>
                No new screens. It changes three that already exist: Home, the
                chat, and the Browser panel. A new place to find would have been
                the same problem again.
              </Body>
            </div>
          </Reveal>

          <Reveal className="mt-12">
            <div className="grid gap-10 md:grid-cols-2">
              <StepColumn title="Today: 8 steps" items={TODAY} tone="muted" />
              <StepColumn title="My version: 5 steps" items={MINE} tone="accent" />
            </div>
          </Reveal>

          <Reveal className="mt-16">
            <SubHead>The path, screen by screen</SubHead>
          </Reveal>

          <Reveal className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Figure
                ratio="screenPair"
                src="/cursor/screen-home.webp"
                label="Home with a design attached"
                alt="Cursor's home screen with a Figma frame attached to the prompt box, with no setup questions"
                caption="1. Attach your design. A designer isn’t asked about a stack."
              />
              <Figure
                ratio="screenPair"
                src="/cursor/screen-building.webp"
                label="Preview being made"
                alt="The chat shows three steps: your design added, preview building, full build next"
                caption="2. The chat says what’s happening in design words: your design, Preview, Full build."
              />
            </div>
          </Reveal>

          <Reveal className="mt-6">
            <Figure
              ratio="screen"
              src="/cursor/screen-preview.webp"
              label="Preview ready to edit"
              alt="The designer's own page open as a preview in Cursor's browser panel, with the full build still running"
              caption="3. The Browser panel opens by itself with her page. The full build is still running behind it."
            />
          </Reveal>

          <Reveal className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Figure
                ratio="pair"
                src="/cursor/before-pen.webp"
                label="Before: Cursor's pen icon"
                alt="Before: Cursor's browser toolbar with an unlabelled pen icon"
                caption="4. Before: Cursor’s real pen icon. Its name only shows when you hover over it."
              />
              <Figure
                ratio="pair"
                src="/cursor/after-button.webp"
                label="After: Edit in Design Mode"
                alt="After: the same toolbar with a button labelled Edit in Design Mode"
                caption="After: the same spot says what it does."
              />
            </div>
          </Reveal>

          <Reveal className="mt-6">
            <Figure
              ratio="screen"
              src="/cursor/screen-selected.webp"
              label="Design Mode with a heading selected"
              alt="Design Mode on: the heading is selected and starters under the box read Figma size 40px, Text size, Colour, Spacing"
              caption="5. Select the heading and describe the change. The first starter comes from her Figma frame: “Figma size · 40px”."
            />
          </Reveal>

          <Reveal className="mt-16">
            <SubHead>Words I chose, and the ones I didn’t</SubHead>
            <div className="mt-4">
              <Table
                label="The words used in the design and the words rejected"
                head={["We say", "Not", "Because"]}
                rows={WORDS.map((w) => [w.use, w.not, w.because])}
              />
            </div>
          </Reveal>

          <Reveal className="mt-12">
            <Body>
              I kept it looking exactly like Cursor, down to measuring their text
              at 13px, because a designer should feel it was always there. I
              turned down two separate builds (extra cost), making it everyone’s
              default (it would slow developers down), and a tooltip pointing at
              the icon (a patch, not a fix). Developers, and curious designers,
              still get the stack question back through “Choose setup myself”.
            </Body>
          </Reveal>
        </Section>

        {/* 06 · Breaking it on purpose */}
        <Section surface="canvas">
          <Reveal>
            <Eyebrow>06 · Breaking it on purpose</Eyebrow>
            <SectionTitle>I found 12 breaks. I’d predicted 3</SectionTitle>
            <div className="mt-6 flex flex-col gap-5">
              <Body>
                Before anyone used it, I ran the prototype through four kinds of
                trouble: nothing there, too much, the wrong thing, and waiting. I
                wrote down what I expected to break first. I got 3 of the 12.
              </Body>
              <Body>
                My guesses were all about words and controls. I missed every
                waiting break, and every one that happens after she’s done
                everything right. These are the five I fixed first.
              </Body>
            </div>
          </Reveal>

          <Reveal className="mt-12">
            <Table
              label="The five breaks fixed first"
              head={["What happened", "What I found", "The fix"]}
              rows={BREAKS.map((b) => [b.what, b.found, b.fix])}
            />
          </Reveal>

          <Reveal className="mt-12">
            <Figure
              ratio="screen"
              src="/cursor/screen-paused.webp"
              label="Usage limit with edits waiting"
              alt="The full build is paused at the usage limit; a line says your 2 edits are saved and will apply when usage resets"
              caption="The one blocker, fixed: the build pauses at the usage limit, and her edits are kept, not lost."
            />
          </Reveal>

          <Reveal className="mt-16">
            <SubHead>Accessibility, by the numbers</SubHead>
            <div className="mt-4 flex flex-col gap-5">
              <Body>
                The outlines that show what’s selected and what’s waiting failed
                on a light page: 2.70:1 and 1.73:1, against the 3:1 they need. I
                made them a two-tone ring with a dark inner line, about 17:1 on
                any light page. Small targets went up to 24px. At 200% zoom the
                chat shrank to one line, so the page now scrolls instead.
              </Body>
              <Body>
                One honest catch: my written type scale said 14px. When I measured
                Cursor’s screens again, it was 13. I changed my notes, not the
                prototype.
              </Body>
            </div>
          </Reveal>
        </Section>

        {/* 07 · Testing */}
        <Section surface="paper">
          <Reveal>
            <Eyebrow>07 · Testing</Eyebrow>
            <SectionTitle>3 of 3 testers misread the wait</SectionTitle>
            <div className="mt-6 flex flex-col gap-5">
              <Body>
                Nobody could do a call, and our working hours didn’t line up. So I
                built a test people could do on their own: a welcome page, four
                questions about them, three tasks with a card that says what to
                do, a few questions after each task, then one button to copy their
                answers and send them to me.
              </Body>
              <Body>
                The page also logged what they clicked and how long each task
                took. That mattered later, because what people did and what they
                said didn’t always match.
              </Body>
            </div>
          </Reveal>

          <Reveal className="mt-12">
            <div className="grid gap-6 md:grid-cols-2">
              <Figure
                ratio="screenPair"
                src="/cursor/test-welcome.webp"
                label="Test welcome page"
                alt="The self-serve test's welcome page: three short tasks, how it works, and what's recorded"
                caption="The welcome page says what’s recorded: clicks and timings. No camera, no screen recording."
              />
              <Figure
                ratio="screenPair"
                src="/cursor/test-task.webp"
                label="Task card"
                alt="Task 1 card in the corner of the prototype, with numbered steps and a You're done when line"
                caption="Each task card has steps and a “You’re done when” line. The first version didn’t."
              />
            </div>
          </Reveal>

          <Reveal className="mt-12">
            <Body>
              My first mistake was my own tasks: the first people who tried the
              test didn’t know they had to add their design, or what to do next.
              That round tested my writing, not my design, so I rewrote every task
              with steps and a “You’re done when” line.
            </Body>
          </Reveal>

          <Reveal className="mt-12">
            <SubHead>Task 2: change the heading and the button</SubHead>
            <div className="mt-4">
              <Table
                label="What each tester did in task 2"
                head={["Who", "Uses code tools", "How they changed it", "Ease /7", "What they said"]}
                rows={PEOPLE.map((p) => [p.name, p.code, p.how, p.ease, p.said])}
              />
            </div>
          </Reveal>

          <Reveal className="mt-12">
            <div className="flex flex-col gap-5">
              <Body>
                Three designers tried it: Vishwa, Yogesh and Ben. All three got
                stuck on the same moment, the wait. Yogesh pressed “done” while
                both his changes were still waiting, then told me the page
                “changed straight away”. Ben said he couldn’t see any loading
                indicator.
              </Body>
              <Body>
                Only Vishwa used Design Mode; Yogesh kept clicking the page
                itself, as if he expected it to respond. They still rated the task
                6 or 7 out of 7, which taught me to trust what people did over
                what they said.
              </Body>
              <Body>
                I also had a bug: Ben asked for both changes in one message, and
                my prototype only did one. And a bigger assumption: I built
                everything around Design Mode, but Ben told me, “I saw it but
                never explored it. I prefer typing changes.”
              </Body>
              <Body>
                They weren’t quite my user. All three had built pages with AI
                tools before. And I said no to one popular request: bringing back
                Cursor’s style sliders. Cursor removed them on purpose, and they
                help people who are already past setup, not the people I designed
                for.
              </Body>
            </div>
          </Reveal>
        </Section>

        {/* 08 · What changed */}
        <Section surface="canvas">
          <Reveal>
            <Eyebrow>08 · What changed</Eyebrow>
            <SectionTitle>I stopped explaining the wait and removed it</SectionTitle>
            <Body className="mt-6">
              My first fix explained the wait: a card, a progress bar, “Not
              applied yet”. Then I looked at how v0 and Figma Make handle it, and
              they don’t explain it at all. They show you the change straight
              away, before it’s saved.
            </Body>
          </Reveal>

          <Reveal className="mt-12">
            <Figure
              ratio="screen"
              src="/cursor/v10-waiting.webp"
              label="First fix: explaining the wait"
              alt="The first fix: a chat card says 3 edits waiting for the full build, not applied yet, while the page is unchanged"
              caption="My first fix (v10). The card is clear, but the page still doesn’t change, which is what confused people."
            />
          </Reveal>

          <Reveal className="mt-12">
            <PullQuote>Explaining a wait is weaker than removing it.</PullQuote>
          </Reveal>

          <Reveal className="mt-12">
            <SubHead>What I looked at</SubHead>
            <div className="mt-4">
              <Table
                label="How other tools handle visual edits, and what I took"
                head={["Tool", "What it does", "What I took"]}
                rows={TOOLS.map((t) => [
                  <a
                    key={t.name}
                    href={t.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="-my-3 inline-flex min-h-11 min-w-11 items-center underline decoration-ink/30 underline-offset-4 transition-colors hover:text-cobalt-ink"
                  >
                    {t.name}
                  </a>,
                  t.does,
                  t.took,
                ])}
              />
            </div>
          </Reveal>

          <Reveal className="mt-12">
            <Body>
              So in the final version your change appears on the page the moment
              you ask, marked “Preview · not saved”, and saves itself when the
              build finishes. Because Yogesh kept clicking the page, clicking any
              part now offers “Change this? · Edit in Design Mode”. I also added
              “Compare with Figma”, since the whole reason she’s editing is that
              the build doesn’t match her design.
            </Body>
          </Reveal>

          <Reveal className="mt-12">
            <div className="grid gap-6 md:grid-cols-2">
              <Figure
                ratio="screenPair"
                src="/cursor/screen-change-this.webp"
                label="Change this? offer"
                alt="Clicking the heading with Design Mode off shows a small bar: Change this? Edit in Design Mode"
                caption="Clicking the heading with Design Mode off offers a way in."
              />
              <Figure
                ratio="screenPair"
                src="/cursor/screen-compare.webp"
                label="Compare with Figma"
                alt="The browser panel showing the designer's Figma frame in place of the page, labelled for comparing, not editable"
                caption="Compare with Figma swaps the page for her frame, then back."
              />
            </div>
          </Reveal>

          <Reveal className="mt-16">
            <SubHead>Then I broke it again</SubHead>
            <Body className="mt-4">
              Instead of a second round of testing, I broke the new version on
              purpose. Eight more cases, each now designed:
            </Body>
            <div className="mt-6">
              <Table
                label="Edge cases in the final version"
                head={["#", "When", "What happens now"]}
                rows={EDGES.map((e) => [e.n, e.when, e.now])}
              />
            </div>
          </Reveal>

          <Reveal className="mt-12">
            <Figure
              ratio="screen"
              src="/cursor/screen-failed.webp"
              label="Full build stopped, changes kept"
              alt="The full build stopped; both changes stay on the page as a preview, with Try the full build again"
              caption="If the full build stops, her changes stay on the page as a preview, with a way to try again."
            />
          </Reveal>

          <Reveal className="mt-12">
            <Body>
              I didn’t retest this version. Finding the first three people took
              a week, so these changes are built on their findings but not yet
              proven.
            </Body>
          </Reveal>
        </Section>

        {/* 09 · Outcome */}
        <Section surface="paper">
          <Reveal>
            <Eyebrow>09 · Outcome</Eyebrow>
            <SectionTitle>What’s proven, and what isn’t yet</SectionTitle>
          </Reveal>

          <Reveal className="mt-10">
            <div className="grid gap-10 md:grid-cols-2">
              <div>
                <SubHead>Shown by the test</SubHead>
                <ul className="mt-4 flex flex-col gap-3 font-sans text-sm leading-[1.7] text-ink/75">
                  <li>The wait was the problem: 3 of 3 misread it.</li>
                  <li>2 of 3 typed their changes instead of using Design Mode.</li>
                  <li>Ease ratings stayed at 6 or 7 when the task failed.</li>
                  <li>Task wording decides what a self-serve test measures.</li>
                </ul>
              </div>
              <div>
                <SubHead>Not proven</SubHead>
                <ul className="mt-4 flex flex-col gap-3 font-sans text-sm leading-[1.7] text-ink/75">
                  <li>That the preview ends the confusion. Nobody has used it yet.</li>
                  <li>The metric. I never measured first edits in real sessions.</li>
                  <li>That my user behaves the same. The testers had used AI tools before.</li>
                  <li>That Design Mode is hard to find. That rests on two runs.</li>
                </ul>
              </div>
            </div>
          </Reveal>

          <Reveal className="mt-16">
            <SubHead>What I’d do differently</SubHead>
            <div className="mt-4 flex flex-col gap-5">
              <Body>
                I’d try my test tasks on one person before sending them out. The
                first round was lost to my wording, and recruiting is the slow
                part. I’d also look harder for designers who have never used a
                code tool, because that’s who the design is for, and nobody in my
                test was.
              </Body>
              <Body>
                <span className="font-medium text-ink">Next:</span> I’d test this
                version with two designers who’ve never used a code tool, to see if
                the preview ends the confusion about the wait.
              </Body>
            </div>
          </Reveal>

          <Reveal className="mt-16">
            <SubHead>Try it</SubHead>
            <div className="mt-4 flex flex-col gap-5">
              <Body>
                The prototype is live. You can click through the whole path, from
                adding your design to your first edit, and open every state,
                including the edge cases, from the panel in the corner.
              </Body>
              <Body>
                What’s faked: there’s no real build (it’s a timer), no real AI
                (whatever you type, the heading gets bigger, the button turns
                black, or the cards get rounder), and the Figma frame is a
                stand-in. Three people tested an earlier version; this one
                hasn’t been tested yet.
              </Body>
            </div>
            <a
              href={PROTOTYPE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="-my-3 mt-8 inline-flex min-h-11 items-center font-mono text-label uppercase tracking-[0.16em] text-cobalt-ink transition-opacity hover:opacity-70"
            >
              Open the prototype ↗
            </a>
          </Reveal>
        </Section>

        {/* Way out: back to the index, or straight on to the next project */}
        <Section surface="mist">
          <Reveal>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <p className="max-w-[40ch] font-display text-subhead font-medium leading-[1.1] tracking-[-0.015em]">
                That’s the Cursor concept.
              </p>
              <div className="flex flex-col gap-2 sm:items-end">
                <Link
                  href="/work/nextstep"
                  className="-my-3 inline-flex min-h-11 items-center font-mono text-label uppercase tracking-[0.16em] text-cobalt-ink transition-opacity hover:opacity-70"
                >
                  Next: NextStep →
                </Link>
                <Link
                  href="/#work"
                  className="-my-3 inline-flex min-h-11 items-center font-mono text-label uppercase tracking-[0.16em] text-ink/70 transition-colors hover:text-cobalt-ink"
                >
                  ← Back to all work
                </Link>
              </div>
            </div>
          </Reveal>
        </Section>
      </main>
      <Footer />
    </>
  );
}
