# Ethereal Aperture

Personal site for Cara (Ethereal Aperture, Pittsburgh): student work, current photographs, classes, news, and contact. Built from the design handoff in `design_handoff_ethereal_aperture/`.

## Stack

Astro, static HTML. Content is JSON in `src/data/` so classes, photographs, and news can change without touching the design.

## Local

```bash
npm install
npm run dev
```

```bash
npm run build
npm run preview
```

## Content

See [CONTENT.md](CONTENT.md). Photographs are still being collected; frames render empty until `src` is set. Invented student names from the prototype are not used.

## Deploy (Render)

The site is a Render static service. `render.yaml` defines the build:

- Build: `npm ci && npm run build`
- Publish: `./dist`

Connect the GitHub repo in the Render dashboard (New → Static Site), or open:

https://render.com/deploy?repo=https://github.com/Andrewnames/ethereal-aperture

Pushes to the connected branch rebuild the site.
