import { randomUUID } from "node:crypto";
import { query } from "./db";
import { defaultSite } from "./defaults";
import studentWork from "../data/student-work.json";
import myWork from "../data/my-work.json";
import news from "../data/news.json";
import classes from "../data/classes.json";

export async function seedIfEmpty() {
  const existing = await query("SELECT id FROM site_settings WHERE id = 1");
  if (existing.rowCount) return;

  await query("INSERT INTO site_settings (id, data) VALUES (1, $1)", [
    defaultSite(),
  ]);

  for (const [index, photo] of studentWork.entries()) {
    await query(
      `INSERT INTO photos (id, gallery, caption, alt, index_label, sort_order)
       VALUES ($1, 'student', $2, $3, $4, $5)`,
      [photo.id, photo.caption, photo.alt, photo.indexLabel, index],
    );
  }

  for (const [index, photo] of myWork.entries()) {
    await query(
      `INSERT INTO photos (id, gallery, caption, alt, index_label, sort_order)
       VALUES ($1, 'mine', $2, $3, $4, $5)`,
      [photo.id, photo.caption, photo.alt, photo.indexLabel, index],
    );
  }

  await query(
    `INSERT INTO photos (id, gallery, caption, alt, index_label, sort_order)
     VALUES ('portrait', 'portrait', $1, $2, '', 0)`,
    [defaultSite().about.portraitCaption, defaultSite().about.portraitAlt],
  );

  for (const [index, item] of news.entries()) {
    await query(
      `INSERT INTO news (id, year, headline, description, flag, link_label, link_href, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
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

  for (const [index, item] of classes.upcoming.entries()) {
    await query(
      `INSERT INTO classes (id, kind, title, description, status, cta_label, cta_href, dates, time, location, level, bring, cost, sort_order)
       VALUES ($1, 'upcoming', $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
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
       VALUES ($1, 'past', $2, $3, $4, $5, $6)`,
      [randomUUID(), item.title, item.term, item.note, item.photosHref, index],
    );
  }
}
