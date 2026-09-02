import { query } from "./db";
import { seedIfEmpty } from "./seed";
import { defaultSite } from "./defaults";
import type {
  NewsItem,
  PastClass,
  Photo,
  SiteContent,
  SiteSettings,
  UpcomingClass,
} from "./types";

function photoSrc(id: string, hasFile: boolean) {
  return hasFile ? `/media/${id}` : null;
}

function mapPhoto(row: {
  id: string;
  gallery: Photo["gallery"];
  caption: string;
  alt: string;
  index_label: string;
  sort_order: number;
  has_file: boolean;
}): Photo {
  return {
    id: row.id,
    gallery: row.gallery,
    caption: row.caption,
    alt: row.alt,
    indexLabel: row.index_label,
    sortOrder: row.sort_order,
    hasFile: row.has_file,
    src: photoSrc(row.id, row.has_file),
  };
}

export async function getSite(): Promise<SiteSettings> {
  await seedIfEmpty();
  const result = await query<{ data: SiteSettings }>(
    "SELECT data FROM site_settings WHERE id = 1",
  );
  return { ...defaultSite(), ...(result.rows[0]?.data ?? {}) };
}

export async function saveSite(data: SiteSettings) {
  await query(
    `INSERT INTO site_settings (id, data) VALUES (1, $1)
     ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data`,
    [data],
  );
}

export async function listPhotos(gallery?: Photo["gallery"]) {
  await seedIfEmpty();
  const result = gallery
    ? await query(
        `SELECT id, gallery, caption, alt, index_label, sort_order, (bytes IS NOT NULL) AS has_file
         FROM photos WHERE gallery = $1 ORDER BY sort_order, id`,
        [gallery],
      )
    : await query(
        `SELECT id, gallery, caption, alt, index_label, sort_order, (bytes IS NOT NULL) AS has_file
         FROM photos ORDER BY gallery, sort_order, id`,
      );
  return result.rows.map((row) =>
    mapPhoto(row as Parameters<typeof mapPhoto>[0]),
  );
}

export async function getPhotoFile(id: string) {
  const result = await query<{ mime: string; bytes: Buffer }>(
    "SELECT mime, bytes FROM photos WHERE id = $1 AND bytes IS NOT NULL",
    [id],
  );
  return result.rows[0] ?? null;
}

export async function upsertPhoto(input: {
  id?: string;
  gallery: Photo["gallery"];
  caption: string;
  alt: string;
  indexLabel: string;
  file?: { bytes: Buffer; mime: string } | null;
}) {
  const id = input.id || crypto.randomUUID();
  const existing = await query<{ sort_order: number }>(
    "SELECT sort_order FROM photos WHERE id = $1",
    [id],
  );

  if (existing.rowCount) {
    await query(
      `UPDATE photos SET gallery = $2, caption = $3, alt = $4, index_label = $5
       WHERE id = $1`,
      [id, input.gallery, input.caption, input.alt, input.indexLabel],
    );
  } else {
    const max = await query<{ n: number }>(
      "SELECT COALESCE(MAX(sort_order), -1) + 1 AS n FROM photos WHERE gallery = $1",
      [input.gallery],
    );
    await query(
      `INSERT INTO photos (id, gallery, caption, alt, index_label, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        id,
        input.gallery,
        input.caption,
        input.alt,
        input.indexLabel,
        max.rows[0]?.n ?? 0,
      ],
    );
  }

  if (input.file) {
    await query("UPDATE photos SET mime = $2, bytes = $3 WHERE id = $1", [
      id,
      input.file.mime,
      input.file.bytes,
    ]);
  }

  return id;
}

export async function deletePhoto(id: string) {
  if (id === "portrait") {
    await query("UPDATE photos SET mime = NULL, bytes = NULL WHERE id = $1", [
      id,
    ]);
    return;
  }
  await query("DELETE FROM photos WHERE id = $1", [id]);
}

export async function listNews(): Promise<NewsItem[]> {
  await seedIfEmpty();
  const result = await query(
    `SELECT id, year, headline, description, flag, link_label, link_href, sort_order
     FROM news ORDER BY sort_order, year DESC`,
  );
  return result.rows.map((row) => ({
    id: row.id,
    year: row.year,
    headline: row.headline,
    description: row.description,
    flag: row.flag ?? undefined,
    linkLabel: row.link_label ?? undefined,
    linkHref: row.link_href ?? undefined,
    sortOrder: row.sort_order,
  }));
}

export async function upsertNews(item: Omit<NewsItem, "sortOrder"> & { sortOrder?: number }) {
  const id = item.id || crypto.randomUUID();
  const existing = await query("SELECT id FROM news WHERE id = $1", [id]);
  if (existing.rowCount) {
    await query(
      `UPDATE news SET year = $2, headline = $3, description = $4, flag = $5, link_label = $6, link_href = $7
       WHERE id = $1`,
      [
        id,
        item.year,
        item.headline,
        item.description,
        item.flag || null,
        item.linkLabel || null,
        item.linkHref || null,
      ],
    );
  } else {
    const max = await query<{ n: number }>(
      "SELECT COALESCE(MAX(sort_order), -1) + 1 AS n FROM news",
    );
    await query(
      `INSERT INTO news (id, year, headline, description, flag, link_label, link_href, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        id,
        item.year,
        item.headline,
        item.description,
        item.flag || null,
        item.linkLabel || null,
        item.linkHref || null,
        item.sortOrder ?? max.rows[0]?.n ?? 0,
      ],
    );
  }
}

export async function deleteNews(id: string) {
  await query("DELETE FROM news WHERE id = $1", [id]);
}

export async function listUpcoming(): Promise<UpcomingClass[]> {
  await seedIfEmpty();
  const result = await query(
    `SELECT * FROM classes WHERE kind = 'upcoming' ORDER BY sort_order, title`,
  );
  return result.rows.map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description ?? "",
    status: row.status,
    ctaLabel: row.cta_label ?? "",
    ctaHref: row.cta_href ?? "",
    dates: row.dates ?? undefined,
    time: row.time ?? undefined,
    where: row.location ?? undefined,
    level: row.level ?? undefined,
    bring: row.bring ?? undefined,
    cost: row.cost ?? undefined,
    sortOrder: row.sort_order,
  }));
}

export async function listPast(): Promise<PastClass[]> {
  await seedIfEmpty();
  const result = await query(
    `SELECT * FROM classes WHERE kind = 'past' ORDER BY sort_order, title`,
  );
  return result.rows.map((row) => ({
    id: row.id,
    term: row.term ?? "",
    title: row.title,
    note: row.note ?? "",
    photosHref: row.photos_href ?? "#student-work",
    sortOrder: row.sort_order,
  }));
}

export async function upsertUpcoming(item: Omit<UpcomingClass, "sortOrder">) {
  const id = item.id || crypto.randomUUID();
  const existing = await query("SELECT id FROM classes WHERE id = $1", [id]);
  if (existing.rowCount) {
    await query(
      `UPDATE classes SET title = $2, description = $3, status = $4, cta_label = $5, cta_href = $6,
        dates = $7, time = $8, location = $9, level = $10, bring = $11, cost = $12
       WHERE id = $1`,
      [
        id,
        item.title,
        item.description,
        item.status,
        item.ctaLabel,
        item.ctaHref,
        item.dates || null,
        item.time || null,
        item.where || null,
        item.level || null,
        item.bring || null,
        item.cost || null,
      ],
    );
  } else {
    const max = await query<{ n: number }>(
      "SELECT COALESCE(MAX(sort_order), -1) + 1 AS n FROM classes WHERE kind = 'upcoming'",
    );
    await query(
      `INSERT INTO classes (id, kind, title, description, status, cta_label, cta_href, dates, time, location, level, bring, cost, sort_order)
       VALUES ($1, 'upcoming', $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
      [
        id,
        item.title,
        item.description,
        item.status,
        item.ctaLabel,
        item.ctaHref,
        item.dates || null,
        item.time || null,
        item.where || null,
        item.level || null,
        item.bring || null,
        item.cost || null,
        max.rows[0]?.n ?? 0,
      ],
    );
  }
}

export async function upsertPast(item: Omit<PastClass, "sortOrder">) {
  const id = item.id || crypto.randomUUID();
  const existing = await query("SELECT id FROM classes WHERE id = $1", [id]);
  if (existing.rowCount) {
    await query(
      `UPDATE classes SET title = $2, term = $3, note = $4, photos_href = $5 WHERE id = $1`,
      [id, item.title, item.term, item.note, item.photosHref],
    );
  } else {
    const max = await query<{ n: number }>(
      "SELECT COALESCE(MAX(sort_order), -1) + 1 AS n FROM classes WHERE kind = 'past'",
    );
    await query(
      `INSERT INTO classes (id, kind, title, term, note, photos_href, sort_order)
       VALUES ($1, 'past', $2, $3, $4, $5, $6)`,
      [id, item.title, item.term, item.note, item.photosHref, max.rows[0]?.n ?? 0],
    );
  }
}

export async function deleteClass(id: string) {
  await query("DELETE FROM classes WHERE id = $1", [id]);
}

export async function getSiteContent(): Promise<SiteContent> {
  const [site, studentWork, myWork, portraits, news, upcoming, past] =
    await Promise.all([
      getSite(),
      listPhotos("student"),
      listPhotos("mine"),
      listPhotos("portrait"),
      listNews(),
      listUpcoming(),
      listPast(),
    ]);

  return {
    site,
    studentWork,
    myWork,
    portrait: portraits[0] ?? null,
    news,
    upcoming,
    past,
  };
}
