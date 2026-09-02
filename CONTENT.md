# How to update the site

All public copy lives in `src/data/`. Change those files and rebuild — you do not need to edit the layout.

Photographs go in `public/photos/`. Point a record at a file with a path that starts with `/photos/…`.

## Photographs

`src/data/student-work.json` and `src/data/my-work.json` are arrays of:

```json
{
  "id": "s01",
  "indexLabel": "01",
  "caption": "Student work · Darkroom I · Fall 2024",
  "alt": "What is visible in the photograph.",
  "src": "/photos/students/s01.webp"
}
```

- Use `src: null` for an empty frame.
- Captions can be a full name, first name + last initial, first name only, `Anonymous`, or `Student work`.
- Only publish a student photograph after written permission is confirmed.
- Alt text describes the picture, not the caption.
- Keep frames 3:2. If a scan is a different ratio, letterbox it — do not crop without Cara's approval.

The About portrait is in `src/data/site.json` (`about.portraitSrc`).

## Classes

`src/data/classes.json`

- `upcoming`: title, description, status, CTA, and optional DATES / TIME / WHERE / LEVEL / BRING / COST rows.
- Status values: `registration-open`, `waitlist`, `coming-soon`, `full`, `completed`.
- `ctaHref` can stay a `mailto:` until a real registration URL exists.
- `past`: term, title, note, and `photosHref` (usually `#student-work`).

## News

`src/data/news.json` — newest first. Optional `flag` (for example `Upcoming`) and optional `linkLabel` / `linkHref`.

## Site-wide copy

`src/data/site.json` — title, description, email, About paragraphs, artist statement. Set `about.draft` to `false` when the About copy is final.

Set `searchable` to `true` when the site should appear in search engines. While it is `false`, pages send `noindex` and `robots.txt` blocks crawlers.

After editing, run `npm run build` locally or push; Render rebuilds on each push to the connected branch.
