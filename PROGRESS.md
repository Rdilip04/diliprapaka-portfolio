# Portfolio — Progress & Handoff

Working doc for **Dilip Rapaka's UX / Product Designer portfolio**. Hand this to a new chat to continue the work.

Last updated: 2026-07-14

---

## 1. What this is

A personal portfolio site for a junior UX/Product Designer targeting UK roles. Design-led, motion-forward, built to prove design skill through the site itself. Follows a 7-block coaching framework (Hero → Selected Work → Case studies → Site craft → Personality → About → Contact).

- **Location:** `C:\Users\rapak\portfolio`
- **Dev server:** `npm run dev` → runs on **port 3311** in this setup (`PORT=3311 npm run dev`; port 3000 is taken by another project). Production build: `npm run build`.
- **Owner contact:** dilipuxdesigner04@gmail.com · LinkedIn `linkedin.com/in/diliprapaka`

## 2. Tech stack

- **Next.js 16.2.1** (App Router, Turbopack). ⚠️ This Next version has breaking changes — check `node_modules/next/dist/docs/` before using unfamiliar APIs (see `AGENTS.md`).
- **React 19.2**
- **Tailwind CSS v4** (CSS-first config via `@theme` in `app/globals.css`; class-based dark variant enabled with `@custom-variant`)
- **Motion v12** (`motion/react` — the framer-motion successor)
- **Lenis** (smooth scroll, used by the ScrollStack)
- **TypeScript strict**

## 3. Design system (LOCKED)

### Colors (`app/globals.css` `@theme`)
- **Primary accent = cosmic orange:**
  - `--color-cosmic: #ff6b35` (accent on dark)
  - `--color-cosmic-ink: #c2410c` (accent as **text on light** — passes AA 4.9:1; use this for links/text on Paper)
  - `--color-cosmic-soft: #ff8a5c`
- **Neutrals (Slate & Signal base):** `--color-ink #14181f`, `--color-paper #f7f8fa`, `--color-surface #edeff3`, `--color-slate #5b6572`. (Blue `--color-signal #3d5afe` / `--color-signal-soft #8da0ff` exist but are mostly superseded by cosmic — cosmic is the site accent now.)

### Fonts (`app/layout.tsx`, via `next/font/google`)
- **Fraunces** → display/headings (`font-display`)
- **Inter** → body/UI (`font-sans`)
- **Dancing Script** → the signature name (`font-signature`)

### Rules
- Mobile-responsive, 8pt spacing rhythm, min 4.5:1 contrast.
- Motion is deliberate; everything respects `prefers-reduced-motion`.
- Dark hero → light content rhythm.

## 4. What's built (current state)

**Build is green:** `npm run build` passes, `npx tsc --noEmit` clean.

Page composition (`app/page.tsx`): `<Nav />` + `<main>` containing `<HeroExpansion />` and `<SelectedWork />`. Global `<LoadingScreen />` mounted in `app/layout.tsx`.

### Loading screen — DONE
- `components/LoadingScreen.tsx` + `components/ui/tetris-loading.tsx`
- Tetris animation for **3 seconds**, black background + white pieces (forced dark variant), then fades out. Locks scroll while visible. `prefers-reduced-motion` skips it. `z-[1000]`.

### Nav — DONE
- `components/Nav.tsx`
- Centered **floating glass pill**, fixed top. Links: Work · About · Contact (no wordmark, by request).
- **Pixel-hover** on each link (cosmic pixels via `PixelCanvas`) — the shared "hover theme".
- Scroll-aware: transparent over the dark hero → Paper-tinted glass once scrolled. Skip-link + `aria-label="Primary"`. `z-50`.

### Hero — DONE (iterated heavily; see §6)
- `components/HeroExpansion.tsx` (content) wraps `components/blocks/scroll-expansion-hero.tsx` (mechanic).
- **Scroll-linked expanding media** (reworked from an earlier scroll-jacking version — see §6). A tall `250vh` section with a sticky inner; the **Vignette Bloom video** expands as you scroll.
- Overlay content (grouped, centered): **Dilip / Rapaka** (Dancing Script, cosmic) splits apart + fades slowly; **Product Designer** (cosmic eyebrow) slides left + fades fast; **tagline** slides right + fades fast.
- **Pixel starfield** backdrop (`components/ui/star-field.tsx`) — small cosmic/white pixels, fades out on scroll.
- **Availability chip** bottom-right: "Open to junior UX & product roles · UK".
- Content: eyebrow `Product Designer`; tagline `I care about impact more than my identity as a designer.` (positioning/NHS copy lives only in SEO `<meta>`, by choice).
- Reduced-motion branch renders a static, fully-legible hero.

### Selected Work — DONE (mechanic), copy is PLACEHOLDER
- `components/SelectedWork.tsx` + `components/ui/scroll-stack.tsx` (+ `.css`)
- **ScrollStack** = faithful TypeScript port of the **React Bits ScrollStack** (Lenis smooth scroll, `translate3d` pin + scale, `hasChanged` optimization). Runs in `useWindowScroll` mode. One fix vs. reference: card position measured via layout offset (transform-independent) to prevent pinning feedback/jitter.
- Cards alternate **black / white**, with **cosmic** accents (three-color scheme requested). Each card: index, title, description, "Why it's here", tag pills, and a **glassmorphic "Read case study" button** with the cosmic **pixel-hover**.
- Sticky "Selected work" header so it stays visible while scrolling the stack.
- 3 cards (2 was too subtle for the stack effect).

### Supporting UI components
- `components/ui/pixel-canvas.tsx` — 21.dev "Pixel Canvas" web component (registered client-side only to avoid SSR `HTMLElement` crash). Used by nav + card buttons.
- `components/ui/vignette-bloom.tsx` — exported constants for the 21.dev "Vignette Bloom" hosted video/poster (the hero media).
- `components/ui/star-field.tsx` — pixel starfield canvas.

### Data
- `lib/projects.ts` — `PROJECTS` array:
  - **01 NextStep** — real: `why` = "1st Place — BCU Innovation Fest 2025. Recognised for innovation and impact in healthcare design." Description is a reasonable placeholder ("stroke-rehab app for the NHS…").
  - **02 Project Two**, **03 Project Three** — full placeholders (`[bracketed]` copy, "Add Your Tags").

## 5. Removed / dead code
- Deleted this session: old `Hero.tsx`, `horizon-backdrop.tsx`, `CustomCursor.tsx` (custom cursor was tried then removed — back to the default system cursor).
- Still present but **unused** (old generic template, not imported anywhere): `components/About.tsx`, `components/Contact.tsx`, `components/Work.tsx`. Safe to delete or repurpose when building Blocks 6/7.

## 6. Important history / gotchas (read before touching the hero or stack)

- **The hero used to scroll-jack** (hijacked the wheel, forced `scrollTo(0,0)` until the media expanded). This conflicted with Lenis (two things can't own the window scroll) and blocked verification. **Decision: reworked the hero to scroll-linked** (media expands on natural scroll) so Lenis owns the page and the card stack works. The hero *look/transition* was then restored to match the original (name split + Product Designer/tagline slide-apart). If asked to change the hero's scroll feel again, remember this constraint.
- **21.dev free tier = 2 component pulls/day.** "Story scroll" (id 12461) was the user's first choice but got paywalled; we used the React Bits ScrollStack instead (user shared its source).
- **Preview limitation in this environment:** the preview/browser tool binds to *another* chat's project on port 3000, so our app at 3311 can't be screenshotted here. Verification is via `curl` + `tsc` + `npm run build` + the user viewing `http://localhost:3311`. After HMR changes to deps arrays, **hard-refresh (Ctrl+Shift+R)** to clear stale modules.
- **Stray lockfile:** there's a `package-lock.json` at `C:\Users\rapak` causing a Next "inferred workspace root" warning. Clean it (or set `turbopack.root`) before deploying.

## 7. Remaining work (next steps)

Ordered roughly by the 7-block plan:

1. **Real copy** — replace placeholders in `lib/projects.ts`: NextStep one-line description; Project Two & Three title/description/why/tags.
2. **Block 5 — Personality hook** — one memorable line / micro-interaction / empty state. Human, not template.
3. **Block 6 — About** — real person + point of view, MSc UX Design (Birmingham City University), one glimpse outside work, **photo slot** (user wanted a photo — needs a headshot asset). Section id `#about`.
4. **Block 7 — Contact** — single obvious action: email link (`dilipuxdesigner04@gmail.com`). Footer with LinkedIn. Section id `#contact`. (Nav links `#work`/`#about`/`#contact` already point here.)
5. **Block 3 — Case study pages** — `/work/nextstep`, `/work/project-two`, `/work/project-three`. Structure: **outcome first → problem → decisions → what changed**, written so a non-designer follows it. Cards already link to these routes.
6. **Polish & deploy** — accessibility/contrast pass, responsive check (375px + landscape), reduced-motion check, then **Vercel deploy** + instructions. Clean the stray lockfile first.

## 8. Component map (quick reference)

```
app/
  layout.tsx        # fonts, metadata, <LoadingScreen/>, globals
  page.tsx          # <Nav/> + <main>{<HeroExpansion/> <SelectedWork/>}</main>
  globals.css       # @theme tokens, dark variant, reduced-motion, focus ring
components/
  Nav.tsx                     # glass pill nav + pixel hover
  HeroExpansion.tsx           # hero content (name/eyebrow/tagline/chip)
  SelectedWork.tsx            # cards + ScrollStack
  LoadingScreen.tsx           # 3s tetris loader wrapper
  blocks/
    scroll-expansion-hero.tsx # scroll-linked expanding-media mechanic
  ui/
    scroll-stack.tsx / .css   # React Bits ScrollStack (Lenis)
    pixel-canvas.tsx          # 21.dev pixel hover web component
    star-field.tsx            # hero pixel starfield
    tetris-loading.tsx        # tetris game loader
    vignette-bloom.tsx        # hero video/poster URLs
  About.tsx Contact.tsx Work.tsx  # OLD/unused template files
lib/
  projects.ts       # PROJECTS data (NextStep real-ish, 2 & 3 placeholder)
```

## 9. How to run / verify

```bash
cd C:\Users\rapak\portfolio
PORT=3311 npm run dev      # dev at http://localhost:3311
npm run build              # production build (must pass before deploy)
npx tsc --noEmit           # type check
```
