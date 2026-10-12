import { Body, Eyebrow, Section, SectionTitle } from "./section";
import { Reveal } from "./reveal";
import { SusScores } from "./sus-scores";

function Findings({
  heading,
  items,
  accent = false,
}: {
  heading: string;
  items: string[];
  accent?: boolean;
}) {
  return (
    <div>
      <h4 className="font-mono text-label uppercase tracking-[0.16em] text-ink/70">
        {heading}
      </h4>
      <ul className="mt-4 flex flex-col gap-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span
              aria-hidden
              className={`mt-2 h-1 w-1 shrink-0 rounded-full ${
                accent ? "bg-cobalt" : "bg-ink/30"
              }`}
            />
            <p className="font-sans text-sm leading-[1.65] text-ink/75">
              {item}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Found and changed sit side by side deliberately: the pairing is the evidence
// that testing actually moved the design.
function Round({
  index,
  title,
  meta,
  found,
  changed,
  note,
}: {
  index: string;
  title: string;
  meta: string;
  found: string[];
  changed: string[];
  // Where the round fell short. Naming it beats letting a reader spot the gap.
  note?: string;
}) {
  return (
    <Reveal className="border-t border-ink/12 pt-10 md:pt-12">
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <span className="font-mono text-label tabular-nums tracking-[0.14em] text-cobalt-ink">
          {index}
        </span>
        <h3 className="font-serif text-subhead font-normal leading-[1.1] tracking-[-0.01em]">
          {title}
        </h3>
      </div>
      <p className="mt-3 max-w-[60ch] font-sans text-sm leading-[1.65] text-ink/70">
        {meta}
      </p>
      <div className="mt-8 grid gap-8 md:grid-cols-2 md:gap-12">
        <Findings heading="What we found" items={found} />
        <Findings heading="What we changed" items={changed} accent />
      </div>
      {note && (
        <p className="mt-8 max-w-[62ch] border-t border-ink/12 pt-6 font-serif text-sm italic leading-relaxed text-ink/70">
          {note}
        </p>
      )}
    </Reveal>
  );
}

export function NextStepTesting() {
  return (
    <Section id="testing" surface="canvas">
      <Reveal>
        <Eyebrow>07 · Usability testing</Eyebrow>
        <SectionTitle>We tested twice: scrappy first, then real users</SectionTitle>
        <Body className="mt-6">
          The first round was fast and informal. The second was with the people
          the app is actually for.
        </Body>
      </Reveal>

      <div className="mt-14 flex flex-col gap-12 md:gap-16">
        <Round
          index="R1"
          title="Guerrilla testing with students"
          meta="We grabbed five students on campus who had no context about the app, gave them tasks, and watched."
          found={[
            "Users weren't sure what the app was for at first glance. It needed stronger onboarding or a clearer homepage.",
            "The navbar didn't clearly show which tab was active.",
            "Joining a community group was confusing.",
            "Doctor contact options were hard to find.",
            "The book-appointment button (just a “+” icon) wasn't understood.",
          ]}
          changed={[
            "Shifted the primary colour to a more vibrant blue for better visual contrast.",
            "Redesigned nav bar icons and added clearer active and inactive states.",
            "Moved the contact button to a more prominent position with a recognisable icon.",
            "Changed the “+” to a labelled “Book Appointment” button.",
          ]}
          note="Worth being straight about one thing: we never directly addressed the comprehension finding. Nothing we changed in this round was an onboarding or first-run fix. Purpose clarity did improve by round two, but as a knock-on effect of the contrast and labelling work, not because we designed for it. If I ran this again, I'd design a first-run onboarding flow specifically for the comprehension finding and test that flow on its own."
        />

        <Round
          index="R2"
          title="Testing with patients and doctors"
          meta="Five participants: two patients and three doctors. We ran remote sessions in Maze and asked participants to think aloud."
          found={[
            "Purpose clarity improved. Users understood the app faster.",
            "Visual elements were easy to understand thanks to iOS conventions.",
            "The “+” symbol for booking was still unclear to some.",
            "The appointment confirmation checkbox was too small.",
          ]}
          changed={[
            "Added a text label to the booking button.",
            "Enlarged the confirmation checkbox.",
          ]}
          note="The sample is the weak point in this round. Three of the five participants were clinicians, so the 84.5 average leans towards people who read interfaces professionally, not towards someone recovering from a stroke, who is the actual user. The score is encouraging, not conclusive."
        />
      </div>

      <Reveal className="mt-14">
        <SusScores />
      </Reveal>
    </Section>
  );
}
