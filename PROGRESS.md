# Portfolio — Progress & Handoff

Working doc for **Dilip Rapaka's UX / Product Designer portfolio**. Hand this to a new chat to continue the work.

Last updated: 2026-08-14 · Status: **tsc 0 · eslint 0 · vitest 21/21 · playwright 77/77 · build green**

---

## 1. What this is

A personal portfolio for a **junior UX / Product Designer** targeting **UK** roles. Editorial, typographic, restrained — built so the site itself is the work sample.

- **Location:** `C:\Users\rapak\portfolio`
- **Run:** `PORT=3311 npm run dev` → http://localhost:3311 (port 3000 is another project in this setup)
- **Owner:** Dilip Rapaka · `dilipuxdesigner04@gmail.com` · `linkedin.com/in/diliprapaka` · +44 7553409884
- **Facts:** MSc UX Design, Birmingham City University. Previously UI/UX designer at **Rapshift** (e-commerce, ~1 yr). **1st Place — BCU Innovation Fest 2025** (NextStep). Tools: Figma, FigJam, Miro, Framer, Illustrator, Jira, Claude Code, Cursor.
- **Brand mark:** **DUX** (nav wordmark + favicon).
- ⚠️ **Rapshift work is under NDA — never publish it as a case study.**

## 2. History — read before changing anything

The site was originally a dark, WebGL-heavy "React-Bits template" (cosmic orange `#ff6b35` on black, LiquidEther fluid, TiltedCard, Tetris loader, a mono eyebrow on every section). Dilip judged it **generic / AI-looking** and it was fully rebuilt into the current light editorial system.

**Do NOT reintroduce:** LiquidEther, cosmic orange, dark-hero fluid, the Tetris loader, or a mono eyebrow above every section.

One React Bits component **is** in use and staying: `ClickSpark`, site-wide (§7). It needs no dependency and is recoloured to the cobalt tokens.

**On 2026-08-14 three other React Bits components were tried in the Hero→Work slot and all three were removed the same day** — a native curved-text band, then the real `TextLoop` as an award ribbon, then `LogoLoop` as a tool strip. Dilip's verdict each time was that the section did not earn its place; the last word was *"let's keep it simple."* The award section they replaced is gone too. **That slot is now empty on purpose — don't fill it without asking.** Full history in `git log` between `dc82d68` and `HEAD`.

Audited against two frameworks from Dilip's mentor — **Portfolio Red Flags** (Story Spine, 3-Lever Polish, POV Stack, 3-Click path, Squint Test) and **The Portfolio Blueprint** (7 blocks). Strong on positioning, "site is the sample", about/photo, CTA. **Weak only on volume of real projects** — content-gated, not design-gated.

## 3. Tech stack

- **Next.js 16.2.1** (App Router, Turbopack). ⚠️ Breaking changes vs. training data — check `node_modules/next/dist/docs/` before using unfamiliar APIs (see `AGENTS.md`).
- **React 19.2.4** — React-19 lint rules bite (no sync `setState` in effects, no inline component declarations in render).
- **Tailwind CSS v4** (CSS-first via `@theme` in `app/globals.css`).
- **Motion v12** (`motion/react`) — this IS Framer Motion, renamed. **Do not `npm i framer-motion`.**
- **anime.js v4.5.0** — second animation library, see §7.
- **Runtime deps (5):** `animejs`, `motion`, `next`, `react`, `react-dom`. `three` / `ogl` / `lenis` were removed in cleanup; `gsap` and `react-icons` came and went with the React Bits experiments on 2026-08-14 (§2).
- **Verify with local binaries:** `./node_modules/.bin/tsc --noEmit` and `./node_modules/.bin/eslint .` — a bare `npx tsc` grabs a bogus global package.
- ⚠️ `npm audit` reports 3 production advisories inherited from `next@16.2.1`. Pre-existing. `npm audit fix --force` would bump Next's major — treat as a deliberate upgrade task.

## 4. Design system (LOCKED)

### Colour tokens (`app/globals.css` `@theme`)

| token | light | role |
|---|---|---|
| `--color-ink` | `#14181f` | primary text |
| `--color-paper` | `#f7f8fa` | page background |
| `--color-canvas` | `#f4f4f2` | section surface (neutral off-white, **not** warm cream) |
| `--color-mist` | `#e8e8e4` | muted panel — the darkest light surface |
| `--color-cobalt` | `#2f2be6` | accent marks / large graphics |
| `--color-cobalt-ink` | `#2521b0` | accent **text** on light (9.9:1) |
| `--color-cobalt-lite` | `#9c99ff` | accent on dark surfaces |
| `--color-shell` / `-fg` | `#14181f` / `#f7f8fa` | footer — stays dark in **both** themes |

**One accent, used sparingly.** On light use `text-cobalt-ink` for text and `bg-cobalt` for marks; on dark surfaces use `text-cobalt-lite`.

### Dark mode

**Every load starts light.** `prefers-color-scheme` is ignored *and* the choice is **not persisted** — light is the primary design; dark is a per-visit preference that resets on refresh. Nothing is written to `localStorage`.

- **It is a token re-map, not a `dark:` sweep.** `.dark` reassigns the same custom properties, so **no component needs a `dark:` class** and every ink/paper pair keeps its contrast by construction.
- **The footer opts out** via `--color-shell` — without it the ink/paper swap turns the footer into a blinding white slab. **Never put `bg-ink` back in `Footer.tsx`.**
- `ThemeToggle` uses **`useSyncExternalStore`**, not `useState` + effect (React 19 rejects sync `setState` in an effect, and the theme genuinely lives on `<html>`, outside React).
- ⚠️ **The swap must stay instant.** Cross-fading surfaces while text flips measured **1.08:1** for ~300ms.
- ⚠️⚠️ **The swap injects a `<style>` tag that kills all transitions for one frame. Do not remove it.** Chrome does not re-resolve `var()` for a property that is mid-transition, so every element with `transition-colors` kept the *previous* theme's colour permanently — **15 elements**, including "Let's talk" at **1:1 contrast, invisible** on the dark hero. A `.theme-swapping` CSS class in `globals.css` was tried first and **could not win the cascade against Tailwind's utilities** (verified: `transition-duration` stayed `0.15s`). The injected style + forced reflow is the working fix. A test pins it.

### Fonts (`next/font/google`) — 2 families + 1 mono

- **Instrument Serif** → display (`font-serif`)
- **Inter** → body / workhorse (`font-sans`)
- **Martian Mono** → labels, eyebrows, meta (`font-mono`)
- ~~Familjen Grotesk~~ removed (mentor's "2 typefaces max"). Don't add a second sans.

### Motifs

- **Hairlines** (`border-ink/12`) are the structural grid language.
- **One radius:** `rounded-lg` (8px). `rounded-full` only for genuine pills/dots.
- **Focus ring:** cobalt, via `:focus-visible` in globals.
- Everything respects `prefers-reduced-motion`.

## 5. Accessibility — measured, not assumed

**All 8 route × viewport × theme combinations pass WCAG AA.** `e2e/a11y.spec.ts` enforces it.

### The alpha floor (computed from the real tokens)

| surface | `/55` | `/60` | `/65` | `/70` |
|---|---|---|---|---|
| ink on paper | 3.90 ✗ | 4.57 ✓ | 5.39 ✓ | 6.39 ✓ |
| ink on canvas | 3.86 ✗ | 4.51 ✓ | 5.31 ✓ | 6.29 ✓ |
| **ink on mist** | 3.74 ✗ | **4.35 ✗** | 5.08 ✓ | 5.97 ✓ |
| shell-fg on shell | 5.79 ✓ | 6.66 ✓ | — | — |

⚠️ **`text-ink/70` is the standard for secondary text.** An earlier version of this doc claimed "`/55`+ clears AA" — **that was wrong on every surface**, and even `/60` fails on `mist`. `/70` is the only value safe everywhere.

**Hierarchy comes from size and weight, not from dimming below the floor.** Nav links are `/85`, the clock `/70`.

### Other guarantees, all test-enforced

- **Tap targets ≥ 24×24** (WCAG 2.2 AA 2.5.8); most are `min-h-11` (44px, Apple HIG). `SwapLink` moved its `overflow-hidden` to an inner span so the anchor can carry padding without breaking the hover swap.
- **Exactly one `h1` per page**, zero skipped heading levels, zero images without `alt`, zero horizontal overflow at 390px.
- Skip link, `aria-current="location"` on the active nav item, `aria-hidden` on decorative icons.
- ⚠️ The Hero `h1` is tokenised per word for the hover effect — the words are separated by a **real space**, not a margin. Without it the heading serialises as `"Iturnhardproblems…"` for screen readers and copy-paste.

## 6. Page composition

`app/page.tsx`: `<Nav/>` + `<main id="main">{ Hero · CaseStudies · About · Approach }</main>` + `<Footer/>`
`app/work/nextstep/page.tsx`: the case study.

### Hero

- **H1:** *"Hi, I'm Dilip Rapaka. I turn hard problems into products people can actually use."* — italic on *hard*.
- ⚠️ **The greeting is Dilip's explicit call.** I argued against it (display type spent on low-value words, template-ish) and was overruled twice. **Don't re-litigate.** Because the name is in the H1, the eyebrow is just `Product Designer` — don't add the name there too.
- **Sub-line:** *"A product designer based in the UK. I keep things **simple and easy to use**. Currently open to junior roles."* (`simple and easy to use` in cobalt).
- **The name is cobalt too**, added 2026-08-14 at Dilip's request. It uses the `accent` flag that already existed on the `Word` type — set it per token in `H1`, don't wrap words in spans by hand or the per-word hover and the real spaces between words both break. ⚠️ This makes **two** cobalt accents in the hero where the doc previously said one; that was the deliberate old constraint, so weigh it before adding a third.
- ⚠️ **"healthcare and accessibility" was deliberately removed from the hero** (it was in the H1, then the sub-line, then cut). The specialism first appears below the fold. **Don't restore it.** Known trade-off: nothing above the fold names a sector.
- A test caps the H1 at 16 words and pins the CTA above the fold at 375px and 1280×720.

### Between Hero and Selected work — deliberately nothing

The old **Recognition** section (BCU award at display size) sat here and was removed on 2026-08-14, along with three successive replacements (§2). **The slot is empty by choice.**

- **The award was not lost with it.** It still reads in the Selected work outcome line (`lib/projects.ts`) and three times in the case study. What went was the display-size treatment, not the credential.
- No separator is needed: the **Hero already closes with a hairline** under its scroll cue, so Selected work still reads as its own section even though both surfaces are `bg-canvas`. Verified after the removal — don't add a `border-t` to `#work` to "fix" a seam that is already there.
- Tools are listed **once**, as text chips in Approach's Toolkit column. That is now the only place they appear.


### Selected work (`CaseStudies.tsx`)

Hover-expand row list. NextStep + three "Coming soon" rows.

- ⚠️ **A full-width "featured card" rewrite was built and then reverted at Dilip's request.** Don't rebuild it without asking.
- Card is on a **content diet**: industry and year appear **once** (in the outcome line). The floating `HEALTHCARE / 2025` corner label was deleted; header reads `01 live` (`· 4 planned` was cut — it told a recruiter the portfolio was 80% empty).
- Meta row is `role · duration`. **Tags are deliverables only** (`Mobile App` · `Usability Testing` · `NHS`) — never role or industry, which the copy already states. `category` and `year` were removed from the `Project` type.
- Thumbnail is **`nextstep-thumb.webp`, not the case-study hero** — composed from two real screens on the hero's exact background (`#d9d2f0`), deliberately **text-free**. The hero image carries a "Nextstep" wordmark and a tagline that clashed with the site's typography and repeated the heading beside it. Built 1600×1000 (1.600) to match the expanded thumb box (300×188 = 1.596).

### About

- **CV link ends the reading path**, under "Beyond work" in the content column. It briefly lived in the left rail; that forced the eye back across the page after reading.
- ⚠️ **Content column starts at grid column 4, not 5.** `col-start-5` left **column 4 completely empty** — a measured **137px** dead band that made the two halves read as unrelated. Now 32px. The label→text gap was never the problem (43px, correct).
- Background copy says **"specialising in complex, data-rich digital environments"** — deliberately not "healthcare", matching the broader hero. A test asserts `/healthcare/i` never appears in About.
- Spacing verified on the 8pt grid: section 128px, rows 32px, label track 112 + 24.

## 7. Motion

- **Motion v12** does all component entrance/exit: CSS `.anim-fade-up` / `.anim-rise` above the fold (they run at first paint so they cannot ship blank), `whileInView` below it, magnetic links, hero cursor-glow + parallax, per-word H1 hover.
- **anime.js v4** (added at Dilip's request) is scoped to two moments only:
  1. `components/ui/draw-rule.tsx` — section hairlines draw in on scroll
  2. SUS bars in `sus-scores.tsx` — stagger-fill
- ⚠️ **This is a deliberate exception to the minimal-deps rule. Don't migrate Motion work to it, and don't add a third library.** gsap was added on 2026-08-14 for a React Bits ribbon and removed with it the same day (§2); the codebase is back to two.

### Click sparks (`components/ui/click-spark.jsx` + `SparkLayer.tsx`)

Vendored React Bits `ClickSpark`, wrapping the whole app in `layout.tsx`. **Needs no dependency** — it is plain canvas. Kept byte-identical to upstream apart from a `'use client'` directive; everything it needed adapting for lives in `SparkLayer` or globals.css instead.

- ⚠️⚠️ **Its canvas is its FIRST child, so every opaque section paints over it.** Out of the box the sparks are invisible. `[data-spark-root] > div > canvas { z-index: 60 }` in globals.css lifts it above the nav (z-50). The component sets **no inline z-index**, which is why a plain rule wins without `!important`. A test counts *painted pixels*, not just the element, because the markup looks correct either way.
- **Canvas can't read CSS variables** — `strokeStyle` needs a real colour, so `SparkLayer` mirrors cobalt's two token values in JS and picks by theme via `useSyncExternalStore` on `<html>`. **Keep `COBALT` in step with `@theme`/`.dark`.**
- **Reduced motion renders children untouched** — no canvas, no rAF loop, no buffer. A test asserts `[data-spark-root]` is absent.
- ⚠️ **Cost, measured:** the canvas spans the whole document — **1280×3974 ≈ 19MB** at desktop — and its rAF loop clears that whole buffer every frame, forever, even with no sparks on screen. Sizing it to the viewport instead is not possible without editing the component, because it has to wrap the content to catch clicks. **If the site ever feels sluggish on a low-end phone, this is the first thing to test.**
- The canvas is `pointer-events: none`, so clicks reach the page. A test opens a link through it — if that ever regressed the entire site would stop responding.
- v4 API: `import { animate, stagger } from "animejs"` — **no default export** (that's v3). Ease names are strings like `outQuart`.
- Both animate **`scaleX` with `origin-left`**, never `width` — transform is composited, width triggers layout.
- ⚠️ **Both must fail safe.** The collapse to `scaleX(0)` happens *only inside the effect*, so with JS off or reduced motion the content renders full-size. **Never move the collapsed state into markup or CSS** — that ships the section blank if the observer doesn't fire.
- Uses an isomorphic layout effect; a plain `useEffect` shows the element full-width for one frame then snaps to zero.

## 8. Case study — `/work/nextstep`

Server component; only `Reveal` and `SusScores` are client islands. Primitives in `components/case-study/`.

**Eight numbered sections:** 01 Problem + Constraints · 02 My contribution · 03 Research · 04 Framing/HMW · 05 Design evolution · 06 Visual system · 07 Usability testing · 08 Outcome. A test asserts the numbers run `[1..8]` unbroken.

### Content decisions that must not be "cleaned up"

- **HMW sits *after* research**, not before — it's a synthesis output. Each HMW carries a `From — <finding>` label, and **a test asserts every one matches a finding actually rendered in §03**.
- **Three flows get a deep-dive** (Homepage, Exercises, Community — the ones with real UX problems). Notifications and Profile get one row and a single line.
- **Each core flow names an alternative that was considered and rejected** (streak counter demoted; Tinder-style card swipe rejected; broad-vs-condition-specific categories flagged). These turn a layout walkthrough into a design decision. ⚠️ They came from Dilip's recall and are **not verifiable from the repo** — confirm before publishing.
- ⚠️ **Three honest caveats are deliberate:** §07 concedes the comprehension finding was never directly addressed; that three of five round-2 participants were clinicians, not patients; and that community onboarding never got a dedicated fix. They pre-empt the first questions an interviewer asks. Tests assert two of the strings are present.
- **SUS is reported as a score, never a percentage.** "84.5%" / "68%" is a technical error — SUS runs 0–100 but is not a percentage. A test fails if `%` returns.
- The community insight sits at the top of §08, **once**. A test pins the count.
- Copy deliberately **omits** the unsourced "50% of patients" stat, personas, empathy maps, the IA diagram, and the appointment-booking flow (a teammate's work). A Figma template wanted several back — they stay out.
- **UK English only.** A test scans rendered text for `utiliz`, `organiz`, `recogniz`, `analyz`, `specializ`, `color`, `behavior`, bare `toward`.

### Images

14 images in `public/nextstep/*.webp` (916KB total), all wired. Prototype link is live via `PROTOTYPE_URL` in `nextstep-screens.tsx`.

- ⚠️ **Slot ratios match the real exports, not idealised device sizes** — `phone` is `aspect-[830/1686]` and `wide` is `16/9`. Changing them to "clean" numbers like `9/19.5` will start cropping the screens.
- Converted PNG → WebP with sharp: **5.88MB → 0.82MB (−86%)**, style guide downscaled to 2400px.
- **Everything routes through `next/image`.** `Figure` uses `fill` + `object-cover`, so **the slot wrapper must keep its `relative` class** — `fill` is absolutely positioned and will escape to the nearest positioned ancestor without it.
  - Each ratio carries a **`sizes` hint** (`SIZES` in `figure.tsx`); without one the browser assumes `100vw` and over-fetches. Measured: a phone screen drops from the 830px source to a **256px candidate (47KB → 15KB)**. Keep `sizes` in step with the grid caps in `COLS` if those change.
  - The `<img>` in `tilted-card.jsx` has to stay a `motion.img` for the tilt, so it pulls its src/srcset from **`getImageProps`** instead of rendering `<Image>`.
  - Only the case-study hero and the Hero portrait are `eager`; everything else is lazy. In Next 16 `priority` is **deprecated** — use `preload`, or `loading="eager"`, which is what these do.
  - A test asserts every case-study figure points at `/_next/image` and carries a `srcset` and a `sizes`. It reads the **`src` attribute, not `currentSrc`** — the screens are lazy and below the fold, so nothing has resolved a candidate while the test runs.
- ⚠️ **A filled `<Figure>` drops its label on purpose** (the image replaces it). Any test asserting "every figure contains text" breaks on the first upload — the figure test checks *filled → non-empty `alt`, empty → non-empty label*.
- `IMAGES.md` (repo root) is the step-by-step Figma export guide — export ratios, filenames, the one-line edit per slot. It describes the **original** workflow (PNG, a combined Notifications+Profile collage); the shipped setup differs. Treat it as the guide for *future* case studies.

## 9. Testing

```bash
npm run test        # vitest — 21 unit tests
npm run test:e2e    # playwright — 72 tests, 7 files
npm run test:all
```

`e2e/`: `a11y` · `about` · `case-study` · `hero` · `motion` · `nav` · `theme` · plus `About.test.tsx` and `lib/contrast.test.ts`.

### Gotchas that cost real time — don't rediscover them

1. **`test.use({ reducedMotion: "reduce" })` does not reach `matchMedia`** in this config (verified: the page kept reporting `false`). Use `page.emulateMedia({ reducedMotion: "reduce" })` in `beforeEach`, **before** `goto`.
2. **Playwright's `scrollIntoViewIfNeeded` throws "Element is not attached to the DOM"** here, and a fixed `waitForTimeout` is unreliable: the `whileInView` reveals expand as they fire and move the target by **thousands of pixels** (measured: 11434 → 350 over ~1.6s). **Scroll from inside the page, twice, then poll with `waitForFunction`.**
3. **Never parse colours with regex.** Tailwind emits `oklab(… / .7)`; composite through a 1×1 canvas and read the pixel.
4. **HMM/Fast-Refresh during a test run produces phantom failures** — hydration errors, detached elements. Re-run on a stable tree before believing a failure.
5. **The in-app browser preview is flaky** — verify in real Chrome. `whileInView` sections look blank mid-scroll until settled, so screenshots taken right after a programmatic scroll catch them faded.
6. ⚠️ **`preview_start` reads `C:\Users\rapak\.claude\launch.json`, where the config named `portfolio-dev` points at a *different* project** (`portfolio-website`, port 3000). Use the config named **`portfolio`** (port 3311).

## 10. Open items

1. **More real projects.** The single biggest lever. Add to `PROJECTS` in `lib/projects.ts` — bracketed placeholders render as "Coming soon" rows.
2. ~~Consider `next/image`.~~ **Done** — see §8.
3. **Deploy to Vercel.** `metadataBase` now reads `NEXT_PUBLIC_SITE_URL` and falls back to `https://diliprapaka.vercel.app`; **set that env var in the Vercel project once the real domain is known**, or the OG and Twitter cards point at the wrong origin. Nothing else is deploy-gated: `app/icon.svg` and `app/opengraph-image.tsx` already generate the favicon and the social card, and `npm run build` is green with all 7 routes static.
4. **Aesthetic-lane question (strategic, Dilip's call).** An `/impeccable` audit scored **14/20** and flagged that the site sits in the currently-saturated "editorial-typographic" lane (display serif + mono labels + ruled separators + monochrome), and that both typefaces are on its reflex-reject list. Identity-preservation says leave committed choices alone, and the slop detector returns clean — but it's worth knowing the first build was rejected as generic and this lane has since become the *next* generic.
5. ~~`home-1-sketch.webp` is 874×1704 while the other twelve are 830×1686.~~ **Done** — recropped to 830×1686 (52KB → 47KB). It only ever removed the 4% the browser was already discarding, so the rendered result is unchanged; the file now just matches the slot.
