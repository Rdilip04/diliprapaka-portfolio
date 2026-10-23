import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Figtree, Outfit } from "next/font/google";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { Icon, type IconName } from "@/components/quietly/icon";
import { Film } from "@/components/quietly/film";
import { Compare } from "@/components/quietly/compare";
import { LivePhone } from "@/components/quietly/live-phone";
import { NightsMonth } from "@/components/quietly/month";
import { Thresholds, WeatherSwitch } from "@/components/quietly/story-demos";
import { BreakDemo, HatchDemo, NoriDemo, PressDemo, ShieldSwitch, SpringCurves } from "@/components/quietly/playground";
import { nori, seed, world } from "@/lib/quietly/art";
import "./quietly.css";

/* Quietly's own type, scoped to this page: Outfit for the story voice, and the
   system's rounded face for the interface, with Figtree where SF Pro Rounded
   isn't installed. An agreed exception to the site's two-family rule (LOG.md,
   23 October 2026): this page is set in the product's world, not the portfolio's. */
const outfit = Outfit({ variable: "--q-outfit", subsets: ["latin"], weight: ["300", "400"], display: "swap" });
const figtree = Figtree({ variable: "--q-figtree", subsets: ["latin"], weight: ["400", "600", "700"], display: "swap" });

export const metadata: Metadata = {
  title: "Quietly: bedtime phone app case study",
  description:
    "Quietly, an iPhone app concept for putting your phone down at bedtime: the bet, the trade-offs, and the interface craft, with the before and after of every decision.",
};

const FIGMA = "https://www.figma.com/design/1eIw6RUoX8BcFC12ZJ3brS";
const GLOW = "#8EF0D6";

// The art is drawn by the app's own kit at build time, so the page and the screens can't drift apart.
const ART = {
  heroWide: world("milestone", { w: 1600, h: 900, mood: "sleeping", islandX: 1160, islandY: 560, size: 1.15, sunAt: [0.86, 0.19] }),
  heroNarrow: world("milestone", { w: 390, h: 844, mood: "sleeping", islandY: 700, size: 0.72, sunAt: [0.82, 0.12] }),
  dawn: world("recovery", { w: 1600, h: 640, mood: "playful", islandX: 1150, islandY: 430, size: 0.9, sunAt: [0.88, 0.2] }),
  seed: seed({}),
  noriIdle: nori({ mood: "idle", glow: GLOW, glowAmt: 0.7, night: true }),
  noriHatched: nori({ mood: "celebrating", glow: GLOW, glowAmt: 0.9, night: true }),
};

type Item = { icon: IconName; title: string; text: string };

function IconList({ items, className = "rejected" }: { items: Item[]; className?: string }) {
  return (
    <ul className={className}>
      {items.map((it) => (
        <li key={it.title}>
          <Icon name={it.icon} />
          <span><b>{it.title}</b> {it.text}</span>
        </li>
      ))}
    </ul>
  );
}

function Steps({ title, before, wrong, after, cols = false, titleClass = "" }: { title: string; before?: ReactNode; wrong: ReactNode; after: ReactNode; cols?: boolean; titleClass?: string }) {
  return (
    <>
      <h3 className={`ba-title ${titleClass}`.trim()}>{title}</h3>
      <div className={cols ? "ba-steps ba-text text-cols" : "ba-steps"}>
        {before && (
          <div><p className="step"><Icon name="clock-counter-clockwise-bold" />Before</p><p>{before}</p></div>
        )}
        <div><p className="step"><Icon name="warning-circle-bold" />What was wrong</p><p>{wrong}</p></div>
        <div className="after"><p className="step"><Icon name="check-circle-bold" />After</p><p>{after}</p></div>
      </div>
    </>
  );
}

function Phone({ src, alt, sizes = "240px" }: { src: string; alt: string; sizes?: string }) {
  return (
    <figure className="phone">
      <Image src={src} alt={alt} fill sizes={sizes} />
    </figure>
  );
}

function SectionHead({ n, id, children }: { n: string; id: string; children: ReactNode }) {
  return (
    <div className="sec-head">
      <span className="sec-num">{n}</span>
      <h2 id={id} className="h2">{children}</h2>
    </div>
  );
}

type RailItem = { title: string; caption: string } & ({ src: string; alt: string } | { clip: string; label: string });

const RAIL: RailItem[] = [
  { title: "The hatch", caption: "Nori arrives because you held on. Whether that builds a bond is an assumption to test.", src: "/quietly/screens/the-hatch.webp", alt: "The hatch, hold to hatch Nori." },
  { title: "The glance", caption: "How the day is going in under three seconds, with a plain caption in the first week.", src: "/quietly/screens/the-glance.webp", alt: "The glance, the Grove home in the afternoon." },
  { title: "Choosing a break", caption: "The menu grows from the button that opened it.", src: "/quietly/screens/choosing-a-break.webp", alt: "Choosing a break, the menu grown from the break button." },
  { title: "Break until morning", caption: "After bedtime a tap always means Until morning. Nori sleeps, and the phone can too.", clip: "/quietly/clips/break", label: "one tap after bedtime starts a break until morning" },
  { title: "Live Activity", caption: "Nori asleep is a softer brake than a blocked app.", clip: "/quietly/clips/live", label: "the break counting on the Lock Screen" },
  { title: "First light", caption: "A quiet night becomes new shoots by morning.", clip: "/quietly/clips/firstlight", label: "first light, two new shoots and Nori waking" },
  { title: "Widgets", caption: "The answer with zero taps. Refresh at each threshold needs a real build.", src: "/quietly/screens/home-screen-widgets.webp", alt: "Home Screen widgets in three sizes." },
  { title: "Dynamic Island", caption: "Says once, gently, that 2 minutes have passed. Needs a real build.", src: "/quietly/screens/dynamic-island.webp", alt: "Nori in the Dynamic Island." },
  { title: "One month together", caption: "A change to Nori that can't be lost.", src: "/quietly/screens/one-month-together.webp", alt: "One month together, Nori grows a silver frond." },
  { title: "Privacy and your data", caption: "Plain lists of what Quietly can and can't see, instead of a policy.", src: "/quietly/screens/privacy-and-your-data.webp", alt: "Privacy and your data settings." },
];

export default function QuietlyCaseStudy() {
  return (
    <div className={`qcs ${outfit.variable} ${figtree.variable}`}>
      <Nav />
      <main id="main" className="qcs-main">
        {/* ============ Hero ============ */}
        <section className="hero" aria-labelledby="title">
          <div className="hero-art" aria-hidden="true">
            <div className="wide" dangerouslySetInnerHTML={{ __html: ART.heroWide }} />
            <div className="narrow" dangerouslySetInnerHTML={{ __html: ART.heroNarrow }} />
          </div>
          <div className="wrap hero-in">
            <Link href="/#work" className="back-link"><Icon name="caret-left-bold" />All work</Link>
            <h1 id="title" className="logo" aria-label="Quietly">
              <span aria-hidden="true">
                qu
                <span className="i">
                  ı
                  <svg viewBox="-10 -10 20 20" aria-hidden="true">
                    <path d="M3 -8.5 A9 9 0 1 0 8.6 3.2 A7 7 0 1 1 3 -8.5 Z" fill="#F2C46B" />
                  </svg>
                </span>
                etly
              </span>
            </h1>
            <p className="name-line">An iPhone app for putting your phone down at bedtime.</p>
            <p className="chip"><Icon name="moon-fill" />A concept. Not built, not tested with people.</p>
          </div>
        </section>

        <div className="wrap film">
          <Film />
          <dl className="facts">
            <div><dt>Role</dt><dd>Solo. Product, interaction and visual design</dd></div>
            <div><dt>When</dt><dd>October 2026, self-initiated</dd></div>
            <div><dt>Made with</dt><dd>HTML and CSS screens, Remotion, Claude Code, Fish Audio</dd></div>
            <div><dt>Status</dt><dd>76 screens and a film. No one has used it yet</dd></div>
            <div>
              <dt>Figma</dt>
              <dd>
                <a className="ext" href={FIGMA} target="_blank" rel="noopener noreferrer">Open the prototype<Icon name="arrow-up-right-bold" /></a>
                <span className="ext-note">Rules of 22 October</span>
              </dd>
            </div>
          </dl>
        </div>

        {/* ============ 01 The problem ============ */}
        <section className="sec" aria-labelledby="s1">
          <div className="wrap">
            <SectionHead n="01" id="s1">Scrolling past bedtime</SectionHead>
            <div className="split indent">
              <div>
                <p className="lead">It&apos;s 12:40 am. The alarm is set for 7, and the next video is already playing.</p>
                <p className="body mt-32">Quietly is for someone who means to be asleep by 11 and, three nights a week, is still scrolling at 12:40 am, knowing they&apos;ll regret it at 7.</p>
                <p className="body">Stopping pays off months later and invisibly: better sleep, better mornings. The next video pays off now. Screen Time, Downtime and Sleep Focus can count or lock, but <b>nothing makes the reward of putting the phone down visible the next morning.</b></p>
                <h3 className="h3 mt-32">Who it&apos;s not for</h3>
                <IconList items={[
                  { icon: "lock-simple-bold", title: "People who want the phone locked.", text: "Downtime and Hush already do that." },
                  { icon: "clock-countdown-bold", title: "People whose bedtime moves,", text: "like shift workers. The rule assumes a regular phone bedtime." },
                  { icon: "users-bold", title: "Children.", text: "That's Screen Time with Family Sharing, a different job." },
                  { icon: "first-aid-bold", title: "People with a sleep disorder.", text: "A clinical problem, not a habit." },
                ]} />
              </div>
              <div className="phones">
                <LivePhone clip="/quietly/clips/bedtime" label="the bedtime reminder at 10:15, then the grove settling for the night at 10:30" sizes="240px" />
                <Phone src="/quietly/screens/opening-after-bedtime.webp" alt="Opening Quietly at 11:31 pm: Nori is asleep. Tonight's new shoots will wait for tomorrow. Below, an offer to start a break until 7:00 am." />
              </div>
            </div>
          </div>
        </section>

        {/* ============ 02 The bet ============ */}
        <section className="sec" aria-labelledby="s2">
          <div className="wrap">
            <SectionHead n="02" id="s2">One feature, one number</SectionHead>
            <div className="indent">
              <p className="lead wide">Quietly doesn&apos;t try to win at 12:40 am. It moves the decision to bedtime, when stopping is easier.</p>
              <div className="split wide-left mt-48">
                <div>
                  <dl className="group">
                    <div className="row"><dt>The feature</dt><dd>The quiet evening. You choose a phone bedtime, and a night that stays quiet grows the grove by morning.</dd></div>
                    <div className="row"><dt>Helped by</dt><dd>The month of nights, breaks that last until morning, and the Lock Screen and widgets.</dd></div>
                    <div className="row"><dt>Stage</dt><dd>Retention, of the habit rather than of the app.</dd></div>
                    <div className="row"><dt>The number</dt><dd>Quiet evenings per week, weeks 2 to 4 against week 1. A quiet evening is under 10 minutes on counted apps between phone bedtime and 6:00 am.</dd></div>
                  </dl>
                  <p className="foot mt-12">Not app opens or time in the app. If Quietly works completely, people open it less.</p>
                </div>
                <div>
                  <h3 className="h3">What could prove this wrong</h3>
                  <ol className="wrong-list">
                    <li><span className="n">1</span><span><b>Nothing changes</b>Quiet evenings in weeks 2 to 4 don&apos;t rise above week 1, or rise no more than with Downtime alone.</span></li>
                    <li><span className="n">2</span><span><b>The reward adds scrolling</b>People open Quietly after bedtime to check on Nori. iOS can count those opens.</span></li>
                    <li className="risk"><span className="n">3</span><span><b>The morning loses to the next video</b>At 12:40 am, a grove they&apos;ll see at 7 am doesn&apos;t outweigh the next video.<span className="badge"><Icon name="moon-fill" />My riskiest assumption</span></span></li>
                  </ol>
                </div>
              </div>

              <h3 className="h3 mt-64">The closest apps, checked on 22 October 2026</h3>
              <div className="table-scroll mt-16" tabIndex={0} role="region" aria-label="Comparison of Apple Wind Down, Hush and Quietly">
                <table className="compare-table">
                  <thead><tr><th scope="col"><span className="sr-only">Question</span></th><th scope="col">Apple&apos;s Wind Down</th><th scope="col">Hush</th><th scope="col" className="us">Quietly</th></tr></thead>
                  <tbody>
                    <tr><th scope="row">Acts at bedtime</th><td>Yes, starts Sleep Focus up to 3 hours before</td><td>Yes, a bedtime per night of the week</td><td className="us">Yes, a reminder and a break until morning</td></tr>
                    <tr><th scope="row">Locks apps</th><td>No</td><td>Every app except a chosen few</td><td className="us">No. An app shield is opt-in</td></tr>
                    <tr><th scope="row">Reward</th><td>None</td><td>A creature hatches</td><td className="us">The grove grows by morning</td></tr>
                    <tr><th scope="row">After a late night</th><td>Nothing</td><td>The egg goes cold, then a charm or a pet is lost</td><td className="us">Nothing new grows. Nothing is lost</td></tr>
                  </tbody>
                </table>
              </div>
              <p className="body mt-24">Moving the decision to bedtime isn&apos;t new: Apple&apos;s Wind Down already does it. What Quietly adds is the reward Apple doesn&apos;t give, without the lock and the losses Hush uses. Whether a reward without a lock is enough is exactly the riskiest assumption.</p>

              <div className="ba text-only">
                <div>
                  <Steps
                    cols
                    title="How the bet changed"
                    before={<>The film&apos;s name line said Quietly &ldquo;turns your screen time into weather&rdquo;, and much of the build served phone time all day: daily plans, daytime weather, neighbours.</>}
                    wrong="The person who'd pay is building a habit of sleeping on time. The challenge on 22 October found the build serving everyone and no one, with no defined person and no problem statement."
                    after={<>One feature, the quiet evening. Daytime phone time, neighbours and sharing moved to &ldquo;Not in this project&rdquo;. The film was re-cut around bedtime.</>}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ 03 Screen Time ============ */}
        <section className="sec" aria-labelledby="s3">
          <div className="wrap">
            <SectionHead n="03" id="s3">Designing inside Screen Time: thresholds, not minutes</SectionHead>
            <div className="split indent">
              <div>
                <p className="body">Quietly can&apos;t read your minutes. iOS shows them only in Apple&apos;s sealed report view, and tells the app&apos;s code when a threshold is crossed.</p>
                <p className="body">So every rule in Quietly is a line that can be crossed, not a number that can be read. Quietly never knows when the phone went down, which is why the number counts evenings, not bedtimes.</p>
                <Thresholds />
                <h3 className="h3 mt-32">To check in a real build</h3>
                <p className="body mt-12">Apple&apos;s documentation doesn&apos;t settle these, so they need a test build on a real iPhone.</p>
                <IconList className="checks" items={[
                  { icon: "circle-dashed-bold", title: "Nori stirs in the Dynamic Island at 2 minutes.", text: "Can the Screen Time extension update a running Live Activity?" },
                  { icon: "circle-dashed-bold", title: "Widgets refresh at every threshold.", text: "Within iOS's refresh budget?" },
                  { icon: "circle-dashed-bold", title: "Widgets show minutes left.", text: "The code only learns which threshold was crossed, so “23 min left” may round to the last one." },
                ]} />
              </div>
              <div className="phones">
                <Phone src="/quietly/screens/permission-explained.webp" alt="Permission, explained: why Quietly asks for Screen Time access and what it can't see." />
                <Phone src="/quietly/screens/phone-bedtime.webp" alt="Phone bedtime setting with a time wheel and a plain explanation." />
              </div>
            </div>
          </div>
        </section>

        {/* Interlude: first light, in the day appearance */}
        <div className="interlude" aria-hidden="true">
          <div className="art" dangerouslySetInnerHTML={{ __html: ART.dawn }} />
          <div className="wrap"><p className="stamp">Thursday, first light</p><p className="story">A quiet night. Two new shoots came up while you slept.</p></div>
        </div>

        {/* ============ 04 Missed gain ============ */}
        <section className="sec" aria-labelledby="s4">
          <div className="wrap">
            <SectionHead n="04" id="s4">A late night is a missed gain, not a loss</SectionHead>
            <div className="split indent">
              <div>
                <p className="lead">Past 10 minutes after bedtime, tonight&apos;s growth is missed. That&apos;s all.</p>
                <p className="body mt-24">No rain at night. Nori keeps sleeping. In the morning, the grove is exactly as it was. In the month of nights, the night gets an empty moon, never red and never a cross.</p>
                <p className="body">The trade-off I accepted: no alarm at 12:40 am. The bet is won at bedtime, not then.</p>
                <h3 className="h3 mt-32">Rejected</h3>
                <IconList items={[
                  { icon: "cloud-rain-bold", title: "Rain and storms at night.", text: "A cost, felt at the worst moment." },
                  { icon: "plant-bold", title: "The grove wilting.", text: "A loss, like a pet's health in Offline Pets." },
                  { icon: "eye-bold", title: "Nori waiting up.", text: "Guilt, delivered through a character." },
                ]} />
              </div>
              <WeatherSwitch />
            </div>

            <div className="ba indent">
              <Compare
                before="/quietly/before/the-morning-after-a-storm.webp"
                after="/quietly/screens/the-morning-after-a-late-night.webp"
                beforeAlt="the morning after a storm, The rain stopped before dawn. Today starts fresh."
                afterAlt="the morning after a late night, the same grove, A late night. The grove kept everything it had."
              />
              <div>
                <Steps
                  title="How the late-night rule changed"
                  before={<>Crossing bedtime made the grove rain through the night and Nori hide. The morning read &ldquo;The rain stopped before dawn&rdquo;, and the week showed &ldquo;one stormy night on Thursday&rdquo;.</>}
                  wrong="At 1 am, rain reads as a punishment. It broke my own principle that crossing the line means not gaining, never losing. The challenge on 22 October caught the build disagreeing with the principle, and I agreed."
                  after={<>&ldquo;Storm&rdquo; is retired. The morning after a late night shows the same grove: &ldquo;A late night. The grove kept everything it had.&rdquo; Rain now only means the daytime rule, which sits outside the bet.</>}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ============ 05 Month of nights ============ */}
        <section className="sec" aria-labelledby="s5">
          <div className="wrap">
            <SectionHead n="05" id="s5">A month shows the habit, one night at a time</SectionHead>
            <div className="split indent">
              <div>
                <p className="lead">A longer view, like the Apple Fitness calendar, where a pattern matters more than a perfect run.</p>
                <p className="body mt-24">The Nights tab shows one moon per night: filled for a quiet evening, empty for a late night, a dash when iOS sent no data.</p>
                <p className="body"><b>Try it: tap a night.</b> The sheet rises on a critically damped spring and says which rule the night met, with no clock times, because iOS reports thresholds, not times.</p>
                <IconList className="checks mt-32" items={[
                  { icon: "hand-tap-bold", title: "Every night is a 44 pt target,", text: "so the month fills the width instead of shrinking." },
                  { icon: "circle-half-bold", title: "Filled and empty moons differ by shape,", text: "not only colour." },
                  { icon: "speaker-high-bold", title: "Each night has its own VoiceOver label,", text: "for example “Thursday 16 October, late night”." },
                ]} />
              </div>
              <div>
                <NightsMonth />
                <p className="foot new-state">Every kind of night has its own sheet: quiet, late and no data.</p>
              </div>
            </div>

            <div className="ba indent">
              <Compare
                before="/quietly/before/this-week.webp"
                after="/quietly/screens/nights.webp"
                beforeAlt="This Week, seven days of daytime weather with one stormy night."
                afterAlt="the Nights tab, a month of moons and this week's quiet evenings."
              />
              <div>
                <Steps
                  title="How the third tab changed"
                  before="The third tab was This Week: seven days of daytime weather against a daily phone time plan, with the night as one stormy icon."
                  wrong="The longer view I'd described as the real motivator didn't exist. A week is too short to see a habit form, and the chart measured the day; nights were one row under it."
                  after="The tab is called Nights: the month on top, this week under it. I rejected a Week and Month switch (one place, two names) and putting the month on the Grove (a glance would become a dashboard)."
                />
              </div>
            </div>
          </div>
        </section>

        {/* ============ 06 The craft ============ */}
        <section className="sec" aria-labelledby="s6">
          <div className="wrap">
            <SectionHead n="06" id="s6">Made to feel like iOS</SectionHead>
            <div className="indent">
              <p className="body">Quietly follows Apple&apos;s Human Interface Guidelines: SF Pro Rounded for the interface, Outfit only for the grove&apos;s story lines, one gold tint for anything you can press, neutral glass in two weights, and springs that settle without bouncing unless your finger threw them. This page follows the same rule: <b>if it&apos;s gold, you can press it.</b> Everything below is live.</p>
            </div>

            <h3 className="sub-h mt-48">Try the interactions</h3>
            <div className="play">
              <div className="tile">
                <h4>Press state</h4>
                <p className="how">Press and hold the button.</p>
                <PressDemo />
                <p className="spec">Scales to 97% in 100 ms while pressed. Released, it springs back.</p>
              </div>
              <div className="tile">
                <h4>The break button</h4>
                <p className="how">Tap to rest until morning. Hold for more choices.</p>
                <BreakDemo />
                <p className="spec">After bedtime a tap always means Until morning, with Undo for 5 seconds. Holding opens the menu from the button (0.5 s in this demo).</p>
              </div>
              <div className="tile">
                <h4>Hold to hatch</h4>
                <p className="how">Press and hold the seed until it opens.</p>
                <HatchDemo seedSvg={ART.seed} noriSvg={ART.noriHatched} />
              </div>
              <div className="tile">
                <h4>Nori, tapped</h4>
                <p className="how">Tap Nori.</p>
                <NoriDemo idleSvg={ART.noriIdle} />
                <p className="spec">A hop on the one spring allowed to bounce (damping 0.8), because the tap threw it. Then it settles.</p>
              </div>
              <div className="tile">
                <h4>A setting, off by default</h4>
                <p className="how">Switch it on.</p>
                <ShieldSwitch />
                <p className="spec">The knob stretches while pressed and slides on the default spring.</p>
              </div>
              <div className="tile curves">
                <h4>The springs</h4>
                <p className="how">Every curve is a token, exported as CSS linear().</p>
                <SpringCurves />
              </div>
            </div>

            <h3 className="sub-h mt-64">The system underneath</h3>
            <div className="tokens">
              <div className="sys">
                <h4>Colour</h4>
                <p className="how">Cool green greys, never beige. One tint, and green and red for meaning only.</p>
                <div className="swatches mt-16">
                  <div className="swatch" style={{ background: "#0E1714" }}><b>Night ink</b>#0E1714</div>
                  <div className="swatch" style={{ background: "#1E2D27" }}><b>Ink 800</b>#1E2D27</div>
                  <div className="swatch" style={{ background: "#F2C46B", color: "#0E1714" }}><b>Lantern</b>#F2C46B, press only</div>
                  <div className="swatch" style={{ background: "#8EF0D6", color: "#0E1714" }}><b>Night glow</b>#8EF0D6, the world</div>
                  <div className="swatch" style={{ background: "#E4EAE3", color: "#15211C" }}><b>Mist</b>#E4EAE3</div>
                  <div className="swatch" style={{ background: "#A9BCA8", color: "#15211C" }}><b>Sage</b>#A9BCA8</div>
                </div>
              </div>
              <div className="sys">
                <h4>Type</h4>
                <p className="how">iOS text styles. Two weights, 400 for reading and 600 for labels.</p>
                <div className="typeset mt-16">
                  <div><span style={{ font: "700 34px/1.1 var(--font-ui)" }}>Nights</span><small>Large Title, rounded</small></div>
                  <div><span className="story" style={{ fontSize: 24, lineHeight: 1.2 }}>A quiet night.</span><small>Story, Outfit</small></div>
                  <div><span style={{ font: "400 17px var(--font-ui)" }}>Under 10 min after bedtime</span><small>Body 17</small></div>
                  <div><span style={{ font: "400 13px var(--font-ui)", color: "var(--label-2)" }}>Windy since 4:52 pm</span><small>Footnote 13</small></div>
                </div>
              </div>
            </div>

            <div className="stats">
              <div className="stat"><b>4.66:1</b><p>The lowest text contrast across 764 texts on the screens, measured over the real art, glass included.</p></div>
              <div className="stat"><b>44 pt</b><p>The smallest tap target, except segmented controls at Apple&apos;s own 31 pt.</p></div>
              <div className="stat"><b>4 settings</b><p>Reduce Motion, Reduce Transparency, Increase Contrast and Dynamic Type each have a designed state.</p></div>
            </div>
          </div>

          <div className="wrap mt-64">
            <h3 className="sub-h">The screens</h3>
            <p className="foot live-note"><Icon name="play-fill" /> Screens with this mark move: hover, focus or tap them. The motion is cut from the film.</p>
          </div>
          <div className="rail" tabIndex={0} role="region" aria-label="Key screens, scroll sideways">
            {RAIL.map((s) => (
              <figure key={s.title}>
                {"clip" in s ? (
                  <LivePhone clip={s.clip} label={s.label} sizes="220px" />
                ) : (
                  <div className="phone"><Image src={s.src} alt={s.alt} fill sizes="220px" /></div>
                )}
                <figcaption><b>{s.title}</b><span>{s.caption}</span></figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* ============ 07 Paying once ============ */}
        <section className="sec" aria-labelledby="s7">
          <div className="wrap">
            <SectionHead n="07" id="s7">Paying once, after a free month</SectionHead>
            <div className="indent">
              <blockquote className="quote">
                <p>&ldquo;If it works completely, they stop checking their screen time and may stop using the app.&rdquo;</p>
                <footer>Me, answering the challenge on 22 October. A model that earns once fits a habit that ends.</footer>
              </blockquote>

              <div className="path mt-48">
                <div>
                  <p className="path-label">Night 1 to night 30</p>
                  <p className="big">Everything is free for the first month.</p>
                  <div className="weeks" role="img" aria-label="Weeks 1 to 4, the weeks the bet is measured over"><span>Week 1</span><span>2</span><span>3</span><span>4</span></div>
                  <p>The same four weeks the bet is measured over, so everyone gets the reward while it&apos;s being tested.</p>
                </div>
                <div>
                  <p className="path-label">One month together</p>
                  <p className="big">One offer, after a quiet night.</p>
                  <p>If night 30 was late, it waits for the next quiet morning. Never at bedtime.</p>
                </div>
                <div>
                  <p className="path-label">Then</p>
                  <div className="forks">
                    <div><b>Buy once</b>The grove keeps growing.</div>
                    <div><b>Don&apos;t buy</b>Nothing is taken away. The grove stays, and the month keeps counting.</div>
                  </div>
                </div>
              </div>

              <div className="ba">
                <Compare
                  before="/quietly/before/quietly-plus.webp"
                  after="/quietly/screens/keep-the-grove-growing.webp"
                  beforeAlt="Quietly Plus, yearly, monthly or lifetime plans with a 2-week free trial."
                  afterAlt="Keep the grove growing, one purchase, with the price marked as a placeholder."
                />
                <div>
                  <Steps
                    title="Round 1"
                    before="Quietly Plus: £24.99 a year, £3.99 a month or £59.99 once, after a 2-week trial, selling new places and every visitor."
                    wrong="A subscription earns from people who stay, so the product's success becomes churn. Plus sold more things to look at. And the prices had no source."
                    after="Pay once, after two free weeks."
                  />
                  <Steps
                    titleClass="mt-32"
                    title="Round 2, the next day"
                    wrong="A day 15 paywall cut the reward in the middle of the four weeks being measured. The number would mix people who still got the reward with people who didn't."
                    after="A free first month. The cost I accepted: revenue two weeks later, and more people who never pay."
                  />
                </div>
              </div>

              <div className="split mt-64">
                <div>
                  <h3 className="h3">Rejected</h3>
                  <IconList items={[
                    { icon: "arrows-clockwise-bold", title: "A subscription.", text: "Earns from people who stay." },
                    { icon: "megaphone-bold", title: "Ads.", text: "Earn from attention, the thing we ask people to give up." },
                    { icon: "database-bold", title: "Selling data.", text: "Breaks “your screen time stays on this iPhone”." },
                  ]} />
                </div>
                <div>
                  <h3 className="h3">Still open</h3>
                  <IconList items={[
                    { icon: "tag-bold", title: "The price.", text: "An assumption to test. The £9.99 on the screen is a placeholder." },
                    { icon: "chart-line-bold", title: "The revenue measure.", text: "Of the people with four or more quiet evenings a week by week 4, how many buy." },
                    { icon: "coins-bold", title: "The cost.", text: "No recurring revenue. Each person is worth one sale." },
                  ]} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ 08 AI ============ */}
        <section className="sec" aria-labelledby="s8">
          <div className="wrap">
            <SectionHead n="08" id="s8">How I used AI, and what I decided</SectionHead>
            <div className="indent">
              <p className="body">I worked with Claude, in Claude Code, on the screens, the film and the reviews. It built what I specified and attacked what I&apos;d decided, in structured challenge rounds. Every critique is logged with its source, and every change names the critique it answers.</p>

              <div className="cols mt-32">
                <div className="col">
                  <h3><Icon name="cpu-bold" />What the AI did</h3>
                  <ul>
                    <li><b>Built the 76 screens</b> in HTML and CSS from my rules, and the film in Remotion.</li>
                    <li><b>Challenged the design</b> in rounds: 14 findings on 19 October, 13 fixed, and the core bet left open because only people can close it.</li>
                    <li><b>Checked the competitors</b> on the App Store, found Hush, and showed that Apple&apos;s Wind Down already acts at bedtime. That ended my claim that acting at bedtime is what makes Quietly different.</li>
                    <li><b>Caught overclaims</b> in the copy: privacy lines that weren&apos;t true, and a research citation stretched too far.</li>
                  </ul>
                </div>
                <div className="col">
                  <h3><Icon name="user-focus-bold" />What I decided</h3>
                  <ul>
                    <li><b>A late night is a missed gain.</b> My principle, which the build was breaking.</li>
                    <li><b>The month of nights,</b> from the Apple Fitness calendar.</li>
                    <li><b>Pay once,</b> because success means people leave. Then the free first month over two free weeks.</li>
                    <li><b>The look and the voice:</b> the quiet moon logo from nine options, the film&apos;s voice from three, and the sky following the time of day in the film.</li>
                  </ul>
                </div>
              </div>

              <ol className="timeline" aria-label="Timeline, 19 to 23 October 2026">
                <li><b>19 October</b><p>First challenge: 14 findings. The quiet evening rule, the break rule and unsourced statistics fixed.</p></li>
                <li><b>20 October</b><p>Competitor claims checked on the App Store. The original competitor table dropped as unreliable.</p></li>
                <li><b>21 October</b><p>Logo chosen. The launch film built and checked frame by frame.</p></li>
                <li className="key"><b>22 October</b><p>The bet challenged. Scope settled, late nights became a missed gain, Nights and pay once designed, the film re-cut.</p></li>
                <li className="key"><b>23 October</b><p>Every factual claim challenged. Privacy copy fixed, the free first month decided.</p></li>
              </ol>

              <div className="ba text-only">
                <div>
                  <h3 className="ba-title">Copy that had to become true</h3>
                  <ul className="diff">
                    <li><span className="where">Welcome</span><del>No account. Nothing leaves this iPhone.</del><ins>No account. Your screen time stays on this iPhone.</ins></li>
                    <li><span className="where">Permission, explained</span><del>Quietly has no server to send it to.</del><ins>Your apps and minutes are never sent anywhere.</ins></li>
                    <li><span className="where">Privacy and your data</span><del>Encrypted, only you can read it.</del><ins>In your private iCloud. Quietly can&apos;t see it.</ins></li>
                  </ul>
                  <p className="body mt-16">Neighbours needs a server, so &ldquo;nothing leaves&rdquo; was false. And iCloud data is encrypted, but Apple holds the keys unless Advanced Data Protection is on, so only &ldquo;Quietly can&apos;t see it&rdquo; is true for everyone.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ 09 Limits ============ */}
        <section className="sec" aria-labelledby="s9">
          <div className="wrap">
            <SectionHead n="09" id="s9">What I don&apos;t know yet</SectionHead>
            <div className="indent">
              <div className="limits">
                <div className="limit"><h3><Icon name="users-three-bold" />No one has used Quietly</h3><p>There&apos;s no user research behind it. Every line of the bet is an assumption until someone uses it.</p></div>
                <div className="limit">
                  <h3><Icon name="figma-logo-bold" />The Figma file is out of date</h3>
                  <p>The prototype still shows the rules of 22 October: storms, This Week and the subscription. The HTML screens and the film are current.</p>
                  <p><a className="ext" href={FIGMA} target="_blank" rel="noopener noreferrer">Open the Figma prototype<Icon name="arrow-up-right-bold" /></a></p>
                </div>
                <div className="limit"><h3><Icon name="git-fork-bold" />One source of critique</h3><p>Every challenge round came from the same model. A person, or a second model, would make the findings stronger.</p></div>
                <div className="limit"><h3><Icon name="device-mobile-bold" />Three things need a real build</h3><p>The Dynamic Island stir and the widget refresh and minutes depend on how iOS treats Screen Time extensions.</p></div>
              </div>

              <h3 className="h3 mt-64">What I&apos;d test first</h3>
              <ul className="tests">
                <li><b>A morning reward can beat the next video at 12:40 am</b><span>Two-week diary study: on late nights, did the grove cross the person&apos;s mind, and when?</span></li>
                <li><b>The reward doesn&apos;t add scrolling</b><span>Count opens of Quietly after bedtime. iOS can.</span></li>
                <li><b>10 minutes is a fair grace</b><span>Diary study: which evenings felt quiet to people, against the rule.</span></li>
                <li><b>Paying once suits a habit that ends</b><span>Purchase rate and refunds for one purchase, against a subscription paywall, in a small beta.</span></li>
              </ul>
            </div>
          </div>
        </section>

        <div className="end">
          <div className="wrap">
            <Link className="next" href="/work/nextstep"><small>Next case study</small><span>NextStep <Icon name="arrow-right-bold" /></span></Link>
            <p className="foot">Quietly is a concept by Dilip Rapaka. Not on the App Store.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
