import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { Body, Eyebrow, Section, SectionTitle } from "@/components/case-study/section";
import { Figure } from "@/components/case-study/figure";
import { Reveal } from "@/components/case-study/reveal";

// Copy is Dilip's own, written section by section on 26 October 2026 from his
// project log (CASE.md in the Cursor project). Every number traces to that log.
// It is a concept: say so, and never imply it is Cursor's work or shipped.

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

const TOOLS = [
  { name: "v0 Design mode", href: "https://v0.app/docs/design-mode" },
  { name: "Lovable visual edits", href: "https://docs.lovable.dev/features/design.md" },
  {
    name: "Figma Make properties panel",
    href: "https://figma.com/blog/properties-panel-and-annotations-now-in-figma-make",
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
      <p className="font-display text-statement font-medium leading-[0.95] tracking-[-0.02em] text-cobalt-ink">
        {value}
      </p>
      <p className="mt-3 max-w-[32ch] font-sans text-sm leading-relaxed text-ink/70">
        {label}
      </p>
    </div>
  );
}

export default function CursorCaseStudy() {
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
                Removing the wait before a designer’s first edit. I bet designers
                couldn’t find Cursor’s visual editor. Three designers showed me
                the real problem was the wait, and that most of them would rather
                type.
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

        {/* 01 */}
        <Section surface="paper">
          <Reveal>
            <Eyebrow>01 · The bet</Eyebrow>
            <SectionTitle>Setup questions first, an editor named only on hover</SectionTitle>
            <Body className="mt-6">
              My bet: solo designers new to code tools don’t reach their first
              visual edit in Cursor, because it asks developer questions first,
              and only names the editor when you hover over it.
            </Body>
          </Reveal>
        </Section>

        {/* 02 */}
        <Section surface="canvas">
          <Reveal>
            <Eyebrow>02 · What already existed</Eyebrow>
            <SectionTitle>Other tools hide the files. Cursor can’t</SectionTitle>
            <Body className="mt-6">
              Lovable, Bolt and Replit start you with a prompt in the browser, and
              you never see a file. Cursor is a different kind of tool: it plans
              and builds a real project on your own computer, which is exactly why
              it asks setup questions. So I kept their prompt-first start, but I
              couldn’t copy their “no files” trick. I had to make the setup
              disappear inside Cursor instead.
            </Body>
          </Reveal>
        </Section>

        {/* 03 */}
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
                The posts were weak evidence. Only 2 of the 10 talked about
                getting stuck at setup; 4 were about the AI breaking things. And
                people who post are the ones who got past the start, so the
                designers I was designing for mostly weren’t there.
              </Body>
              <Body>
                My own run was clearer. On the web, a new account took me through
                6 minutes of setup screens, ending in “Connect GitHub to finish
                setup”, before I’d sent a single prompt. That’s why I kept the
                bet, and why testing it later mattered.
              </Body>
            </div>
          </Reveal>
        </Section>

        {/* 04 */}
        <Section surface="mist">
          <Reveal>
            <Eyebrow>04 · Findings</Eyebrow>
            <SectionTitle>The details held up. My headline didn’t</SectionTitle>
            <div className="mt-6 flex flex-col gap-5">
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

        {/* 05 */}
        <Section surface="paper">
          <Reveal>
            <Eyebrow>05 · What I got wrong</Eyebrow>
            <SectionTitle>My tasks, my prototype, my assumption</SectionTitle>
            <div className="mt-6 flex flex-col gap-5">
              <Body>
                My first mistake was my own tasks: the first people who tried the
                test didn’t know they had to add their design, or what to do
                next. That round tested my writing, not my design, so I rewrote
                every task with steps and a “You’re done when” line.
              </Body>
              <Body>
                My second was a bug: Ben asked for both changes in one message,
                and my prototype only did one.
              </Body>
              <Body>
                The bigger one was an assumption. I built everything around
                Design Mode, but Ben told me, “I saw it but never explored it. I
                prefer typing changes.”
              </Body>
            </div>
          </Reveal>
        </Section>

        {/* 06 */}
        <Section surface="canvas">
          <Reveal>
            <Eyebrow>06 · The design</Eyebrow>
            <SectionTitle>Your design first, the full build behind it</SectionTitle>
            <div className="mt-6 flex flex-col gap-5">
              <Body>
                The idea: your own design shows up first as a preview you can
                already edit, while the full build finishes behind it. Designers
                skip the tech-stack question, the browser opens by itself, and the
                pen icon becomes a button that says “Edit in Design Mode”.
              </Body>
              <Body>
                I kept it looking exactly like Cursor, down to measuring their
                text at 13px, because a designer should feel it was always there.
                I turned down two separate builds (extra cost), making it
                everyone’s default (it would slow developers down), and a tooltip
                pointing at the icon (a patch, not a fix).
              </Body>
            </div>
          </Reveal>

          <Reveal className="mt-12">
            <div className="grid gap-6 md:grid-cols-2">
              <Figure
                ratio="pair"
                src="/cursor/before-pen.webp"
                label="Before: Cursor's pen icon"
                alt="Before: Cursor's browser toolbar with an unlabelled pen icon"
                caption="Before: Cursor’s real pen icon. Its name only shows when you hover over it."
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

          <Reveal className="mt-12">
            <Figure
              ratio="screen"
              src="/cursor/screen-preview.webp"
              label="Preview ready to edit"
              alt="The designer's own page open as a preview in Cursor's browser panel, with the full build still running"
              caption="Her preview is ready to edit while the full build runs. No setup questions on the way."
            />
          </Reveal>
        </Section>

        {/* 07 */}
        <Section surface="paper">
          <Reveal>
            <Eyebrow>07 · Testing</Eyebrow>
            <SectionTitle>3 of 3 testers misread the wait</SectionTitle>
            <div className="mt-6 flex flex-col gap-5">
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
                They weren’t quite my user. All three had built pages with AI
                tools before. And I said no to one popular request: bringing back
                Cursor’s style sliders. Cursor removed them on purpose, and they
                help people who are already past setup, not the people I designed
                for.
              </Body>
            </div>
          </Reveal>
        </Section>

        {/* 08 */}
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
            <p className="mt-8 max-w-[46ch] font-display text-subhead font-medium leading-[1.2] tracking-[-0.01em] text-cobalt-ink">
              Explaining a wait is weaker than removing it.
            </p>
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
                ratio="screen"
                src="/cursor/screen-change-this.webp"
                label="Change this? offer"
                alt="Clicking the heading with Design Mode off shows a small bar: Change this? Edit in Design Mode"
                caption="Clicking the heading with Design Mode off offers a way in."
              />
              <Figure
                ratio="screen"
                src="/cursor/screen-compare.webp"
                label="Compare with Figma"
                alt="The browser panel showing the designer's Figma frame in place of the page, labelled for comparing, not editable"
                caption="Compare with Figma swaps the page for her frame, then back."
              />
            </div>
          </Reveal>

          <Reveal className="mt-12">
            <Body>
              I didn’t retest this version. Finding the first three people took
              a week, so these changes are built on their findings but not yet
              proven.
            </Body>
            <Body className="mt-5">
              <span className="font-medium text-ink">Next:</span> I’d test this
              version with two designers who’ve never used a code tool, to see if
              the preview ends the confusion about the wait.
            </Body>
          </Reveal>
        </Section>

        {/* 09 */}
        <Section surface="paper">
          <Reveal>
            <Eyebrow>09 · Try it</Eyebrow>
            <SectionTitle>What’s real and what’s faked</SectionTitle>
            <div className="mt-6 flex flex-col gap-5">
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

          <Reveal className="mt-16">
            <h3 className="font-sans text-sm font-medium text-ink/70">
              Tools I compared against
            </h3>
            <ul className="mt-4 flex flex-col gap-1 border-t border-ink/12 pt-4">
              {TOOLS.map((tool) => (
                <li key={tool.name}>
                  <a
                    href={tool.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center font-sans text-sm text-ink/75 underline decoration-ink/30 underline-offset-4 transition-colors hover:text-cobalt-ink"
                  >
                    {tool.name}
                  </a>
                </li>
              ))}
            </ul>
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
