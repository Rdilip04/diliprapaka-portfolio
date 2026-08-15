# Portfolio — Design & Engineering Handbook

Reference document for **Dilip Rapaka's UX / Product Designer portfolio**. Written to be handed to a new contributor (human or agent) as the single source of truth for what this site is, why it looks the way it does, and which decisions are settled.

**Status:** `tsc` 0 · `eslint` 0 · vitest 21/21 · Playwright 77/77 · production build green
**Last updated:** 2026-08-14

Conventions used below:

> **Locked** — a settled decision. Changing it needs Dilip's agreement, not just a good argument.
> **Trap** — a non-obvious failure mode that has already cost time once.

---

## 1. The project

A personal portfolio for a **junior UX / Product Designer** targeting **UK** roles. Editorial, typographic and restrained, built so that the site itself is the work sample.

| | |
|---|---|
| **Repository** | `C:\Users\rapak\portfolio` |
| **Run** | `PORT=3311 npm run dev` → `http://localhost:3311` (port 3000 belongs to another project) |
| **Owner** | Dilip Rapaka · `dilipuxdesigner04@gmail.com` · `linkedin.com/in/diliprapaka` · +44 7553409884 |
| **Brand mark** | **DUX** — nav wordmark and favicon |

**Background:** MSc UX Design, Birmingham City University. Previously UI/UX designer at Rapshift (e-commerce, ~1 year). 1st Place, BCU Innovation Fest 2025 (NextStep). Tools: Figma, FigJam, Miro, Framer, Illustrator, Jira, Claude Code, Cursor.

> **Locked — Rapshift work is under NDA.** It must never be published as a case study.

### Where it stands

Audited against two frameworks from Dilip's mentor: **Portfolio Red Flags** (Story Spine, 3-Lever Polish, POV Stack, 3-Click path, Squint Test) and **The Portfolio Blueprint** (7 blocks). The site is strong on positioning, on "the site is the sample", and on the about/photo and CTA blocks. Its one weakness is **the number of real projects** — a content problem, not a design problem.

---

## 2. Rejected directions

The site began as a dark, WebGL-heavy React Bits template: cosmic orange `#ff6b35` on black, LiquidEther fluid background, a Tetris loading screen, a mono eyebrow above every section. Dilip judged it generic and AI-looking, and it was rebuilt into the current light editorial system.

> **Locked — do not reintroduce:** LiquidEther, cosmic orange, the dark fluid hero, the Tetris loader, or a mono eyebrow above every section.

Later experiments that were built, reviewed and removed. Each is recoverable from `git log`; none should be revived without asking:

| Direction | Outcome |
|---|---|
| Full-width "featured card" work index | Built, then reverted. The row list stayed. |
| Curved looping text band (native, then React Bits `TextLoop`) | Both built and removed. |
| `LogoLoop` tool strip | Built and removed. |
| Recognition section — the BCU award at display size | Removed; the award survives elsewhere (§6). |

The last four all occupied the slot between Hero and Selected work. Dilip's verdict each time was that the section did not earn its place, ending with *"let's keep it simple."*

> **Locked — that slot is empty on purpose.** Do not fill it without asking.

One React Bits component remains in use: **`ClickSpark`**, site-wide (§7). It needs no dependency and is recoloured to the project's tokens.

---

## 3. Stack

| Technology | Notes |
|---|---|
| **Next.js 16.2.1** | App Router, Turbopack. Read `node_modules/next/dist/docs/` before using an unfamiliar API — this version differs from most training data. See `AGENTS.md`. |
| **React 19.2.4** | Its lint rules are strict: no synchronous `setState` in effects, no component declarations inside render, no reading refs during render. |
| **Tailwind CSS v4** | CSS-first, configured via `@theme` in `app/globals.css`. |
| **Motion v12** (`motion/react`) | This *is* Framer Motion, renamed. **Never `npm i framer-motion`.** |
| **anime.js v4.5.0** | Second animation library, deliberately scoped to two moments (§7). |

**Runtime dependencies (5):** `animejs`, `motion`, `next`, `react`, `react-dom`.
`three`, `ogl` and `lenis` were removed during the rebuild; `gsap` and `react-icons` arrived and left with the experiments in §2.

**Verify with the local binaries** — `./node_modules/.bin/tsc --noEmit` and `./node_modules/.bin/eslint .`. A bare `npx tsc` resolves to an unrelated global package.

> **Trap — `npm audit` reports 3 production advisories** inherited from `next@16.2.1`. Pre-existing. `npm audit fix --force` would bump Next's major version; treat that as a deliberate upgrade, not a fix.

---

## 4. Design system

> **Locked.** The palette, type stack and motifs below are settled.

### Colour tokens (`app/globals.css`, `@theme`)

| Token | Light | Role |
|---|---|---|
| `--color-ink` | `#14181f` | Primary text |
| `--color-paper` | `#f7f8fa` | Page background |
| `--color-canvas` | `#f4f4f2` | Section surface — neutral off-white, **not** warm cream |
| `--color-mist` | `#e8e8e4` | Muted panel; the darkest light surface |
| `--color-cobalt` | `#2f2be6` | Accent marks and large graphics |
| `--color-cobalt-ink` | `#2521b0` | Accent **text** on light (9.9:1) |
| `--color-cobalt-lite` | `#9c99ff` | Accent on dark surfaces |
| `--color-shell` / `-fg` | `#14181f` / `#f7f8fa` | Footer — stays dark in **both** themes |

**One accent, used sparingly.** On light surfaces use `text-cobalt-ink` for text and `bg-cobalt` for marks; on dark surfaces use `text-cobalt-lite`.

### Dark mode

Every load starts light. `prefers-color-scheme` is ignored, and the choice is **not persisted** — light is the primary design and dark is a per-visit preference that resets on refresh. Nothing is written to `localStorage`.

- **It is a token re-map, not a `dark:` sweep.** `.dark` reassigns the same custom properties, so **no component needs a `dark:` class**, and every ink/paper pair keeps its contrast by construction.
- **The footer opts out** through `--color-shell`. Without it, the ink/paper swap turns the footer into a blinding white slab. Never put `bg-ink` back into `Footer.tsx`.
- `ThemeToggle` uses **`useSyncExternalStore`** rather than `useState` + effect: React 19 rejects synchronous `setState` in an effect, and the theme genuinely lives on `<html>`, outside React.
- **The swap must stay instant.** Cross-fading the surfaces while the text flips measured **1.08:1 for roughly 300ms**.

> **Trap — the swap injects a `<style>` tag that kills all transitions for one frame. Do not remove it.**
> Chrome does not re-resolve `var()` for a property that is mid-transition, so every element carrying `transition-colors` kept the *previous* theme's colour permanently — 15 elements, including "Let's talk" at **1:1 contrast, invisible** on the dark hero. A `.theme-swapping` class in `globals.css` was tried first and could not win the cascade against Tailwind's utilities (verified: `transition-duration` stayed `0.15s`). The injected style plus a forced reflow is the working fix, and a test pins it.

### Typography — two families and one mono

| Family | Role |
|---|---|
| **Instrument Serif** | Display (`font-serif`) |
| **Inter** | Body and workhorse (`font-sans`) |
| **Martian Mono** | Labels, eyebrows, meta (`font-mono`) |

Familjen Grotesk was removed to honour the mentor's "two typefaces maximum". Do not add a second sans.

### Type scale

> **Locked — every size comes from the ladder in `@theme`.** No `text-[13px]`, no new `clamp()` curve.

| Token | Value | Role |
|---|---|---|
| `text-label` | 11px | Mono eyebrows, meta, tags |
| `text-sm` | 14px | Secondary copy (Tailwind's own) |
| `text-base` | 16px | Body (Tailwind's own) |
| `text-lead` | `clamp(1.15rem, 2vw, 1.5rem)` | Stand-first paragraphs |
| `text-subhead` | `clamp(1.4rem, 2.8vw, 2.2rem)` | h3s, statement copy |
| `text-heading` | `clamp(1.5rem, 4vw, 3rem)` | Work-index project titles |
| `text-title` | `clamp(1.75rem, 3.4vw, 2.75rem)` | Section headings |
| `text-display` | `clamp(2rem, 4.6vw, 3.6rem)` | Home h1 |
| `text-statement` | `clamp(2rem, 5.5vw, 4.5rem)` | Footer h2 and email |
| `text-hero` | `clamp(3rem, 10vw, 7rem)` | Case-study h1 — the largest type |

`text-lg` / `text-xl` / `text-2xl` survive on three one-off pieces of chrome (nav wordmark, placeholder numeral, mobile nav link) where the step is genuinely distinct.

This replaced **23 ad-hoc declarations — 17 rendered sizes and 16 bespoke `clamp()` curves**, several near-identical (`1.4rem/2.6vw/2rem` sat beside `1.4rem/2.6vw/2.15rem`; three variants shared a `1.35rem` floor). Near-duplicates read as drift rather than intent, which is the one thing a minimal design cannot afford. The homepage now renders **11 distinct sizes, down from 17**.

> **Trap — `--text-statement` has a `2rem` floor for a reason.** The footer email is a single unbreakable 27-character string; at `2.25rem` it overflows 375px on *both* routes. Two tests pin it.

### Motifs

- **Hairlines** (`border-ink/12`) mark **section boundaries**, not every row.
  > **Locked — rules are rationed.** The homepage carried **34 borders**; it now carries **14**. What went: six underlines and six bordered icon chips in Approach's method list, five outlined toolkit chips, the column divider beside them, and the two underlined rows in About. What stayed earns its place — the work-index row separators, the thumbnail frames, two section boundaries and the footer's structure.
  > A repeated rule inside a list is the editorial-template tell the `/impeccable` audit flagged (§10). **Before adding a border, try spacing.**
  >
  > ⚠️ **Removing a rule is only half the job.** The first pass deleted Approach's borders and changed nothing else, and the section lost its hierarchy: rows spanned **330px around a 97px label**, so icons floated away from their text, and below the 35px statement the next level down was **14px at 85% opacity** — a 2.5× jump with nothing between. Subtracting structure means **re-composing** what is left: constrain the measure (`max-w-lg`), and give the surviving level enough size and contrast to *be* a level.
- **One radius:** `rounded-lg` (8px). `rounded-full` is reserved for genuine pills and dots.
- **Focus ring:** cobalt, via `:focus-visible` in globals.
- Everything respects `prefers-reduced-motion`.

---

## 5. Accessibility

All **8 combinations** of route × viewport × theme pass WCAG AA. `e2e/a11y.spec.ts` enforces it on every run.

### The alpha floor

Computed from the real tokens, not assumed:

| Surface | `/55` | `/60` | `/65` | `/70` |
|---|---|---|---|---|
| ink on paper | 3.90 ✗ | 4.57 ✓ | 5.39 ✓ | 6.39 ✓ |
| ink on canvas | 3.86 ✗ | 4.51 ✓ | 5.31 ✓ | 6.29 ✓ |
| **ink on mist** | 3.74 ✗ | **4.35 ✗** | 5.08 ✓ | 5.97 ✓ |
| shell-fg on shell | 5.79 ✓ | 6.66 ✓ | — | — |

> **Locked — `text-ink/70` is the standard for secondary text.** It is the only value safe on every surface; even `/60` fails on `mist`.

**Hierarchy comes from size and weight, never from dimming below the floor.** Nav links sit at `/85`, the clock at `/70`.

### Guarantees, all test-enforced

- **Tap targets ≥ 24×24** (WCAG 2.2 AA 2.5.8); most are `min-h-11` (44px, Apple HIG). `SwapLink` moves its `overflow-hidden` to an inner span so the anchor can carry padding without breaking the hover swap.
- Exactly **one `h1` per page**, no skipped heading levels, no image without `alt`, no horizontal overflow at 390px.
- Skip link, `aria-current="location"` on the active nav item, `aria-hidden` on decorative icons.

> **Trap — the Hero `h1` is tokenised per word** for the hover effect, and the words are separated by a **real space**, not a margin. Without it the heading serialises as `"Iturnhardproblems…"` for screen readers and for copy-paste.

---

## 6. Page composition

```
app/page.tsx          Nav · main( Hero · CaseStudies · About · Approach ) · Footer
app/work/nextstep     the case study
```

### Hero

- **H1:** *"Hi, I'm Dilip Rapaka. I turn hard problems into products people can actually use."* — italic on *hard*, the name in cobalt.
- **Sub-line:** *"A product designer based in the UK. I keep things **simple and easy to use**. Currently open to junior roles."*
- A test caps the H1 at 16 words and pins the CTA above the fold at 375px and 1280×720.

> **Locked — the greeting stays.** It was argued against twice (display type spent on low-value words) and kept both times. Because the name is in the H1, the eyebrow is only `Product Designer`; do not repeat the name there.

> **Locked — "healthcare and accessibility" stays out of the hero.** It was in the H1, then the sub-line, then cut. The specialism first appears below the fold. Accepted trade-off: nothing above the fold names a sector.

**Accenting words in the H1:** set the `accent` flag on the token in the `H1` array. Do not wrap words in spans by hand — that breaks both the per-word hover and the real spaces between words. The hero now carries two cobalt accents (the name, and *simple and easy to use*); weigh carefully before adding a third.

### Between Hero and Selected work

Deliberately empty (§2).

- **The award was not lost with the Recognition section.** It still reads in the Selected work outcome line (`lib/projects.ts`) and three times in the case study. What went was the display-size treatment, not the credential.
- **No separator is needed.** The Hero already closes with a hairline under its scroll cue, so Selected work reads as its own section even though both surfaces are `bg-canvas`. Verified after removal — do not add a `border-t` to `#work` for a seam that already exists.

### Selected work (`CaseStudies.tsx`)

A hover-expand row list: NextStep plus three "Coming soon" rows.

- The card is on a **content diet** — industry and year appear once, in the outcome line. The floating `HEALTHCARE / 2025` corner label was deleted. The header reads `01 live`; `· 4 planned` was cut because it told a recruiter the portfolio was 80% empty.
- The meta row is `role · duration`. **Tags are deliverables only** (`Mobile App` · `Usability Testing` · `NHS`) — never role or industry, which the copy already states. `category` and `year` were removed from the `Project` type.
- The thumbnail is **`nextstep-thumb.webp`, not the case-study hero.** It is composed from two real screens on the hero's exact background (`#d9d2f0`) and is deliberately text-free; the hero image carries a wordmark and tagline that clashed with the site's typography and repeated the adjacent heading. Built at 1600×1000 (1.600) to match the expanded thumb box (300×188 = 1.596).

### About

- **The CV link ends the reading path**, under "Beyond work" in the content column. It briefly sat in the left rail, which forced the eye back across the page.
- Background copy says **"specialising in complex, data-rich digital environments"** — deliberately not "healthcare", matching the broader hero. A test asserts `/healthcare/i` never appears in About.
- Spacing verified on the 8pt grid: section 128px, rows 32px, label track 112 + 24.

> **Trap — the content column starts at grid column 4, not 5.** `col-start-5` left column 4 completely empty: a measured **137px** dead band that made the two halves read as unrelated. It is now 32px. The label-to-text gap was never the problem (43px, correct).

### Approach

Carries the **Toolkit** chips — now the only place on the site where the tools are listed — alongside the prose about using Claude Code and Cursor to bridge design and front-end.

---

## 7. Motion

**Motion v12** handles all component entrance and exit: the CSS `.anim-fade-up` class above the fold (it runs at first paint, so it can never ship blank), `whileInView` below it, magnetic links, the hero cursor-glow and parallax, and the per-word H1 hover.

### anime.js — scoped to two moments

1. `components/ui/draw-rule.tsx` — section hairlines draw in on scroll
2. `sus-scores.tsx` — SUS bars stagger-fill

> **Locked — this is a deliberate exception to the minimal-dependency rule.** Do not migrate Motion work to anime.js, and do not add a third animation library. (gsap was added for one experiment and removed with it; the count is back to two.)

- **v4 API:** `import { animate, stagger } from "animejs"` — there is **no default export**; that was v3. Ease names are strings such as `outQuart`.
- Both animate **`scaleX` with `origin-left`**, never `width` — transform is composited, width triggers layout.
- Both use an isomorphic layout effect. A plain `useEffect` shows the element full-width for one frame, then snaps it to zero.

> **Trap — both must fail safe.** The collapse to `scaleX(0)` happens *only inside the effect*, so with JS disabled or reduced motion on, the content renders full size. **Never move the collapsed state into markup or CSS** — that ships the section blank if the observer never fires.

### Click sparks (`ui/click-spark.jsx` + `SparkLayer.tsx`)

Vendored React Bits `ClickSpark`, wrapping the whole app in `layout.tsx`. It needs **no dependency** — it is plain canvas. The file is byte-identical to upstream apart from a `'use client'` directive; everything it needed adapting for lives in `SparkLayer` or `globals.css` instead.

- **Canvas cannot read CSS variables.** `strokeStyle` needs a real colour value, so `SparkLayer` mirrors cobalt's two token values in JS and selects by theme via `useSyncExternalStore` on `<html>`. **Keep `COBALT` in step with `@theme` and `.dark`.**
- **Reduced motion renders children untouched** — no canvas, no animation loop, no buffer. A test asserts `[data-spark-root]` is absent.
- The canvas is `pointer-events: none`, so clicks reach the page. A test opens a link through it; were that to regress, the entire site would stop responding.

> **Trap — the canvas is the component's FIRST child, so every opaque section paints over it.** Out of the box the sparks are invisible. `[data-spark-root] > div > canvas { z-index: 60 }` in `globals.css` lifts it above the nav (z-50). The component sets no inline `z-index`, which is why a plain rule wins without `!important`. The test counts *painted pixels* rather than the element's presence, because the markup looks correct either way.

**Measured cost — smaller than it appears.** The canvas spans the whole *document*, not the viewport, because the component sizes itself to its parent and that parent must wrap the content to catch clicks.

| Viewport | Canvas | Held memory | If it were viewport-sized |
|---|---|---|---|
| 390px | 390 × 5282 | 7.9 MB | 1.3 MB |
| 1440px | 1440 × 4132 | 22.7 MB | 4.9 MB |
| 2560px | 2560 × 4672 | 45.6 MB | 14.1 MB |

It grows as the page grows — every new case study makes it taller. The per-frame `clearRect` is **not** a meaningful cost: measured at 0.001ms, identical to clearing a viewport-sized canvas, because it is a GPU operation the JS call does not wait on. The one real ongoing cost is that the animation loop **never idles** (measured: 61 frames in an idle second; it has no "are there sparks?" check), so the main thread wakes ~60×/s and a phone's CPU never drops to low power. That is battery, not jank.

**Verdict: leave it.** Revisit only if the page grows substantially longer. The fix would be roughly six lines inside the component — size from `window.innerWidth/innerHeight`, `position: fixed`, add a resize listener — at the cost of the byte-identical-to-upstream property. CSS alone cannot do it: forcing the canvas to `fixed` leaves the JS-set buffer size unchanged and squashes the drawing.

---

## 8. Case study — `/work/nextstep`

A server component; only `Reveal` and `SusScores` are client islands. Primitives live in `components/case-study/`.

**Eight numbered sections:** 01 Problem + Constraints · 02 My contribution · 03 Research · 04 Framing / HMW · 05 Design evolution · 06 Visual system · 07 Usability testing · 08 Outcome. A test asserts the numbers run `[1..8]` unbroken.

### Content decisions

> **Locked.** These are defensible positions, not stylistic preferences. Do not "tidy" them.

- **HMW sits *after* research**, because it is a synthesis output. Each HMW carries a `From — <finding>` label, and a test asserts every one matches a finding actually rendered in §03.
- **Three flows get a deep-dive** — Homepage, Exercises, Community, the ones with real UX problems. Notifications and Profile get a single row and one line.
- **Each core flow names an alternative that was considered and rejected**: the streak counter demoted, a Tinder-style card swipe rejected, broad-versus-condition-specific categories flagged. These turn a layout walkthrough into a design decision.
- **Three honest caveats are deliberate.** §07 concedes that the comprehension finding was never directly addressed, that three of five round-2 participants were clinicians rather than patients, and that community onboarding never got a dedicated fix. They pre-empt the first questions an interviewer asks. Tests assert two of the strings are present.
- **SUS is reported as a score, never a percentage.** "84.5%" is a technical error — SUS runs 0–100 but is not a percentage. A test fails if `%` returns.
- The community insight sits at the top of §08, **once**. A test pins the count.
- Copy deliberately **omits** the unsourced "50% of patients" statistic, personas, empathy maps, the IA diagram, and the appointment-booking flow (a teammate's work). A Figma template wanted several back; they stay out.
- **UK English only.** A test scans rendered text for `utiliz`, `organiz`, `recogniz`, `analyz`, `specializ`, `color`, `behavior` and bare `toward`.

> **Trap — the rejected-alternatives copy came from Dilip's recall** and is **not verifiable from the repo**. Confirm with him before publishing.

### Images

15 files in `public/nextstep/` (912KB): 14 case-study screens plus the work-index thumbnail. The prototype link is live via `PROTOTYPE_URL` in `nextstep-screens.tsx`. Converted PNG → WebP with sharp (5.88MB → 0.82MB, −86%), style guide downscaled to 2400px.

**Everything routes through `next/image`.** `Figure` uses `fill` + `object-cover`.

- Each ratio carries a **`sizes` hint** (`SIZES` in `figure.tsx`); without one the browser assumes `100vw` and over-fetches. Measured: a phone screen drops from the 830px source to a **256px candidate, 47KB → 15KB**. Keep `sizes` in step with the grid caps in `COLS`.
- The `<img>` in `tilted-card.jsx` must stay a `motion.img` for the tilt, so it pulls src and srcset from **`getImageProps`** instead of rendering `<Image>`.
- Only the case-study hero and the Hero portrait are `eager`; everything else is lazy. In Next 16 `priority` is **deprecated** — use `preload`, or `loading="eager"` as these do.
- A test asserts every case-study figure points at `/_next/image` with a `srcset` and a `sizes`. It reads the **`src` attribute, not `currentSrc`**, because the screens are lazy and below the fold, so no candidate has resolved while the test runs.

> **Trap — slot ratios match the real exports, not idealised device sizes.** `phone` is `aspect-[830/1686]` and `wide` is `16/9`. Changing them to "clean" numbers such as `9/19.5` will start cropping the screens.

> **Trap — `fill` is absolutely positioned**, so the slot wrapper must keep its `relative` class or the image escapes to the nearest positioned ancestor.

> **Trap — a filled `<Figure>` drops its label on purpose** (the image replaces it). Any test asserting "every figure contains text" breaks on the first upload. The figure test checks *filled → non-empty `alt`; empty → non-empty label*.

`IMAGES.md` at the repo root is the step-by-step Figma export guide. It describes the *original* workflow (PNG, a combined Notifications + Profile collage) and the shipped setup differs — treat it as the guide for future case studies.

---

## 9. Testing

```bash
npm run test        # vitest — 21 unit tests
npm run test:e2e    # Playwright — 77 tests across 7 files
npm run test:all
```

`e2e/`: `a11y` · `about` · `case-study` · `hero` · `motion` · `nav` · `theme`.
Unit: `components/About.test.tsx` · `lib/contrast.test.ts`.

### Traps that have already cost time

1. **`test.use({ reducedMotion: "reduce" })` does not reach `matchMedia`** in this config — verified, the page kept reporting `false`. Use `page.emulateMedia({ reducedMotion: "reduce" })` in `beforeEach`, **before** `goto`.
2. **`scrollIntoViewIfNeeded` throws "Element is not attached to the DOM"** here, and a fixed `waitForTimeout` is unreliable: `whileInView` reveals expand as they fire and move the target by thousands of pixels (measured 11434 → 350 over ~1.6s). Scroll from inside the page, twice, then poll with `waitForFunction`.
3. **Never parse colours with a regex.** Tailwind emits `oklab(… / .7)`. Composite through a 1×1 canvas and read the pixel.
4. **Hovering a marquee times out.** Playwright waits for a target to stop moving, and a loop never does. Freeze it with `emulateMedia({ reducedMotion: "reduce" })` first.
5. **Fast Refresh during a run produces phantom failures** — hydration errors, detached elements. Re-run against a stable tree before believing a failure.
6. **Verify in a real browser, not the in-app preview.** The preview pane does not composite when hidden, so `requestAnimationFrame` pauses, lazy images never load and screenshots time out. Driving Chromium through Playwright is the reliable route for both screenshots and measurements.
7. **`preview_start` reads `C:\Users\rapak\.claude\launch.json`,** where the config named `portfolio-dev` points at a *different* project (`portfolio-website`, port 3000). Use the config named **`portfolio`** (port 3311).

---

## 10. Open items

1. **More real projects.** The single biggest lever, and content-gated rather than design-gated. Add to `PROJECTS` in `lib/projects.ts`; bracketed placeholders render as "Coming soon" rows. Remember Rapshift is out (§1).
2. **Deploy to Vercel.** Nothing is blocking: `app/icon.svg` and `app/opengraph-image.tsx` already generate the favicon and social card, and the production build is green with every route prerendered as static.
   - **After the first deploy, set `NEXT_PUBLIC_SITE_URL`** to the real origin. `metadataBase` reads it and falls back to `https://diliprapaka.vercel.app`; until it is set, the OG and Twitter cards point at the wrong domain. This fails silently — the site looks fine, only the link previews are wrong.
3. **Push to a remote.** The repository has no remote configured, so the only copy is local.
4. **Aesthetic-lane question — strategic, Dilip's call.** An `/impeccable` audit scored 14/20 and flagged that the site sits in the currently saturated "editorial-typographic" lane (display serif, mono labels, ruled separators, monochrome), with both typefaces on its reflex-reject list. Identity preservation argues for leaving committed choices alone, and the slop detector returns clean. Worth knowing, given the first build was rejected as generic and this lane has since become the next default.
