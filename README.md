# Ukato — "A Quiet Room Where Code Lives"

Home + About pages for a personal portfolio, built with Next.js 14 (App Router) and TypeScript.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
```

Scroll down (wheel, swipe, ↓, or click "Scroll down") on the home page and the About page
blooms open from the bottom-right corner. Scroll up (or press ↑ / Esc) to go back.
`/` and `/about` are both real URLs — the browser back button works.

## Make it yours

Everything editable is in **`lib/site.ts`**: your name, email, links, headline, bio, facts, stats.

## Replace the artwork

The two images in `public/images/` are hand-drawn SVG placeholders so the site works out of the box.
Swap them for real paintings:

1. Generate the two images below in any image generator (Midjourney, DALL·E, Firefly, Flux…).
2. Drop them into `public/images/` (e.g. `room.jpg`, `about-girl.jpg`).
3. Update the two paths in `lib/site.ts` → `site.assets`.

### Prompt — room (landing background, 16:9, 3840×2160 if possible)

> Warm cozy anime bedroom at golden hour, Studio Ghibli–inspired painterly style. Centered large window
> with sheer white curtains, blue sky with soft clouds and a distant city skyline, autumn-yellow trees
> outside. Wooden desk facing the window with a monitor showing code, a laptop, a desk lamp, an office
> chair with a hoodie draped over it. Tall bookshelf and hanging vines on the left, a wall shelf, a
> "Good Code Better Days" calendar, and pinned photos on the right. Single bed with an olive-green
> blanket and a mustard pillow at right, cream rug in the middle of a wooden floor, a black-and-white
> cat sleeping bottom-left. Sunlight streaming across the floor and rug. Plants everywhere.
> **No text overlays, no UI, no logos, no characters.**

### Prompt — girl portrait (Ab	out page, square, 2048×2048)

> Anime illustration, warm Studio Ghibli–inspired painterly style. A young woman with dark, shoulder-length
> hair and soft bangs, seen in three-quarter profile facing left, looking up toward a sunlit window with a
> thoughtful, calm expression. She wears an oversized cream sweater and holds a mug that reads
> "Good Code Better Days". Cozy desk, hanging plants, golden light. Two paper notes pinned on the wall:
> "A Better Me" and "One Line At A Time." Subject sits in the lower-right of the frame, with empty warm
> wall space above and to the left. **No UI, no watermark.**

The About portrait is cropped into a quarter-circle (bottom-right corner), so keep the subject
low and to the right.

## Structure

```
app/
  [[...slug]]/page.tsx   "/", "/about", and "/projects" (same room, three states)
  contact/               placeholder page
  globals.css            design tokens + the Sun Bloom reveal
components/
  Experience.tsx         the room, header, scroll logic, About & Projects panels
  Icons.tsx              icons + hand-drawn sprig / cat doodle / links
lib/site.ts              bio, profile, and site content
lib/projects.ts          projects list and categories
public/images/           room.svg, about-girl.svg (replace these)
```

## The Sun Bloom Reveal

Defined in `globals.css` under `.about`, `.projects`, and `.ring`:				

- `clip-path: circle(0px at 100% 100%)` → `circle(var(--R) at 100% 100%)`
- 1.2s, `cubic-bezier(0.22, 1, 0.36, 1)`
- The room behind is blurred and darkened; a thin golden ring travels with the edge of the light.
- On screens under 900px the light fills the whole viewport.
- `prefers-reduced-motion` turns the animation off.
