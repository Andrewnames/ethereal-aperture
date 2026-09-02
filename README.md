# Ethereal Aperture

Personal site for Cara (Ethereal Aperture, Pittsburgh): student work, current photographs, classes, news, and contact. Built from the design handoff in `design_handoff_ethereal_aperture/`.

## Stack

Astro (Node) on Render, with Render Postgres for copy and photographs. Sign in at `/admin` to edit.

## Local

Copy `.env.example` to `.env` and point `DATABASE_URL` at Postgres.

```bash
npm install
npm run dev
```

## Deploy (Render)

The site is a Render static service. `render.yaml` defines the build:

- Build: `npm ci && npm run build`
- Publish: `./dist`

Connect the GitHub repo in the Render dashboard (New → Static Site), or open:

https://render.com/deploy?repo=https://github.com/Andrewnames/ethereal-aperture

## Test

Test commit.

Another test line.

Terminal push test.
