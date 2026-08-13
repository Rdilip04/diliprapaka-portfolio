# Adding the NextStep images

How to get hi-fi frames out of Figma and into `/work/nextstep` without breaking
the layout. There are **12 slots**. Each is a one-line edit.

---

## The one rule that matters

Every image sits inside a box with a **fixed aspect ratio**. The image is set to
`object-cover`, which means:

> **The layout can never break.** The box holds its shape no matter what you drop
> in. But if your export's ratio doesn't match the box, the image gets **cropped**
> to fill it — you lose the top and bottom, or the sides.

So the only thing you have to get right is the **export ratio**. Match it and
nothing is cropped, nothing shifts, nothing to adjust in code.

If you can't match a ratio, don't fight it — see [If your frame is a different
shape](#if-your-frame-is-a-different-shape).

---

## Step 1 — Export from Figma

### 1a. Export frames, never groups

Select the thing you want and check the right sidebar says **Frame**, not Group
or Section.

A group's bounds are whatever its contents happen to occupy, so the exported
dimensions drift as you edit. A frame has fixed, declared dimensions — which is
the whole point, because the ratio is what we're protecting.

If your screen is currently a group: select it → `Ctrl/Cmd + Alt + G` to wrap it
in a frame, then set that frame's size in the right sidebar.

### 1b. Turn on "Clip content"

With the frame selected, tick **Clip content** in the right sidebar.

This is the single most common cause of a wrong-sized export. If anything pokes
outside the frame — a scroll list that runs long, a stray shape, a shadow —
Figma expands the export box to include it. Your 390×844 frame silently exports
as 412×980, the ratio is off, and the image gets cropped on the page.

**Drop shadows and blurs count as overflow.** A card with a shadow near the
frame edge will expand the bounds unless the frame clips.

### 1c. Set the frame to the right size

| Slot | Ratio | Exact frame size | Export at 2x |
|---|---|---|---|
| Phone screens (9) | **9 : 19.5** | `390 × 845` | `780 × 1690` |
| Hero banner | **12 : 5** | `1200 × 500` | `2400 × 1000` |
| Style guide | **16 : 10** | `1000 × 625` | `2000 × 1250` |
| Notifications + Profile collage | **4 : 3** | `600 × 450` | `1200 × 900` |

**If you designed on an iPhone 14/15/16 frame (390 × 844), leave it alone.**
That's 0.4621 against a target of 0.4615 — a 0.1% difference, roughly one pixel.
Invisible. Don't resize your screens to chase it.

**Every iPhone frame from the X onwards is fine.** They all land between 0.461
and 0.462 against the 0.4615 target:

| Figma frame | Size | Ratio | Verdict |
|---|---|---|---|
| iPhone SE / 8 | `375 × 667` | 0.562 | ❌ far too square — will crop badly |
| iPhone X / XS / 11 Pro | `375 × 812` | 0.462 | ✅ fine |
| iPhone 11 / XR | `414 × 896` | 0.462 | ✅ fine |
| iPhone 12 / 13 / 14 | `390 × 844` | 0.462 | ✅ fine |
| iPhone 15 / 16 | `393 × 852` | 0.461 | ✅ fine |

Only the SE/8 shape is a real problem — see [If your frame is a different
shape](#if-your-frame-is-a-different-shape).

### 1d. Build the three composite images

The hero, the style guide and the collage aren't single screens — you compose
them. For each:

1. Press `F`, draw a new frame, set it to the exact size from the table above.
2. Give it a background — your app's light grey, or `#f4f4f2` to match the page
   section it sits in.
3. Copy your finished screens in, arrange them, leave even padding on all sides.
4. Tick **Clip content**.
5. Export that frame.

For the collage, put Notifications and Profile side by side in the one 600×450
frame — the page expects a single image, not two.

### 1e. Name the layers to match the filenames

Figma names the exported file after the layer. Rename your 12 frames now to
exactly the names in [Step 2](#step-2--drop-the-files-in) — `home-1-sketch`,
`exercise-list`, and so on — and the export drops out ready to use.

Skip this and you'll be renaming 12 files by hand. Names must be unique, or
Figma appends `(1)`, `(2)` and you lose track of which is which.

### 1f. Set the export preset

With a frame selected, go to the **Export** section at the bottom of the right
sidebar and click **+**. Set:

- **Size:** `2x`
- **Suffix:** leave empty (a suffix like `@2x` becomes part of the filename and
  won't match the paths in Step 3)
- **Format:** `PNG`

**Why 2x:** these render between 160px and 1150px wide in CSS pixels, and a
retina screen draws two device pixels per CSS pixel. 2x covers it with room
spare. 1x looks soft on any modern laptop or phone; 3x roughly doubles the file
size for no visible gain.

**Why PNG:** UI screens are flat colour, hard edges and small text — exactly
what PNG handles losslessly and JPG smears. Don't use JPG for these. Don't use
SVG either: it only works for purely vector content, and any image, blur or
blend mode in your design will break or bloat it.

### 1g. Export all 12 at once

Select all the frames (shift-click, or select them in the layers panel), then
`Ctrl/Cmd + Shift + E`. Figma exports every selected frame using its own preset
and layer name, in one go.

If you set presets on each frame in 1f, this is a single action.

### 1h. Check before you leave Figma

- Do the exported pixel dimensions match the "Export at 2x" column? If not,
  something is overflowing the frame — go back to **Clip content**.
- Are all 12 filenames exactly right, lowercase, no `@2x`, no spaces?
- Open one at full size. Is the text crisp?

### A note on device mockups

If you wrap screens in an iPhone bezel, **the ratio changes** — you're now
exporting the mockup's dimensions, not the screen's, and mockups usually carry a
drop shadow that expands the bounds further.

I'd skip the bezels. Bare screens read as more current, and device frames date a
portfolio to the year the phone came out. If you do want them, put the whole
mockup inside a clipped frame set to one of the ratios above.

### Weight

Keep each file under ~300KB. UI screens compress well, but 12 PNGs at 2MB each
makes the page crawl — bad for a portfolio, and these are plain `<img>` tags
with no automatic optimisation. If they come out heavy, run them through
[squoosh.app](https://squoosh.app) and export **WebP** at ~80% quality, then use
`.webp` in the filenames below.

---

## Step 2 — Drop the files in

Put everything in `public/nextstep/` using these exact names:

```
public/nextstep/
  hero.png                  ← 12:5 banner
  home-1-sketch.png         ← 9:19.5
  home-2-lofi.png
  home-3-midfi.png
  home-4-hifi.png
  exercise-list.png
  exercise-detail.png
  exercise-complete.png
  community-browse.png
  community-detail.png
  secondary-collage.png     ← 4:3, both screens in one image
  style-guide.png           ← 16:10
```

Anything in `public/` is served from the site root, so
`public/nextstep/hero.png` is referenced as `/nextstep/hero.png`.

---

## Step 3 — Point the code at them

Each slot needs one `src` added. Nothing else changes — `alt` and `caption` are
already written.

### `app/work/nextstep/page.tsx`

**Hero** (~line 210):

```tsx
<Figure
  ratio="banner"
  src="/nextstep/hero.png"
  label="Hero — key app screens"
  alt="NextStep app key screens"
/>
```

**Style guide** (~line 398):

```tsx
<Figure
  ratio="wide"
  src="/nextstep/style-guide.png"
  label="Style guide — colour, type, spacing, buttons, icons"
  alt="NextStep visual style guide"
/>
```

### `components/case-study/nextstep-screens.tsx`

**Homepage progression** — add `src` to each of the four:

```tsx
items={[
  { label: "Sketch", alt: "Homepage sketch", src: "/nextstep/home-1-sketch.png" },
  { label: "Lo-fi", alt: "Homepage low-fidelity wireframe", src: "/nextstep/home-2-lofi.png" },
  { label: "Mid-fi", alt: "Homepage mid-fidelity design", src: "/nextstep/home-3-midfi.png" },
  { label: "Hi-fi", alt: "Homepage final high-fidelity design", src: "/nextstep/home-4-hifi.png" },
]}
```

**Exercises:**

```tsx
items={[
  { label: "Exercise list", alt: "Exercise list screen", src: "/nextstep/exercise-list.png" },
  { label: "Exercise detail", alt: "Exercise detail screen", src: "/nextstep/exercise-detail.png" },
  { label: "Completion", alt: "Exercise completion screen", src: "/nextstep/exercise-complete.png" },
]}
```

**Community:**

```tsx
items={[
  { label: "Group browse", alt: "Community group browsing screen", src: "/nextstep/community-browse.png" },
  { label: "Group detail", alt: "Community group detail screen", src: "/nextstep/community-detail.png" },
]}
```

**Secondary collage:**

```tsx
<Figure
  ratio="panel"
  src="/nextstep/secondary-collage.png"
  label="Notifications & Profile — hi-fi"
  alt="Notifications and Profile screens shown side by side"
  caption="Secondary screens (Notifications & Profile) use standard iOS patterns to ensure a familiar, low-friction experience."
/>
```

You can do these one at a time. A slot with no `src` keeps showing its dashed
placeholder, so the page stays presentable while it's half-finished.

---

## Step 4 — Check it

```bash
npm run test:e2e
```

The suite already covers this: every figure must keep a declared aspect ratio,
no figure may exceed 700px tall, and the page must not scroll sideways at 375px.
If an image is the wrong shape or the layout shifts, those fail.

Then look at it:

```bash
npm run dev
```

---

## If your frame is a different shape

Don't stretch the artboard and don't let it crop. **Change the ratio instead** —
it's one line in `components/case-study/figure.tsx`:

```ts
const RATIO = {
  phone: "aspect-[9/19.5]",   // ← change to match your frame, e.g. aspect-[9/16]
  banner: "aspect-[12/5]",
  wide: "aspect-[16/10]",
  panel: "aspect-[4/3]",
} as const;
```

Two cautions:

- `phone` is shared by all nine phone screens, so changing it changes all nine.
  They should all be the same frame size anyway.
- Making `phone` **taller** (e.g. `9/21`) grows every phone row. The test capping
  figures at 700px tall will tell you if you've gone too far.

**Or** switch cropping off entirely. In `figure.tsx`, change `object-cover` to
`object-contain` — the whole image always fits, with a little empty space at the
edges instead of a crop. Safer if your exports are inconsistent, slightly less
flush-looking.

---

## Common mistakes

| Symptom | Cause |
|---|---|
| Top/bottom of a phone screen is cut off | Export ratio is squarer than 9:19.5 (older iPhone frame) |
| Image looks soft | Exported at 1x — re-export at 2x |
| Page got slow | PNGs too heavy — convert to WebP |
| Placeholder still showing | `src` path typo, or the file isn't in `public/nextstep/` |
| 404 on the image | Path includes `public/` — it shouldn't. Use `/nextstep/…` |
