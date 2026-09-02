# Handoff: Ethereal Aperture — Cara's photography website

## Overview
A small personal website for Cara, an analog and experimental photography educator and practitioner
(trading as **Ethereal Aperture**, Pittsburgh, PA). It is deliberately **not** a commercial portfolio or
client-acquisition site. It presents, in this order:

1. Student work made in Cara's classes (the most important section)
2. Cara's own current work
3. About me
4. Classes — upcoming (with registration status) and past
5. News — exhibitions, publications, festivals, talks
6. Contact — direct email and Instagram

The intended impression is an artist's working notebook / classroom contact sheet / photocopied exhibition
handout translated into a website: intentional and artistically considered, but not commercially polished.
Apparent rawness, controlled by strong editorial typography and clear hierarchy.

## About the design files
The files in this bundle are **design references created in HTML** — a prototype showing the intended look
and behaviour. They are **not production code to copy directly**. The task is to **recreate this design in
the target environment** using its established patterns: if there is no codebase yet, pick the most
appropriate stack for a small, content-managed, image-heavy marketing site (e.g. Astro, Eleventy, or
Next.js with a lightweight CMS) and implement the design there.

Two implementation notes that matter more than the markup:

- The prototype uses **inline styles only** and a custom `<image-slot>` web component as a drag-and-drop
  image placeholder. Neither is intended for production. Replace `<image-slot>` with real responsive
  `<img>`/`<picture>` elements, and move styling into the project's normal CSS approach.
- All photographs in the prototype are **empty placeholders**. Real images, captions, alt text, and
  permissions are still being collected by Cara (see "Content still to be supplied").

## Fidelity
**High fidelity.** Colours, typography, spacing, layout, section rhythm, and the enlarged-image behaviour
are final-intent and should be recreated closely. The only deliberately unresolved parts are the
photographs themselves and the exact copy in the About and News sections (marked as draft in the design).

## Files
- `Cara Photo.dc.html` — the complete single-page design (all six sections + enlarged-image viewer).
  Open it in a browser to see the design. It renders standalone.
- `image-slot.js` — the placeholder-image web component used by the prototype. **Do not port this**;
  it exists only so Cara can drop images into the mockup.
- `support.js` — runtime for the prototype's component format. **Do not port this.**

## Site architecture
The first release is a **single page with anchor navigation**. Section ids: `#student-work`, `#my-work`,
`#about`, `#classes`, `#news`, `#contact` (plus `#top` for the hero).

Build it so it can later split into separate routes without a redesign:
`/student-work`, `/work`, `/about`, `/classes`, `/news`, `/contact`. Keep each section's markup and data
source self-contained. No dropdown navigation.

## Design tokens

### Colour
| Token | Value | Use |
|---|---|---|
| Paper | `#EEEADD` | Page background |
| Ink | `#171714` | All body text and headings |
| Accent (darkroom red) | `#C53B2F` | Set as CSS custom property `--accent` on `:root` |
| Frame fill | `#e5e1d4` | Empty photograph frame background |
| Rules | `rgba(23,23,20,.3)` | Section dividers, header rule |
| Light rules | `rgba(23,23,20,.25)` | Past-class list rows |
| Frame border | `rgba(23,23,20,.14)` | 1px border on every photograph |
| Secondary text | `rgba(23,23,20,.55)` – `rgba(23,23,20,.85)` | Metadata, labels, muted copy |
| Selection | `rgba(197,59,47,.22)` | `::selection` |
| Lightbox scrim | `rgba(20,19,16,.95)` | Enlarged-image backdrop |
| Lightbox text | `#EEEADD` / `rgba(238,234,221,.65)` | Text and controls on the scrim |

Accent rules: red appears on ONE word of the hero ("Ethereal"), on the "Registration open" status, on the
"Current work" label, on the "Upcoming" news flag, and on link hover / active nav. Never on every link or
heading. **No information may be conveyed by red alone** — status labels always carry text.

### Typography
Two families, both Google Fonts:
- **EB Garamond** (400, 500, and italics) — hero, section headings, statements, news headlines, large
  contact link, pull text. Editorial, slightly old-fashioned, used large and often italic.
- **Courier Prime** (400, 700, italic) — navigation, captions, dates, class metadata, status labels,
  section numbers, footer. Mechanical and archival.

Only these weights/styles are loaded. Keep it that way.

| Element | Size | Details |
|---|---|---|
| Hero title ("Ethereal Aperture") | `clamp(36px, 6.6vw, 140px)` | Garamond 400, `line-height:1`, `letter-spacing:-.02em`, `text-indent:-.03em`, `white-space:nowrap` (must stay on ONE line; wrapping allowed below 620px) |
| Definition headword | 13px | Courier, uppercase, `letter-spacing:.16em` |
| Definition text | 19px | Garamond italic, `line-height:1.5` |
| Definition gloss | 14px | Courier, `line-height:1.7`, `rgba(23,23,20,.8)` |
| Hero statement | `clamp(24px, 2.5vw, 40px)` | Garamond italic, `line-height:1.24`, `max-width:22ch` |
| Section heading | `clamp(40px, 6vw, 92px)` | Garamond 400, `line-height:.95`, `letter-spacing:-.015em` |
| Section number | 14px | Courier, uppercase, `letter-spacing:.16em`, `vertical-align:super`, 55% ink |
| "Some things I've seen…" sub-line | `clamp(20px, 1.8vw, 28px)` | Garamond italic, 80% ink |
| Class title | `clamp(26px, 2.4vw, 38px)` | Garamond 400, `line-height:1.1` |
| News headline | `clamp(22px, 2vw, 30px)` | Garamond 400, `line-height:1.15` |
| About body | 18px | Garamond, `line-height:1.6`, `max-width:64ch`, `text-wrap:pretty` |
| Contact email | `clamp(22px, 2.4vw, 36px)` | Garamond italic, underline with `text-underline-offset:6px`, `<wbr>` before the `@` so it breaks as `etherealaperturephoto` / `@gmail.com` |
| Nav | 14px | Courier, uppercase, `letter-spacing:.1em`, 10px vertical padding (touch target) |
| Class metadata / list rows | 13–14px | Courier, `line-height:1.9` |
| Captions | 12px | Courier, `line-height:1.5`, `letter-spacing:.02em` |
| Status labels | 12px | Courier, uppercase, `letter-spacing:.14em`, 1px border, `padding:5px 9px` |
| Footer | 12px | Courier, uppercase, `letter-spacing:.1em`, 60% ink |

Body text never below 16px. Must stay readable at 200% browser zoom.

### Spacing and layout
- Outer page margin: `4vw` left and right (≈3–5%).
- Section vertical padding: `min(9vh, 92px)` top and bottom (desktop 70–110px, mobile 50–75px).
- Every section separated by a `1px solid rgba(23,23,20,.3)` top rule. No rounded cards anywhere.
- Galleries: 12-column grid, `gap: 34px 18px` (student work) / `40px 18px` (my work, about).
- Hero: `padding: min(11vh,110px) 0 min(9vh,90px)`, `max-width:1500px`.
- Photograph frames: every photograph is **3:2, uniform width and height** (this was an explicit request —
  do not reintroduce mixed aspect ratios or masonry). `aspect-ratio:3/2`, 1px border, caption 7px below.
- Student work: 4 across on desktop (`grid-column: span 3`). My work: 3 across (`span 4`), with the
  artist-statement block occupying one grid cell in the flow.

### Responsive
Implemented as media queries (the only rules not inline):
- `max-width: 900px` — galleries become `repeat(auto-fill, minmax(240px,1fr))`; class entries and list rows
  stack to a single column.
- `max-width: 620px` — galleries become one column, `gap:26px`; hero title may wrap.
- Nav is five/six short links that wrap — **no hamburger menu**.
- Nothing may depend on hover.

## Screens / views

### Header + hero
- Top row: wordmark "Cara — Ethereal Aperture" (Courier, uppercase, links to `#top`) on the left,
  primary nav on the right, separated from the hero by a 1px rule, `padding-bottom:12px`.
- Nav labels, in order: Student Work · My Work · About · Classes · News · Contact.
- Hero title: **Ethereal Aperture**, with "Ethereal" in italic accent red. One line.
- Below it, a definition list (two columns on desktop, `repeat(auto-fit, minmax(min(100%,300px),1fr))`,
  `gap:26px 44px`, 1px top rule):
  - **ETHEREAL adj.** — "extremely delicate, light, not of this world."
    Gloss: "Photography is fleeting. The light is there for a second and then it isn't, and some of it will
    never come back the same way."
  - **APERTURE n.** — "an opening, hole, or gap; the opening in a lens that admits light."
    Gloss: "The photographs are openings of their own — into what we noticed, what we were willing to look
    at, and what we made from it."
  - Full-width line beneath both: "And I really love alliteration."
- Then a two-column block: the italic statement "Experiments, teaching, mistakes, darkrooms, and other
  things I find by looking closely." and a Courier index block ("CARA — PHOTOGRAPHY, TEACHING / PITTSBURGH,
  PA / ANALOG · CAMERALESS · EXPERIMENTAL", then the numbered section index 01–06).

### 01 Student work
Heading row: section heading left, note right — "A selection pulled from classes. Photographs published
with permission. Click any frame to enlarge."
26 uniform 3:2 frames, 4 across, each with a numbered Courier caption in the order
`NN Student name · Class title · Season Year` (e.g. "01 Joe Smith · Advanced Holga · Summer 2024").
The caption system must support: full name, first name + last initial, first name only, "Anonymous", and
"Student work" — Cara chooses per photograph.

### 02 My work
Heading with the italic sub-line "Some things I've seen through the lens"; right-hand accent label
"Current work · ongoing · changes often". Six uniform 3:2 frames, 3 across, plus one text cell containing
the italic statement ("I'm less interested in a perfect image than in what happens when the process slips,
doubles back, or makes its own decisions."), a short Courier note, and "Selection rotates · 2024—2026".

### 03 About me
Left column: portrait frame (3:2) with a Courier caption. Right column (`span 7`): italic pull line
"I teach classes where the camera is allowed to misbehave.", four paragraphs of 18px body copy
(**draft — Cara to replace**), then two Courier links to Classes and Student work.

### 04 Classes
Heading note: "Small groups. No experience assumed unless the listing says so. Write to me if a class is
full — I keep a list."

**Upcoming** — one `<article>` per class, 12-column: title + description (`span 5`), a `<dl>` of metadata
(`span 4`), status label + call-to-action (`span 3`). Metadata rows use a 9ch Courier label column:
DATES, TIME, WHERE, LEVEL, BRING, COST. Statuses: **Registration open** (accent border + accent text,
prefixed "●"), **Waitlist**, **Coming soon**, plus **Full** and **Completed** as needed (muted border).
Current entries: Darkroom I (open), Cameraless Photography (waitlist), Expired Film Studio (coming soon).
CTAs are `mailto:` links today; they should become real registration URLs when Cara has them.

**Past** — a ruled Courier list, one row per class:
`Term | Class title | one-sentence note | "Photographs →" link` (links into Student Work; ideally a
filtered view of that class once the data model exists).

### 05 News
Newest first, numbered list. Each row: year in a 9ch Courier column, then Garamond headline, one or two
sentences, and an optional accent status ("Upcoming") or external link. Not a blog-card layout.

### 06 Contact
Left: heading, the email as a large italic link (`mailto:etherealaperturephoto@gmail.com`), and
"For classes, photographs, exhibitions, collaborations, or a conversation about process."
Right: Courier block — "BASED IN PITTSBURGH, PA / TEACHING IN THE REGION / REPLIES USUALLY WITHIN A WEEK",
then links: `@etherealaperturephoto`, `@caramiaphoto`, "The Halide Project", and the note
"Students: if you'd rather your name appear differently, or not at all, tell me and I'll change it."
**No contact form** in v1. If one is added later: name, email, message, send. Nothing else.

### Footer
One Courier row: "ETHEREAL APERTURE PHOTOGRAPHY — CARA" · "PHOTOGRAPHS © THEIR MAKERS · PUBLISHED WITH
PERMISSION" · "BACK TO TOP ↑".

## Interactions & behaviour

### Enlarged-image viewer (the only real interactive component)
- Every photograph is a focusable control (`role="button"`, `tabindex="0"`, descriptive `aria-label`).
- Opens on click, and on Enter or Space when focused.
- Renders as `role="dialog" aria-modal="true"` over a `rgba(20,19,16,.95)` scrim: frame number top-left,
  "CLOSE (ESC)" button top-right, the image centred at its own aspect ratio (`object-fit: contain` —
  never `cover`), caption bottom-left, "← PREV" / "NEXT →" bottom-right.
- Closes on the close button, on Escape, and on backdrop click.
- Prev/next cycle through the photographs **in DOM order across both galleries** and wrap around.
- Production additions expected: focus trap, return focus to the triggering figure on close, body scroll
  lock, and swipe on touch (desirable, not required).
- Must not resemble a commercial e-commerce gallery. No captions overlaying the image.

### Navigation
- Anchor links with smooth scrolling (disabled under `prefers-reduced-motion`).
- An IntersectionObserver marks the current section's nav link in accent red + underline
  (`rootMargin: '-45% 0px -50% 0px'`). Quiet, no animation.
- Visible focus ring everywhere: `2px solid var(--accent)`, `outline-offset: 3px`.

### Motion
Minimal by design. Allowed: link underline/colour change, a small opacity fade when the viewer opens,
quiet active-nav indication. **Not allowed:** parallax, continuous image movement, dramatic page
transitions, animated grain, cursor effects, film-development loading animations. Respect
`prefers-reduced-motion` (the prototype disables smooth scroll and transitions).

### Texture
A fixed full-viewport SVG `feTurbulence` grain overlay at `opacity:.5`, `mix-blend-mode:multiply`,
`pointer-events:none`, `z-index:5`. It must stay very low contrast, never interfere with text, and stay
lightweight. In production, consider a small tiled PNG/WebP or keep the inline SVG — but verify it is not
visible as a repeating pattern on high-DPI screens.

## State management
Almost none. The only client state is the viewer: `{ slot, caption, alt, index } | null`, set from the
clicked figure, advanced by prev/next, cleared on close. Everything else is static content.

Prototype-only props (implemented as tweakable knobs, **not** required in production): accent colour,
paper-texture on/off, caption frame numbers on/off.

## Content model
Cara must be able to update all of this without touching the design. Suggested content types:

**Student photograph** — image, alt text, student display name, photograph title (optional), class title,
class date/term, process (optional), display order, permission status (must be confirmed before publish).

**Class** — title, status (`registration open | coming soon | waitlist | full | completed`), start date,
end date, time, location, experience level, description, materials, cost (optional), registration URL,
upcoming/past flag.

**News item** — date or year, headline, short description, external URL (optional), image (optional),
display order.

**Cara's work** — image, alt text, project title (optional), caption, process (optional), date (optional),
display order.

**Singletons** — hero title, hero statement, the two definitions and their glosses, About copy, artist
statement, contact email, social links.

## Images (important)
Photographs are the product; treat their preparation as part of the build.

- Serve **AVIF or WebP** with a JPEG fallback. PNG only where genuinely needed.
- Long edge ~2,000–2,500px for the enlarged view; generate smaller responsive derivatives for the grid.
- Compression must preserve film grain, shadow detail, tonal transitions, intentional blur, and surface
  texture. Aggressive compression that smears grain is a defect.
- Every frame is 3:2 in the layout. Where a photograph's native ratio differs, **do not crop it to fit
  without Cara's approval** — letterbox it inside the frame (`object-fit: contain` on a `#e5e1d4` field) or
  adjust the frame. Avoid `object-fit: cover` wherever it removes meaningful content.
- `loading="lazy"` below the first viewport; reserve width/height or aspect-ratio so layout never jumps.
- Never auto-convert photographs to black and white.
- Alt text describes the visible photograph, not the caption. The prototype's `data-alt` values are
  examples of the right register; Cara or the student approves anything interpretive.

## Accessibility (requirements, not suggestions)
Semantic heading hierarchy; keyboard-accessible navigation and viewer; visible focus states; alt text on
all meaningful photographs and empty `alt` on decorative marks; adequate contrast; no meaning carried by
red alone; body text ≥16px; touch targets ~44px; Escape closes the viewer; labelled controls; no flashing
content; reduced-motion support.

## Performance targets
Usable quickly on a mobile connection; lazy images below the fold; correct responsive sizes; no layout
shift as images load; only the two font families and the weights listed; lightweight texture; minimal JS
(the viewer and the nav observer are all that is needed).

## Metadata
- Title: `Ethereal Aperture — Cara, experimental and analog photography`
- Description: "Student work, classes, current experiments, exhibitions, and notes from Cara's life around
  analog photography."
- Add per-page titles/descriptions and social title/description if the site later splits into routes.
- A social-preview image can be made later from one of Cara's approved photographs.

## Content still to be supplied by Cara
Everything photographic and most proper nouns in the prototype are placeholder:

- 24–30 approved student photographs + display names, class titles and terms, and **written permission**
- 6–12 photographs of her own work, with titles and processes
- A portrait or working photograph for About
- Alt text for every photograph
- Final About copy (the four paragraphs in the design are drafts written in her voice)
- Final artist statement
- Confirmed class dates, locations, costs, and real registration URLs (currently `mailto:`)
- Accurate Halide Project details, Pittsburgh analog festival programme name, and group-show information,
  with real external links (currently `#news` placeholders)
- Instagram URLs confirmed (`@etherealaperturephoto`, `@caramiaphoto`)
- Copyright and credit preferences

Student names in the prototype (Joe Smith, Mara Ellison, R. Okonkwo, Devi P., Tomás Vega, Ines Adler,
Lu Chen, Priya N.) and all class dates/costs are **invented sample data**. Do not publish them.

## Acceptance criteria
- A visitor understands within seconds that Cara works with and teaches experimental analog photography.
- Student work reads as central, not secondary.
- It does not resemble a wedding, commercial, or editorial photographer's portfolio.
- It feels analog without kitschy vintage decoration.
- Layout is irregular but easy to navigate; photographs keep their tonal qualities.
- Cara can add classes, photographs, and news without altering the design.
- Mobile keeps the personality; all content is readable and keyboard accessible.
