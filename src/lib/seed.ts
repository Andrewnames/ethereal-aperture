import { randomUUID } from "node:crypto";
import { query } from "./db";
import { defaultSite } from "./defaults";
import studentWork from "../data/student-work.json";
import myWork from "../data/my-work.json";
import news from "../data/news.json";
import classes from "../data/classes.json";

let seeding: Promise<void> | null = null;

export async function seedIfEmpty() {
  if (!seeding) seeding = runSeed();
  await seeding;
}

const PLACE_FIXES: [string, string][] = [
  [
    "darkroom evenings in Lawrenceville, weekend workshops in Braddock, and occasional sessions",
    "darkroom evenings, weekend workshops, and occasional sessions",
  ],
  ["In the darkroom, Lawrenceville, 2026", "In the darkroom, Tremont, 2026"],
  ["Lawrenceville darkroom", "Tremont darkroom"],
  ["Braddock, studio annex", "Ohio City, studio annex"],
  ["Community darkroom, Wilkinsburg", "Community darkroom, Collinwood"],
  ["Millvale ·", "Tremont ·"],
  [
    "Analog Photography Festival, Pittsburgh",
    "Analog Photography Festival, Cleveland",
  ],
  ["festival in Pittsburgh", "festival in Cleveland"],
  ["in and around Pittsburgh", "in and around Cleveland"],
  ["PITTSBURGH, PA", "CLEVELAND, OH"],
  ["Pittsburgh, PA", "Cleveland, OH"],
  ["Lawrenceville", "Tremont"],
  ["Wilkinsburg", "Collinwood"],
  ["Braddock", "Ohio City"],
  ["Millvale", "Tremont"],
  ["Pittsburgh", "Cleveland"],
];

function applyPlaceFixes(value: string) {
  return PLACE_FIXES.reduce(
    (text, [from, to]) => text.replaceAll(from, to),
    value,
  );
}

function relocateValue(value: unknown): unknown {
  if (typeof value === "string") return applyPlaceFixes(value);
  if (Array.isArray(value)) return value.map(relocateValue);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, nested]) => [key, relocateValue(nested)]),
    );
  }
  return value;
}

async function relocateLiveCopy() {
  const settings = await query<{ data: unknown }>(
    "SELECT data FROM site_settings WHERE id = 1",
  );
  const current = settings.rows[0]?.data;
  if (current) {
    const next = relocateValue(current);
    if (JSON.stringify(next) !== JSON.stringify(current)) {
      await query("UPDATE site_settings SET data = $1 WHERE id = 1", [next]);
    }
  }

  const classes = await query<{ id: string; location: string | null; note: string | null }>(
    "SELECT id, location, note FROM classes",
  );
  for (const row of classes.rows) {
    const location = row.location ? applyPlaceFixes(row.location) : row.location;
    const note = row.note ? applyPlaceFixes(row.note) : row.note;
    if (location !== row.location || note !== row.note) {
      await query("UPDATE classes SET location = $2, note = $3 WHERE id = $1", [
        row.id,
        location,
        note,
      ]);
    }
  }

  const newsRows = await query<{
    id: string;
    headline: string;
    description: string;
  }>("SELECT id, headline, description FROM news");
  for (const row of newsRows.rows) {
    const headline = applyPlaceFixes(row.headline);
    const description = applyPlaceFixes(row.description);
    if (headline !== row.headline || description !== row.description) {
      await query(
        "UPDATE news SET headline = $2, description = $3 WHERE id = $1",
        [row.id, headline, description],
      );
    }
  }

  const photos = await query<{ id: string; caption: string }>(
    "SELECT id, caption FROM photos",
  );
  for (const row of photos.rows) {
    const caption = applyPlaceFixes(row.caption);
    if (caption !== row.caption) {
      await query("UPDATE photos SET caption = $2 WHERE id = $1", [
        row.id,
        caption,
      ]);
    }
  }
}

async function runSeed() {
  await query(
    "INSERT INTO site_settings (id, data) VALUES (1, $1) ON CONFLICT (id) DO NOTHING",
    [defaultSite()],
  );
  await relocateLiveCopy();

  const existing = await query<{ n: number }>(
    "SELECT COUNT(*)::int AS n FROM photos",
  );
  if ((existing.rows[0]?.n ?? 0) > 0) return;

  for (const [index, photo] of studentWork.entries()) {
    await query(
      `INSERT INTO photos (id, gallery, caption, alt, index_label, sort_order)
       VALUES ($1, 'student', $2, $3, $4, $5)
       ON CONFLICT (id) DO NOTHING`,
      [photo.id, photo.caption, photo.alt, photo.indexLabel, index],
    );
  }

  for (const [index, photo] of myWork.entries()) {
    await query(
      `INSERT INTO photos (id, gallery, caption, alt, index_label, sort_order)
       VALUES ($1, 'mine', $2, $3, $4, $5)
       ON CONFLICT (id) DO NOTHING`,
      [photo.id, photo.caption, photo.alt, photo.indexLabel, index],
    );
  }

  await query(
    `INSERT INTO photos (id, gallery, caption, alt, index_label, sort_order)
     VALUES ('portrait', 'portrait', $1, $2, '', 0)
     ON CONFLICT (id) DO NOTHING`,
    [defaultSite().about.portraitCaption, defaultSite().about.portraitAlt],
  );

  const newsCount = await query<{ n: number }>(
    "SELECT COUNT(*)::int AS n FROM news",
  );
  if ((newsCount.rows[0]?.n ?? 0) === 0) {
    for (const [index, item] of news.entries()) {
      await query(
        `INSERT INTO news (id, year, headline, description, flag, link_label, link_href, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (id) DO NOTHING`,
        [
          randomUUID(),
          item.year,
          item.headline,
          item.description,
          item.flag ?? null,
          item.linkLabel ?? null,
          item.linkHref ?? null,
          index,
        ],
      );
    }
  }

  const classCount = await query<{ n: number }>(
    "SELECT COUNT(*)::int AS n FROM classes",
  );
  if ((classCount.rows[0]?.n ?? 0) === 0) {
    for (const [index, item] of classes.upcoming.entries()) {
      await query(
        `INSERT INTO classes (id, kind, title, description, status, cta_label, cta_href, dates, time, location, level, bring, cost, sort_order)
         VALUES ($1, 'upcoming', $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
         ON CONFLICT (id) DO NOTHING`,
        [
          randomUUID(),
          item.title,
          item.description,
          item.status,
          item.ctaLabel,
          item.ctaHref,
          item.dates ?? null,
          item.time ?? null,
          item.where ?? null,
          item.level ?? null,
          item.bring ?? null,
          item.cost ?? null,
          index,
        ],
      );
    }

    for (const [index, item] of classes.past.entries()) {
      await query(
        `INSERT INTO classes (id, kind, title, term, note, photos_href, sort_order)
         VALUES ($1, 'past', $2, $3, $4, $5, $6)
         ON CONFLICT (id) DO NOTHING`,
        [randomUUID(), item.title, item.term, item.note, item.photosHref, index],
      );
    }
  }
}
